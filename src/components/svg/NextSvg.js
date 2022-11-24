import * as React from "react"

export default (props) => {

  const {
    color = "white",
    size = {x: 24, y: 24},
  } = props;

  return (
    <svg
      width={size.x}
      height={size.y}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 10.5042C5.17157 10.5042 4.5 11.1757 4.5 12.0042C4.5 12.8326 5.17157 13.5042 6 13.5042H18C18.8284 13.5042 19.5 12.8326 19.5 12.0042C19.5 11.1757 18.8284 10.5042 18 10.5042H6Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.0607 4.93934C12.4749 4.35355 11.5251 4.35355 10.9393 4.93934C10.3536 5.52513 10.3536 6.47487 10.9393 7.06066L15.8787 12L10.9393 16.9393C10.3536 17.5251 10.3536 18.4749 10.9393 19.0607C11.5251 19.6464 12.4749 19.6464 13.0607 19.0607L19.0607 13.0607C19.6464 12.4749 19.6464 11.5251 19.0607 10.9393L13.0607 4.93934Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}