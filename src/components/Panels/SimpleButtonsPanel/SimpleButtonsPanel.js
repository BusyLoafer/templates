import React from "react";
import './style.scss'

export default props => {

  const {
    show = true,
    children,
    style,
  } = props;

  if (!show) return null;

  return (
    <div className="btnGroup" style={style}>
      {children}
    </div>
  )
}

