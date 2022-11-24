import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {EX_CONTENT_TYPE, RESET_TYPE, SOUNDS as S} from "../../lib/const";
import {shuffleId} from "../../lib/utils";
import {setBtnAction, setLessonReset} from "../../store/actions";
import {resetStates, setFullWin} from "../../lib/yutuManager";
import {EventBus} from "../../lib/EventBus";
import YutuSvg from "../../components/svg/YutuSvg";
import CheckSvg from "../../components/svg/CheckSvg";
import {onLessonReset} from "../../components/MainComponent/Manager";
import SimpleImage from "../../components/Images/SimpleImage";
import FlipCard from "../../components/Animations/FlipCard";
import {motion, useAnimationControls} from "framer-motion";
import "./style.scss"

const smallYutu = {x: 63, y: 86}
const bigYutu = {x: 82, y: 116}
const timer = 3000;
const lessonType = EX_CONTENT_TYPE.memory;


const MemoryTemplate = props => {

	// ? props
	const {
		ex,
		exerciseDone
	} = props;

	// ? refs
	const cardsRef = useRef([]);
	const jiggleRef = useRef(null);
	const cardFlipperRef = useRef([]);
	const cardFlippedRef = useRef([]);
	const currentRef = useRef([]);
	const correctRef = useRef([]);

	// ? store
	const panelSize = useSelector(state => state.panelSize);
	const currentId = useSelector(state => state.currentId);
	const coef = useSelector(state => state.baseCoef);
	const allImages = useSelector(state => state.allImages);
	const baseViewSize = useSelector(state => state.baseViewSize);
	const btnAction = useSelector(state => state.btnAction);
	const mascotSettings = useSelector(state => state.mascotSettings);

	const dispatch = useDispatch();

	const controls = useAnimationControls()

	// ? state
	const [images, setImages] = useState([]);
	const [correctCards, setCorrectCards] = useState([]);
	const [currentCards, setCurrentCards] = useState([]);
	const [size, setSize] = useState(50);
	const [yutuSize, setYutuSize] = useState(bigYutu);
	const [padding, setPadding] = useState(12);
	const [cardFlipped, setCardFlipped] = useState([]);
	const [jiggleIndex, setJiggleIndex] = useState(-1)
	const [anim, setAnim] = useState(true);
	const [big, setBig] = useState(false);

	// ? effects
	useEffect(() => {
		if (ex) {
			const data = ex[lessonType]
			if (data && data.images && data.images.values) {
				generateRandomImages()
			}
		}
	}, [ex]);

	useEffect(() => {
		measurePage(mascotSettings.size)
		return () => {
			stopInterval();
		};
	}, []);

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
		if (ex.id === currentId) {
			controls.start(x => {
				return {
					scale: 1,
					transition: {type: "spring", bounce: 0.2, duration: 0.5, delay: x}
				}
			})
			setTimeout(() => {
				setAnim(false)
			}, 500)
		}
	}, [currentId])

	useEffect(() => {
		dispatch(setLessonReset(correctCards.length || currentCards.length))
	}, [correctCards, currentCards])

	// ? functions
	const measurePage = (layout) => {
		const big = ex[lessonType].images.values.filter(val => !!val).length < 4;
		const {width, height} = layout
		const dHeight = height - panelSize.down - 80 * coef
		if (big) {
			let size = (width - 50) / 2;
			if (size > dHeight / 3) {
				size = dHeight / 3
			}
			setPadding((width - 24 - size * 2) / 2)
			setSize(size)
			setYutuSize(bigYutu)
			setBig(true)
		} else {
			let size = (width - 60) / 3;
			if (size > dHeight / 4) {
				size = dHeight / 4
			}
			setSize(size)
			setYutuSize(smallYutu)
		}
	}

	const generateRandomImages = () => {
		let newImages = [];
		let count = -1
		ex[lessonType].images.values.forEach((img, index) => {
			if (img && img.length) {
				count += 1;
				newImages.push(createNewCard(img, count, index));
				count += 1;
				newImages.push(createNewCard(img, count, index));
			}
		})
		newImages = shuffleId(newImages)
		setImages(newImages)
		cardFlipperRef.current = newImages.map(im => im.id);
		const emptyArr = newImages.map(_ => false)
		_setCardFlipped(emptyArr);
	}

	const _setCardFlipped = value => {
		cardFlippedRef.current = value
		setCardFlipped(value)
	}

	const createNewCard = (img, count, index) => {
		return {
			url: img,
			id: count,
			pairId: index,
		}
	}

	useEffect(() => {
		if (currentId === ex.id && cardFlipperRef.current.length > 0 && !exerciseDone) {
			changeInterval()
		} else {
			stopInterval()
		}
	}, [currentId, cardFlipperRef]);

	const changeInterval = () => {
		if (cardFlipperRef.current.length > 0) {
			stopInterval()
			jiggleRef.current = setInterval(() => {
				const id = Math.floor(Math.random() * cardFlipperRef.current.length);
				if (cardsRef.current && cardsRef.current[cardFlipperRef.current[id]]) {
					setJiggleIndex(cardFlipperRef.current[id]);
				}
			}, timer);
		} else {
			stopInterval()
		}
	}

	const stopInterval = () => {
		if (jiggleRef.current) {
			clearInterval(jiggleRef.current)
			jiggleRef.current = null;
		}
	}

	const checkCurrentCards = () => {
		if (currentRef.current.length === 2) {
			if (images[currentRef.current[0]].pairId !== images[currentRef.current[1]].pairId) {
				const arr = currentRef.current.slice();
				arr.forEach(cCard => {
					cardFlip(cCard, true);
				})
				EventBus.$emit(S.play, {name: S.flip.error});
			} else {
				let newCorrect = correctRef.current.slice();
				newCorrect = newCorrect.concat(currentRef.current.slice());
				_setCorrectCards(newCorrect)
				checkWin(newCorrect);
				EventBus.$emit(S.play, {name: S.flip.right});
			}
			_setCurrentCards([]);
		}
	}

	const checkWin = arr => {
		if (arr.length === images.length) {
			EventBus.$emit(S.play, {name: S.win});
			setFullWin();
			stopInterval()
		}
	}

	const cardFlip = (index, force = false) => {
		if ((currentRef.current.length < 2 && !correctRef.current.includes(index) && !currentRef.current.includes(index)) || force) {
			const indexFlipperCard = cardFlipperRef.current.indexOf(index);
			if (indexFlipperCard > -1) {
				cardFlipperRef.current.splice(indexFlipperCard, 1)
				const curCards = currentRef.current.slice();
				curCards.push(index);
				_setCurrentCards(curCards)
			} else {
				cardFlipperRef.current.push(index);
			}
			changeInterval();
			EventBus.$emit(S.play, {name: S.flip.base});
			cardFlippedRef.current[index] = !cardFlippedRef.current[index];
			setCardFlipped(cardFlippedRef.current)
		}
	}

	const _setCorrectCards = value => {
		setCorrectCards(value);
		correctRef.current = value
	}

	const _setCurrentCards = value => {
		setCurrentCards(value)
		currentRef.current = value
	}

	useEffect(() => {
		if (currentCards.length === 2) {
			setTimeout(() => {
				checkCurrentCards()
			}, 500);
		}
	}, [currentCards]);

	const reset = () => {
		stopInterval();
		onLessonReset();
		resetStates(["NRWC"]);
		_setCorrectCards([])
		_setCurrentCards([])
		cardFlipperRef.current = images.map(im => im.id);
		const emptyArr = images.map(_ => false)
		_setCardFlipped(emptyArr);
		setTimeout(() => {
			generateRandomImages();
			changeInterval();
		}, 400)
	}

	return <div className="memoryTemplate" style={baseViewSize}>
		<div
			className="memoryBox"
			style={{
				paddingHorizontal: padding,
			}}
		>
			{
				allImages && ex.id === currentId && images.map((image, index) => {
					const correct = correctCards.includes(index) || exerciseDone;

					const separator = images.length === 12 ? 3 : 2
					const delta = Math.floor(index / separator) * 0.33
					return (
						<motion.div
							style={{
								scale: anim ? 0 : 1,
							}}
							animate={controls}
							custom={delta}
							key={index}
						>
							<FlipCard
								ref={el => cardsRef.current[index] = el}
								onClick={() => cardFlip(index)}
								flipped={cardFlipped[index]}
								showBack={exerciseDone}
								jiggle={jiggleIndex === index}
								big={big}
								style={{
									width: size,
									height: size
								}}
							>
								<div
									className={"card cardBack " + (big ? "cardBack-big" : "")}
									style={{
										width: size,
										height: size
									}}
								>
									<YutuSvg size={yutuSize}/>
								</div>
								<div
									className={"card cardFront " + (correct ? "cardFront-correct" : "")}
									style={{
										width: size,
										height: size
									}}
								>
									<SimpleImage
										image={image.url}
										rounded={false}
										style={{
											width: size - 24,
											height: size - 24,
										}}
									/>
									{
										correct &&
										<div className="check">
											<CheckSvg size={{x: 13, y: 9}}/>
										</div>
									}
								</div>
							</FlipCard>
						</motion.div>
					)
				})
			}

		</div>
	</div>;
};

export default MemoryTemplate;
