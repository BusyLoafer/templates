import React, { useEffect, useState, useRef, createRef } from "react";
import { motion, useAnimation } from "framer-motion";
import './style.scss';

const OutInFadeScale = props => {

  // ? props
  const {
    children,
    show = true,
    start,
    valueStart = 0,
    valueFinish = 1,
    durationStart = 1,
    showDefault = false
  } = props;

  // ? refs
  const scale = useAnimation();

  // ? effects
  useEffect(() => {
    if (showDefault && !start) {
      setTimeout(() => {
        scale.set({
          transform: "scale(1)",
          opacity: 1,
        })
      }, 0);
    }
    if (start) {
      scale.start({
        transform: ["scale(" + valueStart + ")", "scale(" + valueFinish * 1.1 + ")", "scale(" + valueFinish + ")"],
        opacity: valueFinish,
        transition: { duration: durationStart, times: [0, 0.8, 1] }
      });
    }
  }, [start, showDefault])

  if (!show) {
    return null
  }

  return (
    <motion.div
      className="outInFadeScale"
      animate={scale}
      style={{
        transform: "scale(0)",
        opacity: 0
      }}
    >
      {children}
    </motion.div>
  )
}

export default OutInFadeScale;