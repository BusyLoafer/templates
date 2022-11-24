import React, {useRef} from 'react';
import {AnimatePresence, LayoutGroup, motion} from "framer-motion";
import {DEFAULT, EMPTY} from '../../../lib/const';
import "./style.scss";
import LetterButton from "../../Buttons/LetterButton";

const AnimateLettersPanel = props => {

	// ? props
	const {
		show = true,
		onClick,
		buttons = [],
		align = "center"
	} = props;

	const rnd = useRef(Math.floor(Math.random() * 100)).current

	if (!show) {
		return null
	}

	return (
		<div className="animateBtnsPanel" style={{justifyContent: align}}>
			{/*<LayoutGroup>*/}
				{
					buttons.map((letter, index) => {
						return (
							<motion.div
								layout="position"
								key={letter.id + rnd}
							>
								<LetterButton
									text={letter.value}
									btnState={letter.show ? DEFAULT : EMPTY}
									color={letter.color}
									onClick={() => {
										if (letter.show) {
											onClick(index)
										}
									}}
								/>
							</motion.div>
						)
					})
				}
			{/*</LayoutGroup>*/}
		</div>
	)
}

export default AnimateLettersPanel;