import React, { useEffect, useState, useRef, createRef } from "react";
import { useSelector } from 'react-redux';
import { IMAGE_BUTTON, DEFAULT, CHOOSEN, ERROR, SUCCESS, BTN_COLOR } from "../../lib/const";
import SimpleImage from "../Images/SimpleImage";
import CheckSvg from "../svg/CheckSvg";
import './style.scss';

const { big, small } = IMAGE_BUTTON;

const ImageButton = props => {

  // ? props
  const {
    btnState = DEFAULT,
    image,
    min,
    onClick,
    btnSize=big,
    superBig = false,
    disabled = false,
    selected = false
  } = props;

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const fullSize = useSelector(state => state.baseViewSize);

  // ? state
  const [size, setSize] = useState(btnSize);

  // ? effects
  useEffect(() => {
    if (min) {
      setSize(small)
    }
  }, [min]);

  return (
    <div
      className="imageButton"
      onClick={disabled || btnState === ERROR ? () => { } : onClick}
      style={{width: size.wrapper * coef, height: size.wrapper * coef, borderRadius: size.radius * coef }}
    >
      <div className={"imgBtn imgBtn-" + btnState +
        (disabled || btnState === ERROR ? "-dis" : "") + (min ? "" : "")}
        style={{width: size.wrapper * coef, height: size.wrapper * coef - 4, borderRadius: size.radius * coef}}
      >
        <SimpleImage
          image={image}
          style={{
            width: size.image * coef,
            height: size.image * coef,
            objectFit: "contain",
            opacity: disabled ? 0.6 : 1,
          }}
        />
        {
          selected &&
          <div
            style={{
              position: "absolute",
              display: "flex",
              width: 24 * coef,
              height: 24 * coef,
              borderRadius: 25,
              backgroundColor: "#77C801",
              justifyContent: 'center',
              alignItems: 'center',
              top: 11,
              right: 10
            }}
          >
            <CheckSvg
              size={{ x: 13 * coef, y: 9 * coef }}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default ImageButton;
