import * as React from "react"

export default (props) => {
  
  const { 
    color = "#fff",
    size = {
      x: 24, 
      y: 24,
    }
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
        d="M8 5a1 1 0 011 1v12a1 1 0 11-2 0V6a1 1 0 011-1zm8 0a1 1 0 011 1v12a1 1 0 11-2 0V6a1 1 0 011-1z"
        strokeWidth="2"
        fill={color}
        stroke={color}
      />
    </svg>
  )
}