import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RESET_TYPE, SOUND_TYPE, PAUSE_TYPE, CHECK_TYPE, HELP_TYPE, NEXT_TYPE, PANEL_BUTTON as PB, PLAY_TYPE } from "../../lib/const";
import SoundSvg from "../svg/SoundSvg";
import PauseSvg from "../svg/PauseSvg";
import ResetSvg from "../svg/ResetSvg";
import HelpSvg from "../svg/HelpSvg";
import NextSvg from "../svg/NextSvg";
import CheckSvg from "../svg/CheckSvg";
import "./style.scss"

export default (props) => {

  // ? props
  const {
    type = NEXT_TYPE,
    disabled = false,
    active = false,
    onClick = () => { },
    reverse = false,
    show = true
  } = props;

  // ? store
  // const btnScale = useSelector(state => state.btnSizeCoef);

  // ? state
  const [colorStyle, setColorStyle] = useState({});

  // ? refs
  const size = useRef({ x: 24, y: 24 }).current

  // ? effects
  useEffect(() => {
    const newStyle = {
      style: {
        width: 56,
        height: 56,
        borderRadius: 100,
        cursor: disabled ? "default" : "pointer"
      }
    };

    switch (type) {

      case RESET_TYPE:
      case SOUND_TYPE:
      case HELP_TYPE:
      case NEXT_TYPE:
        newStyle.color = disabled ? PB.base.disabled.color : PB.base.active.color;
        newStyle.style =  Object.assign(newStyle.style, PB.base.style);
        break;

      case PAUSE_TYPE:
        newStyle.color = PB.pause.color;
        newStyle.style = Object.assign(newStyle.style, PB.pause.style);
        break;

      case CHECK_TYPE:
        newStyle.color = PB.check.color;
        newStyle.style = Object.assign(newStyle.style, PB.check.style);
        break;

    }
    setColorStyle(newStyle)

  }, [type, active, disabled]);

  // ? functions
  const iconRender = () => {
    switch (type) {
      case RESET_TYPE:
        return (<ResetSvg size={size} color={colorStyle.color} />);
      case SOUND_TYPE:
        return (<SoundSvg size={size} color={colorStyle.color} />);
      case PAUSE_TYPE:
        return (<PauseSvg size={size} color={colorStyle.color} />);
      case HELP_TYPE:
        return (<HelpSvg size={size} color={colorStyle.color} />);
      case NEXT_TYPE:
        return (
          <div className={reverse ? "reverse" : ""} >
            <NextSvg size={size} color={colorStyle.color} />
          </div>
        );
      case CHECK_TYPE:
        return (<CheckSvg size={size} color={colorStyle.color} />);
    }
  }

  if (!show) return null

  return (
    <div
      className="y-btn panelBtn"
      style={colorStyle.style}
      onClick={disabled ? () => { } : onClick}
    >
      {iconRender()}
    </div>
  );
};