import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT, CHOOSEN, ERROR, SUCCESS, SOUNDS as S, RESET_TYPE, EX_CONTENT_TYPE } from "../../lib/const";
import { checkShuffle, shuffleId } from "../../lib/utils";
import { setBtnAction, setLose } from "../../store/actions";
import { EventBus } from "../../lib/EventBus";
import AnimateButtonsPanel from "../../components/Panels/ButtonsPanel/AnimateButtonsPanel";
import { onLessonReset } from "../../components/MainComponent/Manager";
import QuestionPanel from "../../components/Panels/QuestionPanel/QuestionPanel";
import AreasWithButtons from "../../components/Panels/ButtonsPanel/AreasWithButtons";
import { setFullLose, setFullWin } from "../../lib/yutuManager";

import './style.scss';
import LettersPanel from "../../components/Panels/ButtonsPanel/LettersPanel";
import AnimateLettersPanel from "../../components/Panels/ButtonsPanel/AnimateLettersPanel";
import SimpleImage from "../../components/Images/SimpleImage";


const letterColors = [
	"#7480FF",
	"#BF8FFF",
	"#2297EF",
	"#F96F5C",
]

const lessonType = EX_CONTENT_TYPE.quizSwow;
const QuizSwowTemplate = props => {

	// ? props
	const {
		ex,
		exerciseDone
	} = props;

	// ? store
	const currentId = useSelector(state => state.currentId);
	const btnAction = useSelector(state => state.btnAction);
	const baseViewSize = useSelector(state => state.baseViewSize);

	const dispatch = useDispatch();

	// ? state
	const [currentLetters, setCurrentLetters] = useState([]);
	const [chossenLetters, setChossenLetters] = useState([]);
	const [count, setCount] = useState(0);
	const [btnType, setBtnType] = useState(CHOOSEN);
	const [question, setQuestion] = useState("");
	const [correctWord, setCorrectWord] = useState("");

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
		if (ex) {
			const data = ex[lessonType];
			setCorrectWord(data.buttons.correctValue);
			setQuestion(data.text.value);
			if (exerciseDone) {
				const size = data.buttons.correctValue.length;
				let rightValues = data.buttons.correctValue;
				const arr = data.buttons.values.slice();
				const chosenArr = [];
				const currentArr = [];
				for (let i = 0; i < size; i++) {
					chosenArr.push(null);
				}
				arr.forEach((val, index) => {
					const i = rightValues.indexOf(val);
					rightValues = rightValues.split("");
					rightValues[i] = "_";
					rightValues = rightValues.join("");
					const rndColor = letterColors[Math.floor(Math.random() * letterColors.length)]
					if (i >= 0) {
						currentArr.push({
							id: index,
							value: val.toUpperCase(),
							show: false,
							color: rndColor,
						})
						chosenArr[i] = {
							id: index,
							value: val.toUpperCase(),
							show: true,
							color: rndColor,
						}
					} else {
						currentArr.push({
							id: index,
							value: val.toUpperCase(),
							show: true,
							color: rndColor,
						})
					}
				})
				setCount(size);
				setChossenLetters(chosenArr);
				setCurrentLetters(currentArr);
			} else {
				zeroingLetters();
				shuffleLetters();
			}
		}

	}, [ex])

	useEffect(() => {
		const answer = checkWord();
		if (!exerciseDone) {
			switch (answer) {
				case SUCCESS:
					EventBus.$emit(S.play, { name: S.win })
					break;
				// case ERROR:
				//   EventBus.getInstance().fireEvent(S.play, { name: S.error })
				//   break;
				case CHOOSEN:
					EventBus.$emit(S.play, { name: S.click })
					break;
			}
		}
	}, [chossenLetters])

	// ? functions
	const shuffleLetters = () => {

		let arr = ex[lessonType].buttons.values.slice();

		for (let i = arr.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}

		arr = arr.map((value, index) => {
			const rndColor = letterColors[Math.floor(Math.random() * letterColors.length)]
			return {
				id: index,
				value: value,
				show: true,
				color: rndColor,
			}
		})
		setCurrentLetters(arr);
	}

	const shuffleCurrentLetters = buttons => {
		const currentIds = buttons.map(btn => {
			return btn.id
		});
		let arr = currentIds.slice();
		let verified = false;
		while (!verified) {
			arr = shuffleId(arr);
			verified = checkShuffle(arr, currentIds)
		}
		arr = arr.map(id => {
			const letter = buttons.find(btn => btn.id === id);
			letter.show = true;
			return letter
		});
		setCurrentLetters(arr);
	}

	const zeroingLetters = () => {
		const size = ex[lessonType].buttons.correctValue.length;
		const arr = [];

		for (let index = 0; index < size; index++) {
			arr.push(null);
		}

		setCount(size);
		setChossenLetters(arr);
	}

	const addLetter = index => {
		const letter = {}
		for (let key in currentLetters[index]) {
			letter[key] = currentLetters[index][key];
		}

		const arr = chossenLetters.slice();
		let paste = false;
		for (let i = 0; i < count; i++) {
			if (!paste && !arr[i]) {
				arr[i] = letter;
				paste = true;
			}
		}

		if (paste) {
			setChossenLetters(arr);
			currentLetters[index].show = false
		} else {
			EventBus.$emit(S.play, { name: S.click });
		}
	}

	const checkWord = () => {
		const word = chossenLetters.map(letter => letter ? letter.value : "").join("");
		if (word.length > 0) {
			if (word == correctWord) {
				setBtnType(SUCCESS);
				if (!exerciseDone) {
					setFullWin();
					EventBus.$emit("stopTSound");
					return SUCCESS
				}
			} else if (word.length == correctWord.length) {
				setBtnType(ERROR);
				dispatch(setLose(true));
				return ERROR
			} else {
				setBtnType(CHOOSEN);
				return CHOOSEN
			}
		} else {
			return DEFAULT
		}
	}

	const deleteLetter = index => {
		const letter = {}
		for (let key in chossenLetters[index]) {
			letter[key] = chossenLetters[index][key];
		}
		const arr = chossenLetters.slice();
		arr[index] = null;
		setChossenLetters(arr);
		onLessonReset();
		EventBus.$emit(S.play, { name: S.click })
		currentLetters.forEach(cLetter => {
			if (cLetter.id === letter.id) cLetter.show = true
		})
	}

	const reset = () => {
		shuffleCurrentLetters(currentLetters);
		zeroingLetters();
		setFullLose();
	}

	if (ex.id !== currentId) return null

	return (
		<div className="quizSwowTemplate" style={baseViewSize}>

			<div className="anim-image">
				<QuestionPanel text={question} start={currentId === ex.id} />
			</div>

			<div className="anim-image2">
				<LettersPanel
					show={ex.id === currentId}
					buttons={chossenLetters}
					btnType={btnType}
					onClick={deleteLetter}
				/>

				<AnimateLettersPanel
					show={ex.id === currentId}
					onClick={addLetter}
					buttons={currentLetters}
				/>
			</div>

		</div>
	);
}

export default QuizSwowTemplate;