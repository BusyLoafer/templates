import React from "react";
import './style.scss'

const SimpleImage = (props) => {

  const {
    show = true,
    style = {},
    image = "",
    rounded = true,
    resizeMode = "contain"
  } = props;

  if (!show) {
    return null
  } else return (
    <img
      src={image}
      className={(rounded ? "simpleImage-rounded " : "") + resizeMode}
      style={style}
    />
  )
}

export default SimpleImage;