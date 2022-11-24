import React, { useEffect, useRef, useState } from "react";
import { DRAW_COLORS } from "../../lib/const";
import AnimatedStroke from "./AnimatedStroke";
import { motion, useAnimation } from "framer-motion";


const SvgPath = props => {

  const { path, onFinish, size = { x: 360, y: 360 }, line, fill = "none", time = 1 } = props;

  const progress = useAnimation();

  useEffect(() => {
    progress.set({
      strokeWidth: line.width
    })
    progress.start({
      pathLength: 1,
      transition: {delay: 0, duration: time * 2}
    }).then(onFinish);
  }, []);

  return (
    <svg
      width={size.x}
      height={size.y}
      viewBox={[
        0, 0, size.x, size.y
      ].join(" ")}
      fill={fill}
    >
      <motion.path
        animate={progress}
        pathLength={0}
        d={path}
        strokeWidth={0}
        stroke={line.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgPath;
