import React, { useEffect, useRef, useState } from 'react';
import { YUTU_DONE, GIRAFFE_DONE } from '../../../lib/Lottie';
import { YUTU_MASCOT, GIRAFFE_MASCOT, M_SOUNDS as MS, SOUNDS as S, WIN_SHOW_MAX_COUNT } from '../../../lib/const';
import { useDispatch, useSelector } from 'react-redux';
import { EventBus } from '../../../lib/EventBus';
import Lottie from "lottie-react";
import './style.scss';

const Win =  props => {

  const {
    show,
    onFinish = () => { },
    mascot = YUTU_MASCOT,
    silence = false,
  } = props;

  const indexRef = useRef(0);

  const mascotSettings = useSelector(state => state.mascotSettings);


  const [mascotData, setMascotData] = useState(YUTU_DONE)

  useEffect(() => {
    setMascotData(mascot === YUTU_MASCOT ? YUTU_DONE : GIRAFFE_DONE)
  }, [mascot])

  useEffect(() => {
    const key = mascot === YUTU_MASCOT ? YUTU_MASCOT : GIRAFFE_MASCOT;
    if (show) {
      EventBus.$emit(S.play, { name: MS[key].bigTrue[indexRef.current], silence: silence });
    } else {
      indexRef.current = Math.round(Math.random());
      EventBus.$emit(S.winStop);
    }
  }, [show])

  if (show) {
    return (
      <div
        className={'mascotWrapper ' + (mascotData[indexRef.current].center ? "mascotCenter" : "")}
      >
        <Lottie
          animationData={mascotData[indexRef.current].url}
          autoPlay={true}
          loop={false}
          style={Object.assign({
            width: mascotData[indexRef.current].size ? mascotData[indexRef.current].size.width : mascotSettings.newSize.x,
            height: mascotSettings.newSize.y,
            position: "absolute",
            objectFit: "cover",
          }, mascotData[indexRef.current].settings)}
          onComplete={onFinish}
        />
      </div>
    )
  } else {
    return null
  }
}

export default Win;
