import React, { useEffect, useRef } from 'react' 
import BoomSvg from '../svg/BoomSvg';
import PartBubbleSvg from '../svg/PartBubbleSvg';
import { useSpring, animated } from 'react-spring';

const Boom = (props) => {

  const {
    onFinish = () => { },
    color = "white",
    size,
    left,
    coef
  } = props;


  // const progress = useRef(new Animated.Value(0)).current;
  // const opacity = useRef(new Animated.Value(1)).current;
  // const cloud = useRef(new Animated.Value(0.5)).current;
  // const cloudOpacity = useRef(new Animated.Value(0.6)).current;
  
  // const progress0 = useAnimation();
  // const progress1 = useAnimation();
  // const progress2 = useAnimation();
  // const opacity = useAnimation();
  // const cloud = useAnimation();
  // const cloudOpacity = useAnimation();
  
  const [progress0, setProgress0] = useSpring(() => ({ top: -5, left: 10 }))
  const [progress1, setProgress1] = useSpring(() => ({ top: 30, left: 5 }))
  const [progress2, setProgress2] = useSpring(() => ({ left: 55 }))
  const [opacity, setOpacity] = useSpring(() => ({ opacity: 1 }))
  const [cloud, setCloud] = useSpring(() => ({ transform: "scale(0)" }))
  const [cloudOpacity, setCloudOpacity] = useSpring(() => ({ opacity: 1 }))
  

// const { o, xyz, color } = useSpring({
//   from: { o: 0, xyz: [0, 0, 0], color: 'red' },
//   o: 1,
//   xyz: [10, 20, 5],
//   color: 'green',
// })


  useEffect(() => {
    setTimeout(() => {
      onFinish()
    }, 400);
    
    setProgress0({
      to: { top: -30, left: -5 },
      config: { duration: 100 }
    })
    setProgress1({
      to: { top: 55, left: -15 },
      config: { duration: 100 }
    })
    setProgress2({
      to: { left: 80 },
      config: { duration: 100 }
    })
    setOpacity({
      to: {opacity: 0},
      from: {opacity: 1},
      config: { duration: 200, delay: 200 }
    })
    setCloudOpacity({
      to: {opacity: 0},
      from: {opacity: 1},
      config: { duration: 200, delay: 50 }
    })
    setCloud({
      to: { transform: "scale(1)" },
      config: { duration: 300}
    })
    // Animated.timing(opacity, {
    //   duration: 50,
    //   toValue: 0,
    //   delay: 50
    // }).start();
    // cloud.start({
    //   transform: "scale(1)",
    //   transition: { duration: 0.3 },
    // })
    // Animated.timing(cloud, {
    //   duration: 300,
    //   toValue: 1,
    // }).start();
    // cloudOpacity.start({
    //   opacity: 0,
    //   transition: { duration: 0.3, delay: 0.15 },
    // })
    // Animated.timing(cloudOpacity, {
    //   duration: 300,
    //   toValue: 0,
    //   delay: 150
    // }).start();
  }, [])



  // const interpolated0Y = progress.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [-5 * coef, -30 * coef]
  // })
  // const interpolated0X = progress.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [10 * coef, -5 * coef]
  // })

  // const interpolated1Y = progress.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [30, 55]
  // })
  // const interpolated1X = progress.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [5, -15]
  // })
  // const interpolated2X = progress.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [55, 80]
  // })

  return (      
    <div
      style={{
        position: "absolute",
        // top: "-60px",
        left: left
      }}
    >

      <animated.div
        style={{
          position: "absolute",
          top: -55,
          left: -45,
          ...cloudOpacity,
          ...cloud
        }}
      >
        <BoomSvg size={size} />
      </animated.div>

      <animated.div
        style={{
          position: "absolute",
          ...progress0,
          ...opacity
        }}
      >
        <PartBubbleSvg   index={0} color={color} />
      </animated.div>

      <animated.div
        style={{
          position: "absolute",
          ...progress1,
          ...opacity,
        }}
      >
        <PartBubbleSvg index={1} color={color} />
      </animated.div>

      <animated.div
        style={{
          position: "absolute",
          top: 15,
          ...progress2,
          ...opacity
        }}
      >
        <PartBubbleSvg index={2} color={color} />
      </animated.div>

    </div>
  )
}

export default Boom;
