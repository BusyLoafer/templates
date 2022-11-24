import * as React from "react"

const SeparatorSvg = props => {

  const {
    color = "#DBEDFF",
    size = {
      x: 20,
      y: 19,
    }
  } = props;

  return (
    <svg
      width={size.x}
      height={size.y}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H20C19.0237 3.70998 17.5 5.66037 17.5 9.5C17.5 13.3396 19.0237 15.29 20 19H0C0 19 2.5 13.3396 2.5 9.5C2.5 5.66037 0 0 0 0Z"
        fill={color}
      />
    </svg>
  )
}

export default SeparatorSvg