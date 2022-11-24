import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { motion, useAnimation } from "framer-motion";
import "./style.scss"

const jigSettings = [
  "rotateY(0deg)",
  "rotateY(-25deg)",
  "rotateY(0deg)",
  "rotateY(25deg)",
  "rotateY(0deg)",
]

const FlipCard = forwardRef((props, ref) => {

  const {
    style = {},
    children,
    flipped = false,
    onClick = () => { },
    onFinish = () => { },
    onStart = () => { },
    showBack = false,
    jiggle = false,
    big,
    duration = 0.3,
  } = props;

  const flip = useAnimation();
  const jig = useAnimation();

  useEffect(() => {
    if (!showBack) {
      if (flipped) {
        flip.start({
          transform: "rotateY(180deg)",
          transition: { duration: duration },
        })
      } else {
        flip.start({
          transform: "rotateY(0deg)",
          transition: { duration: duration },
        })
      }
    }
  }, [flipped]);

  useEffect(() => {
    if (showBack) {
      flip.set({ transform: "rotateY(180deg)" })
    } else {
      flip.set({ transform: "rotateY(0deg)" })
    }
  }, [showBack])

  useEffect(() => {
    if (jiggle) {
      flip.start({
        transform: jigSettings,
        transition: { duration: duration },
      })
    }
  }, [jiggle])


  return (
    <motion.div
      animate={jig}
      className='cardWrapper cardFlip'
      style={style}
      onClick={onClick}
      ref={ref}
    >
      <motion.div
        animate={flip}
        className="card-inner"
      >
        <div className='fcard'>
          {children[0]}
        </div>
        <div className='fcard fcard-back'>
          {children[1]}
        </div>
      </motion.div>
    </motion.div>
  )
})

export default FlipCard