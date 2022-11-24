import React from "react";
import {useSelector} from "react-redux";
import {EMPTY} from "../../lib/const";
import "./style.scss"


export default (props) => {

	// ? props
	const {
		text = "",
		btnState = EMPTY,
		color = "#BF8FFF",
		onClick,
	} = props;

	const coef = useSelector(state => state.baseCoef);
	// const coef = 1;

	return (
		<div
			className={"l-btn l-btn-" + btnState}
			style={{
				width: 54 * coef,
				height: 54 * coef,
				fontSize: 32 * coef,
				borderRadius: 16 * coef,
				margin: 4 * coef,
			}}
			onClick={onClick}
		>
			{
				text && text.length > 0 &&
				<p
					className="l-btn-text"
					style={{color}}
				>
					{text}
				</p>
			}
		</div>
	);
}