import React, { useEffect } from 'react';
import { motion, useAnimation } from "framer-motion";

const Shake = props => {

  const {
    start = false,
    style={},
    children,
  } = props;

  const anim = useAnimation();

  useEffect(() => {
    if (start) {
      startShake()
    }
  }, [start]);

  const startShake = () => {
    anim.start({
      rotate: ["0deg", "-15deg", "0deg", "15deg", "0deg"],
      transition: { duration: 0.4 },
    })
  }
  
  return (
    <motion.div
      animate={anim}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default Shake