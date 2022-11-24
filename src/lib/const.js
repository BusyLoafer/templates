// ! Colors
export const purpur = "#7480FF";
export const purpurLight = "#E5E8FF";
export const white = "#FFFFFF"
export const baseBackground = white;
export const yellow = "#FFD033"

// ! button style
export const DEFAULT = 'default';
export const CHOOSEN = 'choosen';
export const ERROR = 'error';
export const SUCCESS = 'success';
export const EMPTY = 'empty';

// ! button type
export const RESET_TYPE = 'reset';
export const SOUND_TYPE = 'sound';
export const PAUSE_TYPE = 'pause';
export const HELP_TYPE = 'help';
export const PLAY_TYPE = 'play';
export const LEFT_TYPE = 'left';
export const RIGHT_TYPE = 'right';
export const NEXT_TYPE = 'next';
export const CHECK_TYPE = 'check';

// ! button colors
export const BTN_COLOR = {
  default: {
    act: '#8FA3C1',
    dis: '#BCC8DA'
  },
  error: {
    act: '#BB3B4C',
    dis: '#BB3B4C'
  },
  shoosen: {
    act: '#7480FF',
    dis: '#4C58DD'
  },
  success: {
    act: '#77C801',
    dis: '#57A405'
  },
}

export const PANEL_SIZE = {
  up: 56,
  down: 110,
  paddingTop: 0,
  paddingDown: 0,
};

// ! base sounds
export const SOUNDS = {
  win: "soundWin",
  click: "soundClick",
  error: "soundError",
  fail: "soundFail",
  right: "soundRight",
  play: "play",
  pause: "pause",
  stop: "stop",
  dur: "getDur",
  allStop: "allStop",
  winStop: "winStop",
  boom: "boom",
  flip: {
    base: "flip",
    error: "flipError",
    right: "flipRight"
  }
}

export const VIDEO = {
  stop: "stopVideo"
}

// ! mascot sounds
export const M_SOUNDS = {
  yutu: {
    bigTrue: ["yutuBigTrue", "yutuBigTrue2"],
    bigFalse: ["yutuBigFalse", "yutuBigFalse2"],
    smallTrue: "yutuSmallTrue",
    smallFalse: "yutuSmallFalse",
  },
  giraffe: {
    bigTrue: ["giraffeBigTrue", "giraffeBigTrue2"],
    bigFalse: ["giraffeBigFalse", "giraffeBigFalse2"],
    smallTrue: "giraffeSmallTrue",
    smallFalse: "giraffeSmallFalse",
  }
}

// ! base text
export const TEXT = {
  color: "#121C42",
  fontSize: 14
}

export const TYPE_WEIGHT = {
  small: "Nunito-SemiBold",
  middle: "Nunito-Bold",
  big: "Nunito-ExtraBold"
}

// ! base image
export const IMAGE = {
  borderRadius: 4
}

// !base button size

export const BUTTON_SIZE = {
  btnSize: 47,
  btnShadowSize: 4,
  btnAreaPadding: 8,
  btnCoef: 1.5,
  btnFontSize: 20,
  btnWordFontSize: 16,
  btnLineHeightCoef: 1.4,
  btnBorderRadius: 16
}

// !svg button size

export const SVG_SIZE = {
  svgBig: {
    btnSize: 56,
    btnShadowSize: 4,
    svgImageSize: 24
  },

  svgSmall: {
    btnSize: 32,
    btnShadowSize: 2,
    svgImageSize: 13
  }
}

// !svg button color

export const SVG_COLOR = {
  btnSound: {
    color: "#FFD033",
    shadow: "#F2C017"
  },
  btnReset: {
    color: "#EAEEFD",
    shadow: "#BFC7E2"
  },
  btnPause: {
    color: "#7480FF",
    shadow: "#3A46C9"
  },
  btnPlay: {
    color: purpur,
  },
  btnLeftRight: {
    color: white,
  },
}

// ! Draw
export const DRAW_COLORS = {
  borderColorMin: "#D07D22",
  borderColorMax: "#F2C017",
  drawColor: "#FFD033",
  backgroundLetterColor: "#A5ACFF",
  pointColor: "#FFFFFF",
}

export const DRAW_SETTINGS = {
  drawTimeout: 2,
  step: 10,
  minLength: 40,
  basePadding: 40,
  pointWidth: 4,
  strokeDash: "5 15",
  strokeLinecap: "round"
}

export const DRAW_CURSOR = {
  bigSize: 56,
  bordersize: 4,
  borderRadiusBig: 28,
  smallSize: 20,
  borderRadiusSmall: 10
}

// ! Question panel
export const QUESTION_PANEL = {
  shadow: "#5530A5",
  background: "#6F4DB8",
  borderRadius: 32,
  flaer: {
    width: 50,
    opacity: 0.6,
    top: -50
  },
  questionSize: 64,
  baseStartValue: -100,
  baseDuration: 1000,
  baseTimeout: 8000
}

// ! Mascot with text
export const MASCOT_TEXT = {
  basePadding: 12,
  borderTextColor: "#F0F2F6",
  background: baseBackground,
  baseHeight: 150
}

// ! ImageButton
export const IMAGE_BUTTON = {
  big: {
    wrapper: 162,
    image: 130,
    radius: 24,
  },
  small: {
    wrapper: 104,
    image: 88,
    radius: 16,
  },
  shadowSize: 2,
}

// ! upPanel
export const UP_PANEL = {
  upPanel: {
    height: 56,
    padding: [12, 16, 4],
  },
  lessonCount: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 14,
  },
  closeBtn: {
    size: 40,
    borderWidth: 1,
  },
  path: {
    size: 8,
  },
}

// ! bottomPanel
export const BOTTOM_PANEL = {
  basePadding: 16,
  borderRadius: 40,
  nextSize: 56,
  nextLineHeight: 40,
  height: 60,
  marginBottom: 20,
}

// ! Puzzle
export const PUZZLE = {
  baseMinSize: 107,
  baseMaxSize: 130,
  imagePadding: 24,
  partPadding: 8,
  partSize: 80,
}

// ! word order template
export const MAKE_WORD = {
  basePositions: [
    { x: 25, y: 16 },
    { x: 135, y: 70 },
    { x: 250, y: 15 },
    { x: 42, y: 270 },
    { x: 152, y: 160 },
    { x: 246, y: 200 },
    { x: 15, y: 357 },
    { x: 65, y: 407 },
    { x: 154, y: 390 },
    { x: 240, y: 410 },
    { x: 257, y: 364 },
  ],
  colors: [
    "#A5ACFF",
    "#69C9D6",
    "#77C801",
    "#6F4DB8",
    "#57ADFD",
    "#EC5569",
    "#7480FF",
    "#FFD033",
    "#77C801",
    "#6F4DB8",
    "#57ADFD",
  ],
  rotations: [
    "15",
    "10",
    "22",
    "-18",
    "-5",
    "-15",
    "-4",
    "-15",
    "10",
    "-18",
    "20",
  ]
}

// ! OrderTemplate
export const ORDER = {
  pathPoints: [
    { x: 96, y: 65 },
    { x: 96, y: 197 },
    { x: 96, y: 329 }
  ],
  imagePoints: [
    { x: 96, y: 65, id: 1 },
    { x: 265, y: 65, id: 0 },
    { x: 265, y: 197, id: 2 },
    { x: 96, y: 197, id: 1 },
    { x: 96, y: 329, id: 3 },
    { x: 265, y: 329, id: 2 },
    { x: 265, y: 461, id: 4 },
    { x: 96, y: 461, id: 3 }
  ],
  pathSize: { x: 168, y: 132 },
  roundSize: 90, // 112
  imageSize: 80, // 93
}

// ! Scale
export const SCALE = {
  btnTablet: 1.2,
  btnSize: 2
}

// ! Quiz Sentence
export const QUIZ_SENTENCE = {
  headPaddingTop: 24
}

// ! Pairs
export const PAIRS = {
  grey: "#D2DAE1",
  blue: "#7480FF",
  green: "#77C801",
  red: "#EC5569"
}

// ! Mascots
export const YUTU_MASCOT = 'yutu';
export const GIRAFFE_MASCOT = 'giraffe';

export const MASCOT_JSON = {
  YUTU_MASCOT_JSON: '../assets/lottie/yutu/greeting.json',
  YUTU_MASCOT_EXPLAIN_JSON: '../assets/lottie/yutu/explain.json',
  YUTU_MASCOT_WAIT_JSON: '../assets/lottie/yutu/waiting.json',
  YUTU_MASCOT_NOT_RIGHT_JSON: '../assets/lottie/yutu/not_right.json',
  YUTU_MASCOT_YOU_DID_IT_JSON: '../assets/lottie/yutu/you_did_it.json',
  YUTU_MASCOT_APPROVE_JSON: '../assets/lottie/yutu/approve.json',

  GIRAFFE_MASCOT_JSON: '../assets/lottie/giraffe/greeting.json',
  GIRAFFE_MASCOT_EXPLAIN_JSON: '../assets/lottie/giraffe/explain.json',
  GIRAFFE_MASCOT_WAIT_JSON: '../assets/lottie/giraffe/waiting.json',
  GIRAFFE_MASCOT_NOT_RIGHT_JSON: '../assets/lottie/giraffe/not_right.json',
  GIRAFFE_MASCOT_YOU_DID_IT_JSON: '../assets/lottie/giraffe/you_did_it.json',
  GIRAFFE_MASCOT_APPROVE_JSON: '../assets/lottie/giraffe/approve.json',
}

export const WIN_SHOW_MAX_COUNT = 3;

export const PANEL_BUTTON = {
  base: {
    disabled: {
      color: "#A1ABCD",
    },
    active: {
      color: "#7480FF",
    },
    style: {
      backgroundColor: "white",
      borderColor: "#EAEFFC",
      // borderColor: "orange",
    }
  },
  pause: {
    color: "#C5821F",
    style: {
      backgroundColor: "#FFD033",
      borderColor: "#FDE38C",
    }
  },
  check: {
    color: "white",
    style: {
      backgroundColor: "#7480FF",
      borderColor: "#E5E8FF",
    }
  },
  next: {
    color: "white",
    style: {
      backgroundColor: "#77C801",
      borderColor: "#AFEA59",
    }
  },
  play: {
    color: "white",
    style: {
      backgroundColor: "#7480FF",
      borderColor: "#E5E8FF",
    }
  },
  playPause: {
    color: "white",
    style: {
      backgroundColor: "#77C801",
      borderColor: "#77C801",
    }
  }
}

export const EX_CONTENT_TYPE = {
  info: "info_content",
  audioAbc: "audio_abc_content",
  rebus: "rebus_content",
  quizSwow: "quiz_swow_content",
  puzzle: "puzzle_content",
  quizSentence: "quiz_sentence_content",
  quizImage: "quiz_img_content",
  quiz: "quiz_content",
  audioBook: "audio_book_content",
  draw: "draw_content",
  pair: "find_pair_content",
  pictureOrder: "picture_order_content",
  row: "row_content",
  video: "video_info_content",
  makeWord: "make_word_content",
  bubble: "bubble_content",
  memory: "memory_content",
  fillwords: "fillwords_content"
}
export const EX_TYPE = {
  info: "info_content",
  audio_abc: "audio_abc_content",
  rebus: "rebus_content",
  quiz_swow: "quiz_swow_content",
  puzzle: "puzzle_content",
  quiz_sentence: "quiz_sentence_content",
  quiz_img: "quiz_img_content",
  quiz: "quiz_content",
  audio_book: "audio_book_content",
  draw: "draw_content",
  find_pair: "find_pair_content",
  picture_order: "picture_order_content",
  row: "row_content",
  video_info: "video_info_content",
  make_word: "make_word_content",
  bubble: "bubble_content",
  memory: "memory_content",
  fillwords: "fillwords_content"
}