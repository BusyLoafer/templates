import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {NEXT_TYPE, PANEL_BUTTON as PB, PAUSE_TYPE, PLAY_TYPE} from "../../lib/const";
import { motion, useAnimation } from "framer-motion"
import NextSvg from "../svg/NextSvg";
import PlaySvg from "../svg/PlaySvg";
import PauseSvg from "../svg/PauseSvg";

const minSize = 56;
const maxSize = 86;

export default (props) => {

  // ? props
  const {
    show = true,
    type = NEXT_TYPE,
    active = false,
    dis = false,
    onClick = () => { },
  } = props;

  // ? store
  // const btnScale = useSelector(state => state.btnSizeCoef);

  // ? state
  const [colorStyle, setColorStyle] = useState({});

  // ? animations
  const circle = useAnimation();

  // ? refs
  const size = useRef({ x: 24, y: 24 }).current;

  // ? effects
  useEffect(() => {
    let newStyle = {}
    switch (type) {
      case NEXT_TYPE:
        newStyle = {
          color: active ? PB.next.color : PB.base[dis ? 'disabled' : 'active'].color,
          style: Object.assign({
            borderRadius: 100,
            width: minSize,
            height: minSize,
            cursor: dis && !active ? "default" : "pointer"
          }, !active ? PB.base.style : PB.next.style)
        };
        break;
      case PAUSE_TYPE:
        newStyle = {
          color: PB.playPause.color,
          style: Object.assign({
            borderRadius: 100,
            width: minSize,
            height: minSize,
            cursor: dis ? "default" : "pointer"
          }, PB.playPause.style)
        };
        break;
      case PLAY_TYPE:
        newStyle = {
          color: PB.play.color,
          style: Object.assign({
            borderRadius: 100,
            width: minSize,
            height: minSize,
            cursor: dis ? "default" : "pointer"
          }, PB.play.style)
        };
    }
    setColorStyle(newStyle);
  }, [type, active, dis]);

  useEffect(() => {
    if (active && show) {
      startAnim();
    } else {
      circle.stop()
    }
  }, [active, show]);

  // ? functions
  const startAnim = () => {
    circle.start({
      width: [minSize, maxSize, minSize],
      height: [minSize, maxSize, minSize],
      transition: { duration: 1, times: [0, 0.5, 1] }
    }).then(startAnim)
  }

  const SvgIcon = () => {
    switch (type) {
      case NEXT_TYPE:
        return <NextSvg size={size} color={colorStyle.color} />
      case PLAY_TYPE:
        return <PlaySvg color={colorStyle.color} />
      case PAUSE_TYPE:
        return <PauseSvg size={size} color={colorStyle.color} />
    }
  }

  if (!show) return null

  return (
    <div
      className="y-btn flashBtn"
      style={
        colorStyle.style
      }
      onClick={onClick}
    >
      <motion.div
        className={"flashStyle " + (active ? "flashStyle-active" : "")}
        animate={circle}
        style={
          {
            width: minSize,
            height: minSize,
          }
        }
      >
        <div
          className={"centerBtn " + (active ? "centerBtn-active" : "")}
          style={{
            width: minSize,
            height: minSize,
          }}
        >
          <SvgIcon/>
        </div>
      </motion.div>
    </div>
  );
};