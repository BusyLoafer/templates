import React from 'react'
import { TEXT, TYPE_WEIGHT } from '../../lib/const';
import { useSelector } from "react-redux";
import { generateFontSize } from "../../lib/StyleGenerator";
import './style.scss'

const SimpleText = props => {

  // ? props
  const {
    show = true,
    text = "",
    style = {},
    fontSize = TEXT.fontSize,
    align = "center",
    fontFamily = TYPE_WEIGHT.small
  } = props;

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const fontScale = useSelector(state => state.fontScale);


  if (!show) return null;

  const newStyle = Object.assign( {
    fontSize: generateFontSize(fontSize, coef, fontScale),
    fontWeight: fontFamily,
    align: align
  }, style)

  return (
      <p className='simpleText' style={newStyle}>{text}</p>
  )
}

export default SimpleText;