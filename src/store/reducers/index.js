import { combineReducers } from "redux";
import isPhone from "./isPhone";
import baseCoef from "./baseCoef";
import baseViewSize from "./baseViewSize";
import btnSizeCoef from "./btnSizeCoef"
import exercises from "./exercises";
import fontScale from "./fontScale";
import completedLesson from "./completedLesson";
import mascot from "./mascot";
import pairPoses from "./pairPoses";
import currentId from "./currentId";
import panelSize from "./panelSize";
import coefMax from "./coefMax";
import lang from "./lang";
import winShowCounter from "./winShowCounter";
import playing from "./playing";
import allImages from "./allImages";
import btnAction from "./btnAction";
import win from "./mascots/win";
import lose from "./mascots/lose";
import confetti from "./mascots/confetti";
import mascotSettings from "./mascots/mascotSettings";
import mascotArr from "./mascots/mascotArr";
import courseId from "./courseId";
import {lessonCheck, lessonCount, lessonId, lessonNext, lessonReset, lessonStatus, maxLessonIndex, currentExDone} from './lessons'
import { activeModal, textModal } from "./modal";
const sounds = (state = [], action) => {
  switch (action.type) {
    case 'SET_SOUNDS':
      return action.value;
    default:
      return state;
  }
}

const preload = (state = false, action) => {
  switch (action.type) {
    case 'SET_PRELOAD':
      return action.value;
    default:
      return state;
  }
}

const listIds = (state = [], action) => {
  switch (action.type) {
    case 'SET_LIST_IDS':
      return action.value;
    default:
      return state;
  }
}

const appReducer = combineReducers({
  isPhone,
  baseCoef,
  playing,
  baseViewSize,
  btnSizeCoef,
  exercises,
  fontScale,
  lessonCount,
  lessonId,
  lessonStatus,
  completedLesson,
  allImages,
  mascot,
  currentId,
  maxLessonIndex,
  panelSize,
  ...pairPoses,
  coefMax,
  lang,
  winShowCounter,
  lessonNext,
  lessonReset,
  lessonCheck,
  btnAction,
  confetti,
  lose,
  win,
  mascotSettings,
  mascotArr,
  sounds,
  preload,
  listIds,
  currentExDone,
  courseId,
  activeModal,
  textModal,
})

// reset the state of a redux store
const rootReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return appReducer(state, action)
}

export default rootReducer;