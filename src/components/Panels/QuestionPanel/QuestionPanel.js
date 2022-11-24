import React, {useEffect, useState, useRef} from "react";
import {QUESTION_PANEL as QP, TEXT, TYPE_WEIGHT} from "../../../lib/const";
import {useSelector} from "react-redux";
import {generateFontSize} from "../../../lib/StyleGenerator";
import SimpleText from "../../Text/SimpleText";
import QuestionPanelSvg from "../../svg/QuestionPanelSvg";
import lottieAnim from "../../../lottie/question.json";
import Lottie from "lottie-react";
import "./style.scss";

const QuestionPanel = props => {

	// ? props
	const {
		text = "",
	} = props;

	// ? store
	const fontScale = useSelector(state => state.fontScale);
	const coef = useSelector(state => state.baseCoef);

	// ? refs

	// ? effects

	// ? functions

	return (
		<div
			className="questionPanel"
			style={{
				width: 336 * coef,
				height: 172 * coef,
			}}
		>
			<div className="abs">
				<QuestionPanelSvg size={{x: 336 * coef, y: 172 * coef}}/>
			</div>

			<SimpleText
				text={text}
				style={{
					fontSize: generateFontSize(18, coef, fontScale),
					padding: "48px 36px 24px",
					width: 328 * coef,
					height: 164 * coef,
					color: "#FFF",
					flexGrow: 1,
					zIndex: 10,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
				}}
				fontSize={18}
				fontFamily={TYPE_WEIGHT.big}
			/>

			<div
				className="question"
				style={{
					top: -32 * coef,
					left: 136 * coef,
					width: 64 * coef,
					height: 64 * coef,
					paddingBottom: 12 * coef,
				}}
			>
				<Lottie
					autoPlay={true}
					loop={true}
					animationData={lottieAnim}
					style={{height: 90 * coef + 'px', width: 32 * coef + 'px'}}
				/>
			</div>
		</div>
	)
}
export default QuestionPanel;