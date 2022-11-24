import React from 'react';
import { CONFETTI } from '../../../lib/Lottie';
import Lottie from "lottie-react";
import './style.scss'

const Confetti = (props) => {

  const {
    start,
    onFinish = () => { }
  } = props;

  if (!start) {
    return null
  }

  return (
    <div className='confetti'>
      <Lottie
        animationData={CONFETTI.url}
        autoPlay={true}
        loop={false}
        style={{
          zIndex: 500
        }}
        onComplete={onFinish}
      />
    </div>
  )
}

export default Confetti;