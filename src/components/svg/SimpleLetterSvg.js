import * as React from "react"

const SimpleLetterSvg = props => {

  const {
    letter = "A",
    fill = "black",
    stroke = "white",
    box,
    fontSize,
    rotate = "0",
  } = props

  return (
    <svg height={box.y * 1.5} width={box.x * 1.2}>
      <text
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        fontSize={fontSize}
        fontFamily={"Nunito-ExtraBold"}
        fontWeight="bold"
        textAnchor="middle"
        rotate={rotate}
        x="50%"
        y={fontSize}
      >
        {letter}
      </text>
    </svg>
  )
}

export default SimpleLetterSvg