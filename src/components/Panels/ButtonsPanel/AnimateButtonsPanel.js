import React from 'react';
import {AnimatePresence, LayoutGroup, motion} from "framer-motion";
import {DEFAULT} from '../../../lib/const';
import YutuButton from '../../Buttons/YutuButton';
import "./style.scss";

const AnimateButtonsPanel = props => {

  // ? props
  const {
    show = true,
    onClick = () => {
    },
    buttons = [],
    isWord = false,
    align = "center"
  } = props;

  if (!show) {
    return null
  }

  return (
    <div className="animateBtnsPanel" style={{justifyContent: align}}>
      <LayoutGroup>
        {
          buttons.map((letter, index) => {
            return (
              <motion.div
                className="swowBtn"
                layout="position"
                key={letter.id}
              >
                {
                  letter.show ?
                    <div>
                      <YutuButton
                        text={letter.value}
                        btnState={DEFAULT}
                        onClick={() => {
                          onClick(index)
                        }}
                        isWord={isWord}
                      />
                    </div>
                    : <YutuButton isWord={isWord} text={letter.value}/>
                }
              </motion.div>
            )
          })
        }
      </LayoutGroup>
    </div>
  )
}

export default AnimateButtonsPanel;