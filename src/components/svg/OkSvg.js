import * as React from "react";
import {useSelector} from "react-redux";

const baseSize = { x: 25, y: 19 };

const OkSvg = props => {
  const {
    size = { x: baseSize.x, y: baseSize.y },
    box = [0, 0, baseSize.x, baseSize.y],
    fill = "#FAFAFA"
  } = props;

  const coef = useSelector(state => state.baseCoef);

  return (
    <svg
      width={size.x * coef}
      height={size.y * coef}
      viewBox={box.join(" ")}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.9173 4.30795L10.6464 17.5785C10.2482 17.9767 9.7256 18.1771 9.20297 18.1771C8.68034 18.1771 8.15772 17.9767 7.75958 17.5785L1.12428 10.9432C0.32576 10.1451 0.32576 8.8546 1.12428 8.05645C1.92243 7.25793 3.21256 7.25793 4.01108 8.05645L9.20297 13.2483L21.0305 1.42116C21.8287 0.622635 23.1188 0.622635 23.9173 1.42116C24.7155 2.21931 24.7155 3.50943 23.9173 4.30795Z"
        fill={fill}
      />
    </svg>
  )
}

export default OkSvg