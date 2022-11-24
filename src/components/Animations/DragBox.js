import React, { useRef, useState, useEffect } from 'react'
import { motion, useAnimation } from "framer-motion";
import { useSelector } from 'react-redux';

const DragBox = props => {

  const {
    className = "",
    show = true,
    x = 0,
    y = 0,
    children,
    shake = false,
    scale = false,
    scaling = false,
    dis = false,
    onMouseDown = () => { },
    onMouseMove = () => { },
    onMouseUp = () => { },
    onMouseClick = () => { }
  } = props;

  const fullSize = useSelector(state => state.mascotSettings.size);

  const drag = useRef(false);
  const disabled = useRef(false);
  const curPos = useRef({ x: x, y: y });
  const offsetPos = useRef({ x: 0, y: 0 });
  const root = useRef(document.getElementById("app")).current;
  const pos = useAnimation({scale: scaling ? 0 : 1});

  const [active, setActive] = useState(false);

  useEffect(() => {
    disabled.current = dis
  }, [dis])

  useEffect(() => {
    if (shake) {
      pos.start({
        rotate: ["0deg", "-15deg", "0deg", "15deg", "0deg"],
        transitaion: { duration: 0.4 },
      })
    }
  }, [shake])

  useEffect(() => {
    if (scale) {
      pos.set({
        scale: 0
      })
      pos.start({
        scale: 1,
        transition: {type: "spring", bounce: 0.5,  duration: 1, delay: 0.5 }
      })
    }
  }, [scale])


  const down = e => {
    if (!disabled.current) {
      offsetPos.current = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      }
      root.addEventListener("mousemove", move);
      root.addEventListener("mouseup", up);
      onMouseDown();
      setActive(true);
    }
  }

  const go = (poses, anim = false) => {
    if (!anim) {
      pos.set({
        left: poses.x + "px",
        top: poses.y + "px",
      })
    } else {
      pos.start({
        left: x,
        top: y,
      })
    }
  }

  const move = e => {
    drag.current = true;
    curPos.current = {
      x: curPos.current.x + e.movementX,
      y: curPos.current.y + e.movementY
    }
    if (
      // curPos.current.x + offsetPos.current.x < 0 ||
      // curPos.current.y + offsetPos.current.y < 0 ||
      curPos.current.x + offsetPos.current.x > fullSize.width ||
      curPos.current.y + offsetPos.current.y > fullSize.height) {
      up();
    } else {
      go(curPos.current);
      onMouseMove({
        x: curPos.current.x + offsetPos.current.x,
        y: curPos.current.y + offsetPos.current.y,
      });
    }
  }

  const up = e => {
    root.removeEventListener("mousemove", move);
    root.removeEventListener("mouseup", up);
    if (drag.current) {
      onMouseUp({
        x: curPos.current.x + offsetPos.current.x,
        y: curPos.current.y + offsetPos.current.y,
      })
    } else {
      onMouseClick()
    }
    drag.current = false;
    curPos.current = { x: x, y: y };
    offsetPos.current = { x: 0, y: 0 };
    go(null, true);
    setActive(false);
  }

  if (!show) return null;

  return (
    <motion.div
      className={className}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: "pointer",
        scale: scaling || scale ? 0 : 1,
        zIndex: active ? 500 : 20
      }}
      onMouseDown={down}
      animate={pos}
    >
      {children}
    </motion.div>
  )
}

export default DragBox