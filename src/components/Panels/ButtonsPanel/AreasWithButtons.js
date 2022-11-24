import React from 'react';
import {AnimatePresence, motion} from "framer-motion";
import {CHOOSEN} from '../../../lib/const';
import YutuButton from '../../Buttons/YutuButton';
import "./style.scss";

const AreasWithButtons = props => {

  // ? props
  const {
    show = true,
    onClick = () => {
    },
    buttons = [],
    btnType = {CHOOSEN}
  } = props;

  if (!show) {
    return null
  }

  return (

    <div className="animateBtnsPanel">
      {
        buttons.map((letter, index) => (
          <div
            key={"area_" + index}
            className={'area ' + (!letter ? "area-empty" : "")}
          >
            {/*<AnimatePresence*/}
            {/*  initial={false}*/}
            {/*>*/}
              {
                letter &&
                  <motion.div
                    // initial={{scale: 0}}
                    // animate={{scale: 1}}
                    // exit={{scale: 0}}
                  >
                    <YutuButton
                      text={letter.value}
                      btnState={btnType}
                      onClick={() => {
                        onClick(index);
                      }}
                    />
                  </motion.div>
              }
            {/*</AnimatePresence>*/}
          </div>
        ))
      }
    </div>
  )
}

export default AreasWithButtons;