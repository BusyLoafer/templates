import * as React from "react"

export default (props) => {

  const {
    color = "white",
    size = { x: 19, y: 14 },
  } = props;

  return (
    <svg
      width={size.x}
      height={size.y}
      viewBox="0 0 19 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7071 1.29289C18.0976 1.68342 18.0976 2.31658 17.7071 2.70711L7.70711 12.7071C7.31658 13.0976 6.68342 13.0976 6.29289 12.7071L1.29289 7.70711C0.902369 7.31658 0.902369 6.68342 1.29289 6.29289C1.68342 5.90237 2.31658 5.90237 2.70711 6.29289L7 10.5858L16.2929 1.29289C16.6834 0.902369 17.3166 0.902369 17.7071 1.29289Z"
        strokeWidth="2"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}