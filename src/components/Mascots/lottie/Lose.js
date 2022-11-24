import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { YUTU_LOSE, GIRAFFE_LOSE } from '../../../lib/Lottie';
import { YUTU_MASCOT, GIRAFFE_MASCOT, M_SOUNDS as MS, SOUNDS as S } from '../../../lib/const';
import { EventBus } from '../../../lib/EventBus';
import Lottie from "lottie-react";
import './style.scss';

export default props => {

  const {
    show,
    onFinish = () => { },
    mascot = YUTU_MASCOT,
  } = props;


  const lottieRef = useRef(null);
  const indexRef = useRef(0);


  const [mascotData, setMascotData] = useState(YUTU_LOSE);
  const mascotSettings = useSelector(state => state.mascotSettings);

  useEffect(() => {
    setMascotData(mascot === YUTU_MASCOT ? YUTU_LOSE : GIRAFFE_LOSE)
  }, [mascot])

  useEffect(() => {
    const key = mascot === YUTU_MASCOT ? YUTU_MASCOT : GIRAFFE_MASCOT;
    if (show) {
      setTimeout(() => {
        EventBus.$emit(S.play, { name: MS[key].bigFalse[indexRef.current] });
      }, 10);
    } else {
      indexRef.current = Math.round(Math.random());
      EventBus.$emit(S.stop, { name: MS[key].bigFalse[0] });
      EventBus.$emit(S.stop, { name: MS[key].bigFalse[1] });
    }
  }, [show])


  if (!show) {
    return null
  }

  return (

    <div
      className={'mascotWrapper ' + (mascotData[indexRef.current].center ? "mascotCenter" : "")}
      onClick={() => {lottieRef.current.stop(); onFinish()}}
    >
      <Lottie
        animationData={mascotData[indexRef.current].url}
        autoPlay={true}
        lottieRef={lottieRef}
        loop={false}
        style={Object.assign({
          width: mascotSettings.newSize.x,
          height: mascotSettings.newSize.y,
          position: "absolute",
          objectFit: "cover",
        }, mascotData[indexRef.current].settings)}
        onComplete={onFinish}
      />
    </div>
  )
}
