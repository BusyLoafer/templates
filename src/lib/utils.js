// import EventBus from "react-native-event-bus";
// import { SOUNDS as S, VIDEO } from "./const";

export const checkSound = (s, playing = () => { }) => {
  if (!s) return
  if (s && s.isLoaded()) {
    if (!s.isPlaying()) {
      s.play(() => {
        playing(false);
      })
      playing(true);
    }
  } else {
    setTimeout(() => checkSound(s, playing), 200);
  }
}

export const baseSoundClick = (s, playing) => {
  if (s) {
    if (s.isPlaying()) {
      s.stop();
      playing(false);
    } else {
      s.play(() => { s.stop(); playing(false); })
      if (s) {
        playing(true);
      }
    }
  }
}

export const stopSound = (s, playing = () => { }) => {
  if (s) {
    s.stop();
    if (s.isPlaying()) {
      playing(false);
    }
  }
}

export const togglePlaySound = (s, playing = () => { }) => {
  if (s && s.isLoaded()) {
    if (!s.isPlaying()) {
      s.play(() => { s.stop(); playing(false) })
      playing(true);
    } else {
      s.pause();
      playing(false);
    }
  }
}

// export const stopAllSounds = (pause = false) => {
//   EventBus.getInstance().fireEvent(S.allStop, { pause: pause });
//   EventBus.getInstance().fireEvent(VIDEO.stop)
// }

export const shuffleId = arr => {
  for (var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr;
}

export const checkShuffle = (arr1, arr2) => {
  let check = true;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] === arr2[i]) { check = false }
  }
  return check;
}

export const unique = arr => {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
}


export const calculateRowPoses = (coef = 1) => {
  const bigImageSize = 116;
  const bigImage = 84;
  const smallImageSize = 72;
  const separatorSize = { x: 20, y: 19 };
  const varsX = 237 * coef;

  const poses = {
    bigImageSize: bigImageSize * coef,
    bigImage: bigImage * coef,
    centerBig: bigImageSize * coef * 0.5,
    smallImageSize: smallImageSize * coef,
    centerSmall: smallImageSize * coef * 0.5,
    separatorSize: { x: separatorSize.x * coef, y: separatorSize.y * coef },
    separators: [],
    left: [],
    right: {
      "1": [],
      "2": [],
      "3": [],
      "4": [],
      "5": []
    },
    lines: [],
    ose: 150 * coef,
  }

  for (let i = 0; i < 4; i++) {
    const x = 51 * coef
    const y = ((bigImageSize + 15) * i + coef) * coef;
    poses.left.push({ x, y });
    poses.lines.push({ x: x + poses.centerBig,y: y + poses.centerBig});
    if (i !== 3) {
      poses.separators.push({ x: 99 * coef, y: y + (bigImageSize - 2) * coef });
    }
  }

  for (let i = 0; i < 5; i++) {
    poses.right["5"].push({
      x: varsX,
      y: ((smallImageSize + 32) * i + 11.5) * coef
    })
  }
  for (let i = 0; i < 4; i++) {
    poses.right["4"].push({
      x: varsX,
      y: ((smallImageSize + 32) * i + 63.5) * coef
    })
  }
  poses.right["3"] = poses.right["5"].slice(1, 4);
  poses.right["2"] = poses.right["4"].slice(1, 3);
  poses.right["1"] = poses.right["5"].slice(2, 3);

  return poses;
}

export const calculatePairPositions = (coef = 1) => {
  
  const baseBigImage = 116;
  const baseSmallImage = 62

  const poses = {
    images: [],
    vars: [],
    imageSize: baseBigImage * coef,
    halfImSize: baseBigImage * coef * 0.5,
    varSize: 62 * coef,
    halfvarSize: 62 * coef * 0.5,
    linePadding: 32 * coef,
    blockPadding: 28 * coef,
    equalsSize: { x: 24 * coef, y: 25 * coef },
    varPadding: 8 * coef,
    maxImageSize: baseBigImage * coef - 16,
    dragImageSize: baseBigImage * coef - 24,
    minImageSize: baseSmallImage * coef,
    centerImagePos: (180 - baseBigImage * 0.5) * coef
  };

  const {
    imageSize,
    halfImSize,
    varSize,
    halfvarSize,
    linePadding,
    blockPadding,
    equalsSize
  } = poses


  const linesY = [];
  for (let i = 0; i < 3; i++) {
    linesY.push(linePadding * i + imageSize * (i + 0.5) + 8)
  }
  poses.linesY = [linesY[1], linesY[0], linesY[2]];
  poses.varY = linesY[2] + halfImSize + blockPadding + varSize * 0.5;

  poses.linesY.forEach(line => {
    poses.images.push({ x: 48 * coef, y: line - halfImSize });
    poses.images.push({ x: 180 * coef - equalsSize.x * 0.5, y: line - equalsSize.y * 0.5 });
    poses.images.push({ x: 196 * coef, y: line - halfImSize });
  })

  poses.vars = [
    { x: 151 * coef, y: poses.varY - halfvarSize },
    { x: 221 * coef, y: poses.varY - halfvarSize },
    { x: 81 * coef, y: poses.varY - halfvarSize },
    { x: 291 * coef, y: poses.varY - halfvarSize },
    { x: 11 * coef, y: poses.varY - halfvarSize },
  ]
  return poses;
}

export const parseText = value => {

  const textArr = value.split("</font>");
  const correctArr = [];

  textArr.forEach(txt => {

    let part = {
      color: null,
      value: txt
    }

    const fontPos = txt.indexOf("<font")

    if (fontPos === 0) {
      part = textSlice(txt)
    } else if (fontPos > 0) {
      part = {
        color: null,
        value: txt.slice(0, fontPos)
      }
      correctArr.push(part);

      const newTxt = txt.slice(fontPos)
      part = textSlice(newTxt)
    }
    correctArr.push(part)
  })

  return correctArr;
}

const textSlice = (txt) => {
  return {
    color: txt.slice(13, 20),
    value: txt.slice(22)
  }
}