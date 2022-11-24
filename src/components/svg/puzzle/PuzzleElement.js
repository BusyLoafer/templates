import React, { useEffect, useState } from 'react';


const points = [
  [40],
  [8],
  [15, 40, 23, 45, 23, 53],
  [23, 61, 15, 67, 8, 67],
  [0],
  [107]
]

const delta = [
  { x: 0, y: 40 }, //0, 40
  { x: 8, y: 0 }, // 8, 40
  { x: 7, y: 0 }, // 15-8, 40-40
  { x: 8, y: 5 }, //23-15, 45-40
  { x: 0, y: 8 }, //23-23, 53-45
  { x: 0, y: 8 }, //23-23, 61-53
  { x: -8, y: -6 }, //15-23, 67-61
  { x: -7, y: 0 }, //8-15, 67-67
  { x: -8, y: 0 }, //0-8, 67-67
  { x: 0, y: 40 }, //0-0, 107-67
]

const dir = {
  down: {
    x: 0,
    y: 1,
    z: 1
  },
  up: {
    x: 0,
    y: 1,
    z: -1
  },
  right: {
    x: 1,
    y: 0,
    z: 1
  },
  left: {
    x: 1,
    y: 0,
    z: -1
  },
}

const rotate = {
  up: 1,
  down: -1
}

const deltaArr = [
  [[0, 40]],
  [[8, 0]],
  [[7, 0], [8, 5], [0, 8]],
  [[0, 8], [-8, 6], [-7, 0]],
  [[-8, 0]],
  [[0, 40]]
]
const deltaArr2 = [
  [[0, 40]],
  [[8, 0]],
  [[7, 0], [8, -5], [0, -8]],
  [[0, -8], [-8, -6], [-7, 0]],
  [[-8, 0]],
  [[0, 40]]
]

const color = "white";

const letters = ["L", "L", "C", "C", "L", "L"];

const PuzzleElement = props => {

  const {
    // size = { x: 23, y: 107 },
    size = { x: 130, y: 130 },
    coef = 1,
    paths = [],
    fill = "#BCCCF5"
  } = props;

  const [path, setPath] = useState("M0 0V40H8C15 40 23 45 23 53C23 61 15 67 8 67H0V107");

  useEffect(() => {
    let cP = [0, 0];
    let str = "";
    paths.forEach(p => {
      switch (p.type) {
        case "H":
          cP[0] += p.value * coef;
          str += "L" + cP.join(" ");
          break;
        case "V":
          cP[1] += p.value * coef;
          str += "L" + cP.join(" ");
          break;
        case "M":
          cP = [p.value[0] * coef, p.value[1] * coef];
          str += "M" + cP.join(" ");
          break;
        default:
          const nDir = dir[p.type];
          const nRot = rotate[p.rotate];
          let newDeltaArr = deltaArr.slice();
          newDeltaArr.forEach((dArr, index) => {
            str += letters[index]
            const signals = [
              nDir.z,
              [0, 5].includes(index) ? nDir.z : nRot
            ]
            const signalY = [0, 5].includes(index) ? nDir.z : nRot;
            const signalX = nDir.z;
            const subArr = [];
            dArr.forEach(arr => {
              cP = [cP[0] + arr[nDir.x] * signals[nDir.y] * coef, cP[1] + arr[nDir.y] * signals[nDir.x] * coef];
              subArr.push(cP[0])
              subArr.push(cP[1])
            })
            str += subArr.join(" ");
          })
      }
    })
    setPath(str);
  }, [paths])

  // useEffect(() => {
  //   if (coef !== 1) {
  //     // calculateNewPath();
  //   }
  // }, [coef])

  const calculateNewPath = () => {
    const newPoints = points.map((pArr, i) => {
      return letters[i] + pArr.map(p => p * coef).join(" ")
    }).join();
    setPath(newPoints);
  }

  return (
    <svg
      width={size.x * coef}
      height={size.y * coef}
      viewBox={[0, 0, size.x * coef, size.y * coef].join(" ")}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth={2}
    >
      {
        <path
          d={path}
        />
      }
    </svg>
  )
}

export default PuzzleElement
