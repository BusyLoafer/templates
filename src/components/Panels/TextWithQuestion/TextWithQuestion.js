import React, {useEffect, useState, useRef, createRef} from "react";
import {useSelector} from 'react-redux';
import {IMAGE_BUTTON, DEFAULT, CHOOSEN, ERROR, SUCCESS, BTN_COLOR} from "../../../lib/const";
import SimpleImage from "../../Images/SimpleImage";
import CheckSvg from "../../svg/CheckSvg";
import Lottie from "lottie-react";
import Question from "../../svg/QuestionSvg";
import SimpleText from "../../Text/SimpleText";
import lottieAnim from "../../../../templates/lottie/question.json"
import './style.scss';


const TextWithQuestion = props => {

	// ? props
	const {
		show = true,
		text = ""
	} = props;

	// ? store
	const coef = useSelector(state => state.baseCoef);

	if (!show) return null

	return (
		<div
			className="textWithQuestion"
			style={{width: 336 * coef}}
		>
			<div>
				<Lottie
					autoPlay={true}
					loop={true}
					animationData={lottieAnim}
					style={{height: 100 * coef + 'px', width: 36 * coef + 'px'}}
				/>
			</div>

			<SimpleText
				text={text}
			/>
		</div>
	)
}

export default TextWithQuestion;
