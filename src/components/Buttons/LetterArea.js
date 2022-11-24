import React from "react";
import {useSelector} from "react-redux";
import {EMPTY} from "../../lib/const";
import "./style.scss"


export default (props) => {

	// ? props
	const {
		text = "",
		btnState = EMPTY,
		onClick,
	} = props;

	const coef = useSelector(state => state.baseCoef);

	return (
		<div
			className={"letterArea letterArea-" + btnState}
			style={{
				width: 52 * coef,
				height: 52 * coef,
				borderRadius: 12 * coef,
				fontSize: 32 * coef,
				margin: 2 * coef,
			}}
			onClick={onClick}
		>
			{text && text.length > 0 && <p>{text}</p>}
		</div>
	);
}