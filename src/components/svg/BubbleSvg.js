import React, { useEffect } from "react";

// const AnimatedPath = Animated.createAnimatedComponent(Path);

const startPoint = 0;
const endPoint = 4

function BubbleSvg(props) {

  const {
    size = { x: 26, y: 36 },
    threadColor = "#729BAD",
    threadWidth = 0.6,
    nodeColor = "#C4D3FA",
    bubbleColor = "#EAEFFC",
    checked = false,
    anim = false,
  } = props;

  // const upThread = useSharedValue(startPoint);
  // useEffect(() => {
  //   if (anim) {
  //     startUp();
  //   }
  // }, [anim]);

  // const startUp = () => {

  //   upThread.value = withRepeat(
  //     withTiming(
  //       endPoint,
  //       {
  //         duration: 700,
  //       }
  //     ), -1, true
  //   );
  // }

  // const animatedProps = useAnimatedProps(() => ({
  //   d: "M13.3449 25.8101C" + (10 + upThread.value) + " 31.8101 " + (14 - upThread.value) + " 30.8101 13.3449 35.8101"
  // }));

  return (
    <svg
      width={size.x}
      height={size.y}
      viewBox="0 0 26 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {/* нитка */}

      {/* <AnimatedPath
        animatedProps={animatedProps}
        stroke={threadColor}
        strokeWidth={threadWidth}
      /> */}
      <path
        d={"M13.3449 25.8101C10 31.8101 14 30.8101 13.3449 35.8101"}
        stroke={threadColor}
        strokeWidth={threadWidth}
      />

      {/* треугольник */}
      <path
        d="M11.5409 26.498L13.3075 24.6723L15.2704 26.7009L13.5038 26.498H11.5409Z"
        fill={nodeColor}
      />

      {/* шарик */}
      <circle
        cx="13.2622"
        cy="12.623"
        r="12.623"
        fill={bubbleColor}
      />



      {/* ок */}
      {
        checked &&
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.3352 9.93306C18.5793 10.1771 18.5793 10.5729 18.3352 10.8169L12.0852 17.0669C11.8411 17.311 11.4454 17.311 11.2013 17.0669L8.07631 13.9419C7.83223 13.6979 7.83223 13.3021 8.07631 13.0581C8.32039 12.814 8.71611 12.814 8.96019 13.0581L11.6432 15.7411L17.4513 9.93306C17.6954 9.68898 18.0911 9.68898 18.3352 9.93306Z"
          fill="white"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      }

      {/* Верхний блик */}
      <ellipse
        cx="8.75054"
        cy="3.93873"
        rx="2.72541"
        ry="2.0082"
        transform="rotate(-25.0509 8.75054 3.93873)"
        fill="#FBF9F9"
      />

      {/* Нижний блик */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.4551 15.7067C23.7556 15.8071 23.918 16.1321 23.8177 16.4326C23.2184 18.2282 22.1946 19.8525 20.8333 21.1678C19.4721 22.4831 17.8134 23.4504 15.9984 23.9875C15.6945 24.0775 15.3753 23.904 15.2854 23.6002C15.1954 23.2963 15.3689 22.9771 15.6727 22.8872C17.3107 22.4024 18.8075 21.5295 20.036 20.3425C21.2645 19.1556 22.1883 17.6897 22.7291 16.0693C22.8295 15.7687 23.1545 15.6064 23.4551 15.7067Z"
        fill="#FBF9F9"
      />
    </svg>
  )
}

export default BubbleSvg