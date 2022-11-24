import React, { useEffect, useRef, useState } from "react";
import { DRAW_COLORS } from "../../lib/const";

const { drawColor, } = DRAW_COLORS;

const AnimatedStroke = ({
  d,
  line = {
    width: 40,
    color: drawColor
  }
}) => {

  const [length, setLength] = useState(0);

  const ref = useRef(null);

  useEffect(() => {
    setLength(ref.current.getTotalLength())
  }, []);

  return (
    <path
      ref={ref}
      d={d}
      strokeDasharray={length}
      stroke={line.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

export default AnimatedStroke