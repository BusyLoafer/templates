import React, { useEffect, useState, useRef, createRef } from "react";
import { useSelector } from 'react-redux';
import { PAUSE_TYPE, SOUND_TYPE, TEXT, MASCOT_TEXT as MT, YUTU_MASCOT, GIRAFFE_MASCOT, SOUNDS as S, M_SOUNDS as MS, TYPE_WEIGHT } from "../../../lib/const";
import { generateFontSize } from "../../../lib/StyleGenerator";
import Lottie from "lottie-react";
import SimpleText from "../../Text/SimpleText";
import { EventBus } from "../../../lib/EventBus";

import "./style.scss";

const MascotWithText = props => {
  const {
    text = "",
    mascotData = null,
    onAnimationFinish,
    loop = true,
    show,
    start,
    win,
    mascot,
    fontScale = 1
  } = props;

  const lottieRef = useRef(null);
  const animEnd = useRef(0);

  const coef = useSelector(state => state.baseCoef);
  const [minHeight, setMinHeight] = useState(MT.baseHeight);
  const [mascotScale, setMascotScale] = useState(1);

  useEffect(() => {
    if (mascotData.url) {
      const mascotScale = MT.baseHeight / mascotData.size.height
      const h = mascotData.size.height * mascotScale
      setMinHeight(h * coef + MT.basePadding * 2)
      setMascotScale(mascotScale)
      if (lottieRef.current) lottieRef.current.play()
    }
  }, [mascotData])

  useEffect(() => {
    if (show && mascotData.url) {
      animEnd.current = 0
      if (start) {
        lottieRef.current.play()
      }
    }
  }, [show, start])

  useEffect(() => {
    const key = mascot === YUTU_MASCOT ? YUTU_MASCOT : GIRAFFE_MASCOT;
    if (win) {
      EventBus.$emit(S.play, { name: MS[key].smallTrue });
    } else {
      EventBus.$emit(S.stop, { name: MS[key].smallTrue });
    }
  }, [win])

  const checkAnimEnd = () => {
    animEnd.current = 1 - animEnd.current
    if (!animEnd.current) {
      onAnimationFinish()
    }
  }

  if (!show) {
    return null
  }
  return (
    <div
      className="mascotWithText"
      style={{ minHeight: minHeight, paddingTop: 24 * coef, }}
    >

      {
        mascotData.url &&
        <Lottie
          animationData={mascotData.url}
          autoPlay={false}
          lottieRef={lottieRef}
          loop={loop}
          style={{
            minWidth: mascotData.size.width * mascotScale * coef,
            minHeight: mascotData.size.height * mascotScale * coef,
            width: mascotData.size.width * mascotScale * coef,
            height: mascotData.size.height * mascotScale * coef,
            // position: "absolute",
            objectFit: "cover",
          }}
          onComplete={onAnimationFinish}
        />
      }

      <div className="dialog">
        <div className="comment_rec" />
        <SimpleText
          text={text}
          fontFamily={TYPE_WEIGHT.middle}
          style={{
            color: "#121C42",
            flexShrink: 1,
            padding: "4px 0 4px 12px",
          }}
        />
      </div>
    </div>
  )
}

export default MascotWithText