import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from 'react-spring';
import SimpleImage from "../Images/SimpleImage";
import BubbleSvg from "../svg/BubbleSvg";
import Boom from "./Boom";
import "./style.scss"

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const baseScale = 0.4;

const Bubble = props => {
  // export const BubbleAnim = props => {

  const {
    bubble,
    onBoom,
    getSettings,
    checkWin,
  } = props;

  const [style, animate] = useSpring(() => ({ top: 0 }))
  const [scale, setScale] = useSpring(() => ({ transform: "scale(" + baseScale + ")" }))

  const {
    x = 0,
    y = 300,
    valueFinish = 0,
    durationStart = 3500,
    color = "grey",
    reset = true,
    timeout = 0,
    size = { x: 88, y: 122 },
  } = bubble;

  const coef = useSelector(state => state.baseCoef);
  const isPhone = useSelector(state => state.isPhone);
  const allImages = useSelector(state => state.allImages);



  const [imageSize, setImageSize] = useState({ top: 16, left: 20, size: 56 });
  const [boom, setBoom] = useState(false);
  const [image, setImage] = useState(null);
  const [correct, setCorrect] = useState(false)

  const timer = useRef(null);
  const mounted = useRef(true);


  // const top = useSharedValue(y);
  // const scale = useSharedValue(baseScale);

  const [show, setShow] = useState(true);


  useEffect(() => {
    setImageSize({ top: 12 * coef, left: 15 * coef, size: 42 * coef })
  }, [coef]);

  const startAnim = () => {
    // top.value = y;
    // top.value = withRepeat(withTiming(
    //   valueFinish,
    //   {
    //     duration: durationStart,
    //     easing: Easing.linear
    //   },
    //   () => {
    //     runOnJS(onFinish)()
    //   }
    // ), -1)
    animate({
      from: { top: y },
      to: { top: valueFinish },
      loop: true,
      config: { duration: durationStart },
      onRest: onFinish
    })
  }

  const startScale = () => {
    // scale.value = baseScale
    // scale.value = withTiming(
    //   1,
    //   {
    //     duration: 2000,
    //     easing: Easing.linear
    //   }
    // )
    setScale.start({
      from: { transform: "scale(" + baseScale + ")" },
      to: { transform: "scale(1)" },
      config: { duration: 2000 },
    })
  }

  useEffect(() => {
    setSettings(getSettings());
    timer.current = setTimeout(() => {
      startAnim();
      startScale();
      clearTimeout(timer.current);
    }, timeout);

    return () => {
      mounted.current = false;
    }
  }, [])

  const setSettings = ({ url = null, right = false }) => {
    if (mounted.current) {
      setImage(url);
      setCorrect(right);
    }
  }

  const onFinish = () => {
    if (mounted.current) {
      setSettings(getSettings());
      setScale.set({ transform: "scale(" + baseScale + ")" })
      setShow(true);
      startScale()
    }
  }

  const onClick = () => {
    setBoom(true);
    setShow(false);
    onBoom(correct);
  }

  const boomFinish = () => {
    if (mounted.current) {
      setBoom(false);
      checkWin();
    }
  }

  return (
    <animated.div
      className="bubble"
      style={{
        paddingHorizontal: "4px",
        left: x,
        ...scale,
        ...style
      }}
      disabled={boom}
      onMouseUp={() => { if (!boom) onClick() }}
    >
      {
        !boom && show &&
        <BubbleSvg
          size={{ x: size.x, y: size.y }}
          nodeColor={color}
          bubbleColor={color}
          anim={true}
          reset={reset}
        />
      }

      <SimpleImage
        show={!!image && !boom && show}
        image={image}
        style={{
          width: imageSize.size,
          height: imageSize.size,
          position: "absolute",
          top: imageSize.top,
          left: imageSize.left,
        }}
      />

      {
        boom &&
        <animated.div style={{
          // marginTop: "60px"
        }} >
          <div style={{ transform: [{ scale: isPhone ? coef : coef * 0.75 }] }}>
            <Boom
              onFinish={boomFinish}
              left={isPhone ? 0 : 8}
              color={color}
              coef={1}
              size={{
                x: 180,
                y: 180,
              }}
            />
          </div>
        </animated.div>
      }

    </animated.div>
  )
}


export default Bubble;