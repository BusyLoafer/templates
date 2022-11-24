import React, {useEffect, useState,} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {
	DEFAULT,
	ERROR,
	BUTTON_SIZE as BS,
	SOUNDS as S,
	CHOOSEN,
	SUCCESS,
	RESET_TYPE,
	EX_CONTENT_TYPE
} from "../../lib/const";
import YutuButton from "../../components/Buttons/YutuButton";
import {generateBigImageStyle} from "../../lib/StyleGenerator";
import SimpleButtonsPanel from "../../components/Panels/SimpleButtonsPanel/SimpleButtonsPanel";
import SimpleImage from "../../components/Images/SimpleImage";
import SimpleText from "../../components/Text/SimpleText";
import {setBtnAction, setLessonNext, setLessonReset, setLose} from "../../store/actions";
import {resetStates, setFullWin} from "../../lib/yutuManager";
import {EventBus} from "../../lib/EventBus";

import './style.scss'
import {lessonCompletion, onLessonReset} from "../../components/MainComponent/Manager";
import CheckSvg from "../../components/svg/CheckSvg";

const lessonType = EX_CONTENT_TYPE.quiz;

export default props => {

	// ? props
	const {
		ex,
		exerciseDone,
	} = props;

	// ? store
	const btnSizeCoef = useSelector(state => state.btnSizeCoef);
	const currentId = useSelector(state => state.currentId);
	const btnAction = useSelector(state => state.btnAction);
	const lose = useSelector(state => state.lose);
	const fullSize = useSelector(state => state.baseViewSize)
	const coef = useSelector(state => state.baseCoef)

	const dispatch = useDispatch();

	// ? state
	const [image, setImage] = useState(null);
	const [imageStyle, setImageStyle] = useState({});
	const [text, setText] = useState("");
	const [words, setWords] = useState([]);
	const [correctSound, setCorrectSound] = useState(false);
	const [multipleChoice, setMultipleChoice] = useState(false);
	const [correct, setCorrect] = useState([]);
	const [selected, setSelected] = useState([]);
	const [showCheck, setShowCheck] = useState(false);

	// ? effects
	useEffect(() => {
		if (ex) {
			const data = ex[lessonType]
			if (data.picture && data.picture.fileUrl) {
				setImage(data.picture.fileUrl);
				setImageStyle(Object.assign({marginBottom: 48}, generateBigImageStyle(fullSize.width * 0.7)));
			}

			setText(data.text.value);
			setWords(data.buttons.values.map((word, i) => {
				return {
					value: word,
					id: i,
					type: DEFAULT
				}
			}))
			setShowCheck(!data.buttons.correctValue)
			console.log(!data.buttons.correctValue)

			if (data.buttons.correctValues) {
				setMultipleChoice(data.buttons.correctValues.length > 1);
				setCorrect(data.buttons.correctValues);
			} else if (data.buttons.correctIndex !== undefined) {
				setCorrect([data.buttons.correctIndex])
			}

			if (data.buttons.correctAudio && data.buttons.correctAudio.fileUrl) {
				setCorrectSound(true);
			}
		}
	}, [ex])

	useEffect(() => {
		if (ex.id === currentId) {
			if (exerciseDone || selected.length) {
				dispatch(setLessonReset(true))
			}
			if (exerciseDone) {
				dispatch(setLessonNext(true))
			}
		}
	}, [currentId])

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
		if (ex.id === currentId && !lose) {
			reset()
		}
	}, [lose])

	// ? functions
	const addWord = id => {
		if (!multipleChoice) {
			if (id === ex[lessonType].buttons.correctIndex || (ex[lessonType].buttons.correctValues && id === ex[lessonType].buttons.correctValues[0])) {
				win()
			} else {
				error(id)
			}
		} else {
			const value = selected.slice();
			const i = value.indexOf(id);
			if (i > -1) {
				value.splice(i, 1);
				if (value.length === 0) {
					dispatch(setLessonReset(false))
				}
			} else {
				value.push(id);
				if (!correct.includes(id)) {
					error()
				} else {
					dispatch(setLessonReset(true))
				}
			}
			checkAnswer(value)
			setSelected(value)
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

	const checkWord = id => {
		if (id === ex[lessonType].buttons.correctIndex) {
			win()
		} else {
			error(id)
		}
	}

	const win = () => {
		dispatch(setLessonReset(true))
		setWordSettings(null, true)
		if (!exerciseDone) {
			lessonCompletion();
			setFullWin()

			EventBus.$emit(S.play, {name: S.win, silence: correctSound})
		}
	}

	const error = id => {
		setWordSettings(id);
		dispatch(setLose(true));
	}

	const setWordSettings = (id = null, win = false) => {
		const newWords = words.slice();
		newWords.map(word => {
			if (id !== null && id === word.id) {
				word.type = ERROR
			} else if (win && correct.includes(word.id)) {
				word.type = SUCCESS
			} else {
				word.type = DEFAULT
			}
			return word;
		})
		setWords(newWords);
	}

	const reset = () => {
		resetStates(["reset", "next", "win", "confetti", "lose"])
		setSelected([]);
		setWordSettings();
		onLessonReset();
	}

	return (
		<div className="quizTemplate page" style={fullSize}>

			<SimpleImage
				show={!exerciseDone || multipleChoice}
				style={imageStyle}
				image={image}
			/>
			<SimpleText
				show={!exerciseDone || multipleChoice}
				text={text}
				style={{paddingHorizontal: 16, marginBottom: 24}}
			/>

			<SimpleButtonsPanel show={!exerciseDone || multipleChoice}>
				{
					words.map((word) => {
						return (
							<div
								className="wordBtn"
								key={word.id}
								style={{
									height: BS.btnSize * btnSizeCoef,
								}}
							>
								<YutuButton
									text={word.value}
									btnState={lose && selected.includes(word.id) ? ERROR : !exerciseDone && selected.includes(word.id) ? CHOOSEN : exerciseDone && correct.includes(word.id) ? SUCCESS : word.type}
									onClick={() => {
										addWord(word.id)
									}}
									isWord={true}
								/>
							</div>
						)
					})
				}
			</SimpleButtonsPanel>

			<SimpleText
				show={exerciseDone && !multipleChoice && !showCheck}
				text={ex ? ex[lessonType].buttons.correctValue : ""}
				fontSize={48}
			/>

			{
				exerciseDone && !multipleChoice && showCheck &&
				<div className="check-wrapper">
					<div
						className="check-round"
						style={{
							width: 144 * coef,
							height: 144 * coef,
							borderRadius: 144,
						}}
					>
						<CheckSvg
							size={{x: 70 * coef, y: 51 * coef}}
						/>
					</div>
				</div>
			}

		</div>
	)
}