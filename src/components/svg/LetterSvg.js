import React from "react";

const LetterSvg = props => {

  // ? props
  const { size, box, paths = [], line, fill="none" } = props

  return (
    <svg
      width={size.x}
      height={size.y}
      fill={fill}
      // viewBox="-10 -10 190 290"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      // viewBox={box}
      // viewBox="0 0 200 300"
    >
      {
        paths.map((path, index) => {
          if (path.show) {
            const { d, stroke, strokeWidth, strokeLinecap, strokeDasharray } = path;
            return (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={d}
                key={"path_" + index}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap={strokeLinecap}
                strokeDasharray={strokeDasharray}
                strokeLinejoin="round"
              />)
          } else { return null }
        })
      }
    </svg>
  )
}

export default LetterSvg