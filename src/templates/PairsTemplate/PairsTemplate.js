import React, {useEffect, useState, useRef, useCallback} from "react";
import {throttle} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {RESET_TYPE, SOUNDS as S, PAIRS as st, EX_CONTENT_TYPE} from "../../lib/const";
import {shuffleId} from "../../lib/utils";
import EqualsSvg from "../../components/svg/EqualsSvg";
import Question from "../../components/svg/QuestionSvg";
import {setBtnAction, setLessonNext, setLessonReset, setLose} from "../../store/actions";
import DragBox from "../../components/Animations/DragBox";
import {resetStates, setFullWin} from "../../lib/yutuManager";
import {EventBus} from "../../lib/EventBus";
import SimpleImage from "../../components/Images/SimpleImage";

import {motion, useAnimationControls} from "framer-motion";
import "./style.scss";
import {lessonCompletion, onLessonReset} from "../../components/MainComponent/Manager";
// import Shake from "../../components/Animations/Shake";

const btnSizeCoef = 1;
const lessonType = EX_CONTENT_TYPE.pair;

const PairsTemplate = props => {

	// ? props
	const {
		ex,
		exerciseDone,
	} = props;

	const dispatch = useDispatch();

	// ? store
	const currentId = useSelector(state => state.currentId);
	const panelSize = useSelector(state => state.panelSize);
	const pairPoses = useSelector(state => state.pairPoses);
	const allImages = useSelector(state => state.allImages);
	const btnAction = useSelector(state => state.btnAction);
	const coef = useSelector(state => state.baseCoef);
	const baseViewSize = useSelector(state => state.baseViewSize);
	const bug = useSelector(state => state.lose);

	// ? state
	const [done, setDone] = useState(false);
	const [error, setError] = useState(false)
	const [pairs, setPairs] = useState([]);
	const [images, setImages] = useState([]);
	const [imPoses, setImPoses] = useState([]);
	const [rightImages, setRightImages] = useState([]);
	const [lineLight, setLineLight] = useState([false, false, false]);
	const [imageLight, setImageLight] = useState(false);
	const [currentCardId, setCurrentCardId] = useState(-1);
	const [currentImageId, setCurrentImageId] = useState(-1);
	const [anim, setAnim] = useState(true);


	// ? refs
	const imagesRef = useRef([]);
	const rightImagesRef = useRef([]);
	// const shake = useRef(new Animated.Value(0)).current;
	const dragging = useRef(null);
	const posYRef = useRef(0);

	const controls = useAnimationControls()

	// ? callbacks
	const checkLight = useCallback(
		throttle(
			(pos, isImage = true) => _checkLight(pos, isImage), 100
		), []);

	// ? effects
	useEffect(() => {
		if (ex.id === currentId) {
			switch (btnAction) {
				case RESET_TYPE:
					reset();
					break;
			}
			if (btnAction !== "") {
				dispatch(setBtnAction(""))
			}
		}
	}, [btnAction])

	useEffect(() => {
		if (error) {
			if (exerciseDone) {
				onLessonReset();
			}
			dispatch(setLose(true))
		} else {
			dispatch(setLose(false))
		}
	}, [error])

	useEffect(() => {
		if (ex.id === currentId && !bug) {
			reset();
		}
	}, [bug])

	useEffect(() => {
		if (ex && pairPoses) {
			const data = ex[lessonType];
			if (data.images) {
				generatePairs(data.images.pairs, data.images.other)
			}
		}
	}, [ex, pairPoses])

	useEffect(() => {
		if (currentId === ex.id) {
			setTimeout(() => {
				controls.start(x => {
					return {
						left: x,
						transition: {type: "spring", bounce: 0.5, duration: 1, delay: 0.5}
					}
				}).then(() => setAnim(false))
			}, 100)
		}
	}, [currentId])

	useEffect(() => {
		if (currentId === ex.id) {
			if (!exerciseDone) {
				let reset = false;
				rightImages.forEach(rIm => {
					if (rIm.uri) {
						reset = true;
					}
				})
				dispatch(setLessonReset(reset))
			}
		}
	}, [currentId, rightImages])

	useEffect(() => {
		if (rightImages.length) {
			let check = true;
			let full = true;
			rightImages.forEach((rIm, index) => {
				if (!rIm.uri) {
					full = false;
				} else if (rIm.pairId !== pairs[index].pairId) {
					check = false;
				}
			})
			if (full) {
				if (check) {
					win()
				} else {
					lose()
				}
			} else {
				setError(false);
				setDone(false);
				if (exerciseDone) {
					onLessonReset()
				}
			}
		}
	}, [rightImages])

	const generatePairs = (correct, other, force = false) => {
		const correctArr = [];
		const newRightImages = [];
		let otherArr = [];
		correct.forEach((pair, index) => {
			if (pair && pair[0] !== "") {
				correctArr.push({pairId: index + 1, uri: pair[0]})
				if (!exerciseDone || force) {
					otherArr.push({pairId: index + 1, uri: pair[1]});
					newRightImages.push({pairId: 0, pos: pairPoses.images[index * 3 + 2], uri: null})
				} else {
					otherArr.push({pairId: 0, uri: null});
					newRightImages.push({pairId: index + 1, uri: pair[1], pos: pairPoses.images[index * 3 + 2]})
				}
			}
		});
		other.forEach(url => {
			if (url && url.length) {
				otherArr.push({pairId: 0, uri: url})
			}
		})

		const otherCount = otherArr.length;
		const delta = otherCount % 2 == 0 ? (pairPoses.varPadding + pairPoses.varSize) * 0.5 : 0;
		if (otherCount > 0) {
			const arr = []
			pairPoses.vars.forEach((v, i) => {
				if (i < otherCount) {
					arr.push({x: v.x - delta, y: v.y})
				}
			})
			setImPoses(arr)
		} else {
			setImPoses(pairPoses.vars);
		}
		otherArr = shuffleId(otherArr);
		setPairs(correctArr);
		_setImages(otherArr);
		_setRightImages(newRightImages);
		if (exerciseDone && !force) {
			setDone(true);
		}
	}

	const _setImages = arr => {
		setImages(arr);
		imagesRef.current = arr;
	}

	const _setRightImages = arr => {
		setRightImages(arr);
		rightImagesRef.current = arr;
	}

	const _checkLight = (pos, isImage = true) => {
		const lineIndex = checkLineId(pos.y);
		const varIllumination = lineIndex < 0 && isImage && pos.y > pairPoses.varY - pairPoses.halfvarSize;
		lineIllumination(lineIndex, varIllumination);
	}

	const calculatePosY = (pos, index, isImage) => {
		const posY = isImage ? pairPoses.linesY[index] : pairPoses.varY;
		const delta = isImage ? pairPoses.halfImSize : pairPoses.halfvarSize;
		return posY + pos.y - delta;
	}

	const checkLineId = y => {
		let lineIndex = -1;
		pairPoses.linesY.forEach((line, i) => {
			if (i < rightImagesRef.current.length) {
				if (line - pairPoses.halfImSize < y && line + pairPoses.halfImSize > y) {
					lineIndex = i
				}
			}
		})

		return lineIndex;
	}

	const paste = (pos, index, isImage = true) => {
		changeImageState(-1);
		changeCardState(-1);
		let id = checkLineId(pos.y)
		if (id >= 0) {
			if (!isImage) {
				changeImage(index, id);
			} else {

				if (id !== index) {
					EventBus.$emit(S.play, {name: S.right})
					const tempImg = Object.assign({}, rightImagesRef.current[index]);

					const newRightImages = rightImagesRef.current.slice();
					newRightImages[index].pairId = rightImagesRef.current[id].pairId;
					newRightImages[index].uri = rightImagesRef.current[id].uri;
					newRightImages[id].pairId = tempImg.pairId;
					newRightImages[id].uri = tempImg.uri;

					_setRightImages(newRightImages);
				}
			}
		} else if (isImage) {
			let imageId = -1;
			imagesRef.current.forEach((im, i) => {
				if (imageId < 0 && !im.uri) imageId = i
			})
			if (imageId >= 0) {
				changeImage(imageId, index);
			}
		} else {
			EventBus.$emit(S.play, {name: S.fail})
		}
		setTimeout(() => {
			lineIllumination();
		}, 150);
		posYRef.current = 0
	}

	const lineIllumination = (index = -1, vars = false) => {
		setLineLight(index);
		setImageLight(vars)
	}

	const changeImage = (imageId, cardId) => {
		EventBus.$emit(S.play, {name: S.right})
		const tempImg = Object.assign({}, imagesRef.current[imageId]);

		const newImages = imagesRef.current.slice();
		newImages[imageId].pairId = rightImagesRef.current[cardId].pairId;
		newImages[imageId].uri = rightImagesRef.current[cardId].uri;

		const newRightImages = rightImagesRef.current.slice();
		newRightImages[cardId].pairId = tempImg.pairId;
		newRightImages[cardId].uri = tempImg.uri;

		_setImages(newImages)
		_setRightImages(newRightImages);
	}

	const changeImageState = index => {
		setCurrentImageId(index)
		dragging.current = index >= 0;
	}

	const changeCardState = index => {
		setCurrentCardId(index)
		dragging.current = index >= 0;
	}

	const win = () => {
		dispatch(setLessonReset(true))
		dispatch(setLessonNext(true))
		setDone(true);
		lineIllumination();
		if (!exerciseDone) {
			lessonCompletion();
			setFullWin();
			EventBus.$emit(S.play, {name: S.win})
		}
	}

	const lose = () => {
		setError(true);
		setDone(false);
		dispatch(setLose(true));
		lineIllumination();
		EventBus.$emit(S.play, {name: S.error})
	}

	const reset = () => {
		onLessonReset();
		resetStates(["win", "confetti", "next", "reset"])
		lineIllumination();
		setDone(false);
		if (ex[lessonType].images) {
			generatePairs(ex[lessonType].images.pairs, ex[lessonType].images.other, true)
		}
	}

	const checkStyle = index => {
		let style = "cardWrapper";
		if (error) {
			style += " cardWrapper-error"
		} else if (lineLight === index) {
			style += " cardWrapper-chosen"
		} else if (done) {
			style += " cardWrapper-success"
		}
		return style;
	}

	return (
		<div className="pairsTemplate">

			{/* основной блок */}
			<div style={baseViewSize}>

				{/* пары */}
				{
					ex.id === currentId && pairPoses && pairPoses.images.map((pos, i) => {
						let index = Math.floor(i / 3);
						if (pairs[index]) {
							if (i % 3 === 1) {
								return (
									<div
										style={{
											position: "absolute",
											top: pos.y,
											left: pos.x,
										}}
										key={i}
									>
										<EqualsSvg
											size={{x: pairPoses.equalsSize.x, y: pairPoses.equalsSize.y}}
											fill={error ? st.red : done ? st.green : lineLight === index ? st.blue : "#A1ABCD"}
										/>
									</div>
								)
							} else if (i % 3 === 2) {
								if (rightImages[index].uri) {
									return (
										<DragBox
											x={pos.x}
											y={pos.y}
											onMouseDown={() => {
												changeImageState(index)
											}}
											onMouseMove={(pos) => {
												checkLight(pos)
											}}
											onMouseUp={(pos) => {
												paste(pos, index)
											}}
											onMouseClick={() => {
												paste(null, index)
											}}
											key={i}
										>
											<div
												className={checkStyle(index)}
												style={{
													height: pairPoses.imageSize,
													width: pairPoses.imageSize,
												}}
											>
												<SimpleImage
													style={
														{
															height: pairPoses.maxImageSize,
															width: pairPoses.maxImageSize,
														}}
													image={rightImages[index].uri}
												/>
											</div>
										</DragBox>
									)
								}
								return (
									<motion.div
										className={"question " + (lineLight === index ? "question-chosen" : "")}
										style={{
											height: pairPoses.imageSize,
											width: pairPoses.imageSize,
											top: pos.y,
											left: anim ? pairPoses.centerImagePos : pos.x,
										}}
										animate={controls}
										custom={pos.x}
										key={i}
									>
										<Question
											size={{x: 40 * coef, y: 40 * coef}}
											fill={"#57ADFD"}
										/>
									</motion.div>
								)
							} else {
								return (
									<motion.div
										className={checkStyle(index)}
										style={{
											top: pos.y,
											left: pairPoses.centerImagePos,
											height: pairPoses.imageSize,
											width: pairPoses.imageSize,
											backgroundColor: "#FFF",
											zIndex: 18,
										}}
										animate={controls}
										custom={pos.x}
										key={i}
									>
										<SimpleImage
											show={!!pairs[index].uri}
											image={pairs[index].uri || ""}
											style={{
												height: pairPoses.maxImageSize,
												width: pairPoses.maxImageSize,
											}}
										/>
									</motion.div>
								)
							}
						}
					})
				}

				{/* варианты */}
				<div className="varsWrapper">
					<div className="varsContainer">
						{
							pairPoses && imPoses.map((pPose, index) => {
								return (
									<DragBox
										onMouseDown={() => {
											changeCardState(index)
										}}
										onMouseMove={(pos) => {
											checkLight(pos, false)
										}}
										onMouseUp={(pos) => {
											paste(pos, index, false)
										}}
										scale={currentId === ex.id && !exerciseDone && anim}
										scaling={true}
										shake={false}
										key={index}
										x={pPose.x}
										y={pPose.y}
										dis={!images[index].uri}
									>
										<div
											className="varBox"
											style={{
												height: currentCardId !== index ? pairPoses.varSize : pairPoses.dragImageSize,
												width: currentCardId !== index ? pairPoses.varSize : pairPoses.dragImageSize,
											}}
										>
											{!!images[index].uri ?
												<SimpleImage
													show={!!images[index].uri}
													style={{
														height: currentCardId !== index ? pairPoses.minImageSize : pairPoses.dragImageSize,
														width: currentCardId !== index ? pairPoses.minImageSize : pairPoses.dragImageSize,
													}}
													image={images[index].uri || ""}
												/> :
												<div style={{
													backgroundColor: "#E1E4FB",
													width: 16 * coef,
													height: 16 * coef,
													borderRadius: 16 * coef
												}}/>
											}
										</div>
									</DragBox>
								)
							})
						}
					</div>
				</div>

			</div>

		</div>
	)
}

export default PairsTemplate;