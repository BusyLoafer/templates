import React, { useEffect } from 'react'
import { useAnimation, motion } from "framer-motion";
import SimpleText from '../../Text/SimpleText';

import "./style.scss"
import { useSelector } from 'react-redux';
import { hideModal } from '../../MainComponent/Manager';

const BottomModal = () => {

  const activeModal = useSelector(state => state.activeModal)
  const textModal = useSelector(state => state.textModal)
  const lang = useSelector(state => state.lang)

  const thanksText = () => {
    return lang.indexOf("ru") !== -1 ? "Спасибо за подсказку" : "Thanks for the tip"
  }

  if (!activeModal) return null;

  return (
    <motion.div
      className='bottomModalWrapper'
      // initial={{ backgroundColor: "rgba(0,0,0,0.0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={hideModal}
    >
      <div className='modalBox'>
        <motion.div
          // animate={modal}
          initial={{ bottom: "-50px", opacity: 0 }}
          animate={{ bottom: "0px", opacity: 1 }}
          className='bottomModal'
        >
          <div className='modalHeader' />
          <div className='modalBody'>
            <SimpleText
              fontFamily={"Nunito-bold"}
              fontSize={16}
              text={textModal}
            />

            <div
              className='modalBtn'
              onClick={hideModal}
            >
              <SimpleText
                fontFamily={"Nunito-bold"}
                fontSize={16}
                style={{ color: "white", lineHeight: "24px" }}
                text={thanksText()}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BottomModal