import React from "react";
import { useSelector } from "react-redux";
import { generateFontSize } from "../../lib/StyleGenerator";
import './style.scss'

export default (props) => {

  // ? props
  const {
    text = "Текст",
    addMarginStyle = {},
    addTextStyle = {}
  } = props;

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const fontScale = useSelector(state => state.fontScale);

  // ? consts
  const style = Object.assign({
    fontSize: generateFontSize(12, coef, fontScale),
    lineHeight: 18 * coef + 'px'
  }, addTextStyle)

  return (
    <div style={addMarginStyle}>
      <p className="label" style={style}>{text}</p>
    </div>
  );
}
