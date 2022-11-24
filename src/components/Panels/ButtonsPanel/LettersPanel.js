import React from 'react';
import {AnimatePresence, motion} from "framer-motion";
import {CHOOSEN, EMPTY} from '../../../lib/const';
import YutuButton from '../../Buttons/YutuButton';
import "./style.scss";
import LetterArea from "../../Buttons/LetterArea";

const LettersPanel = props => {

	// ? props
	const {
		show = true,
		onClick,
		buttons = [],
		btnType = {CHOOSEN}
	} = props;

	if (!show) {
		return null
	}

	return (

		<div className="lettersPanel">
			{
				buttons.map((letter, index) => (
					<motion.div
						key={"area_" + index}
					>
						<LetterArea
							text={letter.value}
							btnState={letter ? btnType : EMPTY}
							onClick={() => {
								onClick(index);
							}}
						/>
					</motion.div>
				))
			}
		</div>
	)
}

export default LettersPanel;