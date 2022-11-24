import React from 'react'
const baseSize = { x: 24, y: 24 };

export default (props) => {

  const {
    size = baseSize,
    fill = "white"
  } = props;

  return (
    <svg
      width={size.x}
      height={size.y}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M8 5.07148C7.6906 4.89284 7.3094 4.89284 7 5.07147C6.6906 5.25011 6.5 5.58023 6.5 5.9375V18.0619C6.5 18.4192 6.6906 18.7493 7 18.9279C7.3094 19.1066 7.6906 19.1066 8 18.9279L18.5 12.8657C18.8094 12.6871 19 12.357 19 11.9997C19 11.6424 18.8094 11.3123 18.5 11.1337L8 5.07148Z"
        fill={fill}
      />
    </svg>
  )
}