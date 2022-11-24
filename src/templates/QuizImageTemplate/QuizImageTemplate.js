import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT, ERROR, EX_CONTENT_TYPE, RESET_TYPE, SOUNDS as S, SUCCESS } from "../../lib/const";
import { setBtnAction, setLessonReset, setLose } from "../../store/actions";
import { resetStates, setFullWin } from "../../lib/yutuManager";
import SimpleImage from "../../components/Images/SimpleImage";
import OutInFadeScale from "../../components/Animations/OutInFadeScale";
import ImageButton from "../../components/Buttons/ImageButton";
import { EventBus } from "../../lib/EventBus";
import { lessonCompletion, onLessonReset } from "../../components/MainComponent/Manager";
import TextWithQuestion from "../../components/Panels/TextWithQuestion/TextWithQuestion";

import './style.scss';

const lessonType = EX_CONTENT_TYPE.quizImage;

const QuizImageTemplate = props => {

	// ? props
	const { ex, exerciseDone } = props;

	// ? store
	const baseViewSize = useSelector(state => state.baseViewSize);
	const coef = useSelector(state => state.baseCoef);
	const btnAction = useSelector(state => state.btnAction);
	const lose = useSelector(state => state.lose);
	const currentId = useSelector(state => state.currentId);

	const dispatch = useDispatch();

	// ? state
	const [correctSound, setCorrectSound] = useState(false);
	const [mascotText, setMascotText] = useState("");
	const [images, setImages] = useState([]);
	const [picture, setPicture] = useState(null)
	const [btnSetting, setbtnSetting] = useState([]);
	const [correct, setCorrect] = useState([]);
	const [multipleChoice, setMultipleChoice] = useState(false);
	const [selected, setSelected] = useState([]);
	const [startAnim, setStartAnim] = useState(false);
	const [scale, setScale] = useState(true);

	// ? effects
	useEffect(() => {
		if (ex) {
			const data = ex[lessonType];
			if (data.buttons && data.buttons.correctAudio && data.buttons.correctAudio.fileUrl) {
				setCorrectSound(true)
			}
			if (data.picture) {
				setPicture(data.picture.fileUrl)
			}
			if (data.buttons && data.buttons.values) {
				setBtnSettingDefault()
				setImages(data.buttons.values)
				if (data.buttons.correctValues && data.buttons.correctValues.length) {
					setMultipleChoice(data.buttons.correctValues.length > 1);
					setCorrect(data.buttons.correctValues)
				} else if (data.buttons.correctIndex !== undefined) {
					setMultipleChoice(false);
					setCorrect([data.buttons.correctIndex])
				}
			}

			setMascotText(data.text.value)
		}
	}, [ex])

	useEffect(() => {
		if (ex.id === currentId && !lose) {
			setBtnSettingDefault()
			reset();
		}
	}, [lose]);

	useEffect(() => {
		if (ex.id === currentId) {
			switch (btnAction) {
				case RESET_TYPE:
					setScale(false)
					reset();
					break;
			}
			if (btnAction !== "") {
				dispatch(setBtnAction(""))
			}
		}
	}, [btnAction]);

	// ? functions
	const setBtnSettingDefault = () => {
		setbtnSetting(ex[lessonType].buttons.values.map(() => {
			return { disabled: false, type: DEFAULT }
		}))
	}

	const addImage = index => {
		if (!multipleChoice) {
			if (index === correct[0]) {
				win()
				dispatch(setLessonReset(true))
			} else {
				error(index)
			}
		} else {
			const value = selected.slice();
			const i = value.indexOf(index);
			if (i > -1) {
				value.splice(i, 1);
				if (value.length === 0) {
					dispatch(setLessonReset(false))
				}
			} else {
				value.push(index);
				if (!correct.includes(index)) {
					error()
				}
				dispatch(setLessonReset(true))
			}
			checkAnswer(value);
			setSelected(value);
		}
	}

	const checkAnswer = value => {
		if (correct.length === value.length) {
			const check = correct.every(el => value.includes(el))
			if (check) {
				win();
			}
		}
	}

	const error = index => {
		setbtnSetting(
			btnSetting.map((_, i) => {
				if (i === index) {
					return {
						disabled: false,
						type: ERROR
					}
				} else {
					return {
						type: DEFAULT,
						disabled: true
					}
				}
			})
		)
		dispatch(setLose(true))
	}

	const win = () => {
		setBtnSettingDefault()
		setFullWin();
		lessonCompletion();
		setStartAnim(true);
		EventBus.$emit(S.play, { name: S.win, silence: correctSound })
	}

	const reset = () => {
		resetStates(["reset", "next", "win", "confetti"])
		setSelected([]);
		onLessonReset();
		setStartAnim(false);
	}

	if (ex.id !== currentId) return null

	return (
		<div
			className="quizImageTemplate"
			style={baseViewSize}
		>
			<SimpleImage
				show={!!picture && (!exerciseDone || multipleChoice)}
				image={picture}
				style={{
					width: 330 * coef,
					height: 208 * coef,
					marginBottom: "24px",
					flexShrink: 1,
				}}
			/>

			<TextWithQuestion
				show={(!exerciseDone || multipleChoice) && !picture}
				text={mascotText}
			/>

			<div className="images">
				{
					images.map((image, index) => {
						if (!exerciseDone || multipleChoice) {
							return (
								<div
									key={index}
									className={"image-wrapper " + (scale ? "image-wrapper-anim" : "")}
								>
									<ImageButton
										key={index}
										image={image}
										min={images.length > 4 || !!picture}
										selected={multipleChoice && selected.includes(index) && !lose}
										onClick={() => {
											addImage(index)
										}}
										btnState={lose && selected.includes(index) ? ERROR : exerciseDone && correct.includes(index) ? SUCCESS : btnSetting[index].type}
										disabled={btnSetting[index].disabled || exerciseDone}
									/>
								</div>
							)
						} else {
							return null;
						}
					})
				}
			</div>

			<OutInFadeScale
				show={!multipleChoice && correct.length > 0 && exerciseDone}
				showDefault={exerciseDone}
				start={startAnim}
				durationStart={0.5}
			>
				<SimpleImage
					style={
						{
							position: "absolute",
							zIndex: 90,
							width: baseViewSize.width - 30,
							height: baseViewSize.width - 30,
						}
					}
					image={images[correct[0]]}
				/>
			</OutInFadeScale>

		</div>
	)
}

export default QuizImageTemplate;