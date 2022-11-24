import * as React from "react"

function TextSvg(props) {
  const {
    word = ["К", "у", "л", "е", "б", "я", "к", "а"],
    fill = "none",
    stroke = "#7480FF",
    box,
    checkId = -1,
    check = false,
    fontSize,
  } = props

  const checkStroke = (letter, index) => {
    if (['.', ','].includes(letter)) return "none"
    return checkId === index && check ? "orange" : index < checkId ? "none" : stroke
  }

  const checkFill = (letter, index) => {
    if (['.', ','].includes(letter)) return "black"
    return index < checkId ? "black" : "none"
  }


  return (
    <svg
      height={box.h * 1.6}
      width={box.w}
      viewBox={[0, 0, box.w, box.h].join(" ")}
    >

      <text
        // y={fontSize}
        y={fontSize / 1.5}
        // y={fontSize / 1.5}
        fill={fill}
        stroke={stroke}
        fontSize={fontSize}
        strokeDasharray="6, 3"
        strokeWidth="2"
        fontFamily="Nunito-Bold"
        fontWeight="bold"
        textLength={box.w}
        style={{
          fontFamily: "Nunito-Bold"
        }}
      >
        {
          word.map((letter, index) => {
            return <tspan
              key={index}
              // stroke={checkId === index && check ? "orange" : index < checkId ? "none" : stroke}
              // fill={index < checkId ? "black" : "none"}
              stroke={checkStroke(letter, index)}
              fill={checkFill(letter, index)}

            >
              {letter}
            </tspan>
          })
        }
      </text>

    </svg>
  )
}

export default TextSvg