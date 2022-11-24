import * as React from "react";

const PathOrderSvg = props => {
  const {
    size = { x: 202, y: 157 },
    color = "#A1ABCD"
  } = props;

  return (
    <svg
      width={size.x}
      height={size.y}
      viewBox="0 0 202 157"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0C46.2967 9.47312 31.5 39 57.5 52.5C83.5 66 98.5 50.9999 113.5 62C128.5 73.0001 127.5 88.9997 130 102C132.5 115 134 128 155.5 141C177 154 200.5 157.001 200.5 157.001"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
    </svg>
  )
}

export default PathOrderSvg;