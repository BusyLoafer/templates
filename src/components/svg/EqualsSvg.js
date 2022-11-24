import * as React from "react"

const baseSizeX = 24;
const baseSizeY = 25;

const EqualsSvg = props => {
  // ? props
  const {
    size = { x: baseSizeX, y: baseSizeY },
    box = [0, 0, 24, 25],
    fill = "#A1ABCD"
  } = props;

  return (
    <svg
      width={size.x}
      height={size.y}
      viewBox={box.join(" ")}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.16071 10.3995C6.7996 10.3995 6.51587 10.2718 6.30952 10.0163C6.10317 9.73751 6 9.35423 6 8.86643C6 8.37862 6.10317 8.00696 6.30952 7.75145C6.51587 7.4727 6.7996 7.33333 7.16071 7.33333H17.8393C18.2176 7.33333 18.5013 7.4727 18.6905 7.75145C18.8968 8.00696 19 8.37862 19 8.86643C19 9.35423 18.8968 9.73751 18.6905 10.0163C18.5013 10.2718 18.2176 10.3995 17.8393 10.3995H7.16071ZM7.16071 17.3333C6.7996 17.3333 6.51587 17.2056 6.30952 16.9501C6.10317 16.6713 6 16.288 6 15.8002C6 15.3124 6.10317 14.9408 6.30952 14.6852C6.51587 14.4297 6.7996 14.302 7.16071 14.302H17.8393C18.2176 14.302 18.5013 14.4297 18.6905 14.6852C18.8968 14.9408 19 15.3124 19 15.8002C19 16.3113 18.8968 16.6945 18.6905 16.9501C18.5013 17.2056 18.2176 17.3333 17.8393 17.3333H7.16071Z"
        fill={fill}
      />

    </svg>
  )
}

export default EqualsSvg