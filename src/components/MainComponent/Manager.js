import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../../lib/config";
import { SCALE, YUTU_MASCOT } from "../../lib/const";
import {calculatePairPositions, calculateRowPoses, unique} from "../../lib/utils";
import store from "../../store";
import {
  resetStore,
  setBaseCoef,
  setBaseViewSize,
  setCoefMax,
  setCompletedLesson,
  setCurrentExDone,
  setCurrentId,
  setExercises,
  setLessonCount,
  setLessonId,
  setLessonStatus,
  setListIds,
  setMascot,
  setMascotArr,
  setMascotSettings,
  setMaxLessonIndex,
  setPreload,
  setSounds,
  setActiveModal,
  setTextModal,
  setPairPoses,
  setCourseId,
  setRowPoses
} from "../../store/actions";
import { settings } from "./DefaultSettings";


const setParams = data => {
  generateMascots(data);
  findSounds(data.exercises);
  defaultLessonStatuses(data.exercises);
  store.dispatch(setListIds(data.exercises.map(ex => ex.id)));
  store.dispatch(setMascot(data.mascot));
  store.dispatch(setExercises(data.exercises));
}

const generateMascots = data => {
  const newMascotArr = [];
  const mascots = ['yutu', 'giraffe'];
  data.exercises.forEach(_ => {
    newMascotArr.push(mascots[Math.floor(Math.random() * 2)]);
  })
  store.dispatch(setMascotArr(newMascotArr));
}

const findSounds = exercises => {
  const newsounds = [];
  exercises.forEach(ex => {
    if (ex) {
      if (ex.rebus_content) {
        const s = Object.assign({}, settings.rebus_content);
        if (ex.rebus_content.voiceOver) {
          s.sound = ex.rebus_content.voiceOver.fileUrl
        }
        newsounds.push(s)
      } else if (ex.quiz_swow_content) {
        const s = Object.assign({}, settings.quiz_swow_content);
        if (ex.quiz_swow_content.sound) {
          s.sound = ex.quiz_swow_content.sound.fileUrl
        }
        newsounds.push(s)
      } else if (ex.audio_abc_content) {
        const s = Object.assign({}, settings.audio_abc_content);
        if (ex.audio_abc_content.sound) {
          s.sound = ex.audio_abc_content.sound.fileUrl
        }
        if (ex.audio_abc_content.voiceOver) {
          s.sound = ex.audio_abc_content.voiceOver.fileUrl
        }
        newsounds.push(s)
      } else if (ex.puzzle_content) {
        const s = Object.assign({}, settings.puzzle_content);
        if (ex.puzzle_content.voiceOver) {
          s.sound = ex.puzzle_content.voiceOver.fileUrl
        }
        newsounds.push(s)
      } else if (ex.audio_book_content) {
        const s = Object.assign({}, settings.audio_book_content);
        if (ex.audio_book_content.sound) {
          s.sound = ex.audio_book_content.sound.fileUrl
        }
        newsounds.push(s)
      } else if (ex.info_content) {
        const s = Object.assign({}, settings.info_content);
        if (ex.info_content.mascot.audioFile) {
          s.sound = ex.info_content.mascot.audioFile
        }
        newsounds.push(s)
      } else if (ex.quiz_sentence_content) {
        const s = Object.assign({}, settings.quiz_sentence_content);
        if (ex.quiz_sentence_content.sound) {
          s.sound = ex.quiz_sentence_content.sound.fileUrl
        }
        if (ex.quiz_sentence_content.voiceOver) {
          s.sound = ex.quiz_sentence_content.voiceOver.fileUrl
        }
        newsounds.push(s)
      } else if (ex.quiz_img_content) {
        const s = Object.assign({}, settings.quiz_img_content);
        if (ex.quiz_img_content.sound) {
          s.sound = ex.quiz_img_content.sound.fileUrl
        }
        if (ex.quiz_img_content.buttons && ex.quiz_img_content.buttons.correctAudio) {
          s.correct = ex.quiz_img_content.buttons.correctAudio
        }
        newsounds.push(s)
      } else if (ex.quiz_content) {
        const s = Object.assign({}, settings.quiz_content);
        if (ex.quiz_content.sound) {
          s.sound = ex.quiz_content.sound.fileUrl
        }
        if (ex.quiz_content.buttons && ex.quiz_content.buttons.correctAudio) {
          s.correct = ex.quiz_content.buttons.correctAudio
        }
        newsounds.push(s)
      } else if (ex.audio_book_content) {
        newsounds.push(Object.assign({}, settings.audio_book_content));
      } else if (ex.video_info_content) {
        newsounds.push(Object.assign({}, settings.video_info_content));
      } else if (ex.draw_content) {
        const s = Object.assign({}, settings.draw_content);
        if (ex.draw_content.voiceOver) {
          s.sound = ex.draw_content.voiceOver.fileUrl
        }
        newsounds.push(s)
      } else if (ex.bubble_content) {
        const s = Object.assign({}, settings.bubble_content);
        if (ex.bubble_content.voiceOver) {
          s.sound = ex.bubble_content.voiceOver.fileUrl
        }
        newsounds.push(s)
      } else if (ex.memory_content) {
        const s = Object.assign({}, settings.memory_content);
        if (ex.memory_content.voiceOver) {
          s.sound = ex.memory_content.voiceOver.fileUrl
        }
        newsounds.push(s)
      } else if (ex.fillwords_content) {
        const s = Object.assign({}, settings.fillwords_content);
        if (ex.fillwords_content.voiceOver) {
          s.sound = ex.fillwords_content.voiceOver.fileUrl
        }
        newsounds.push(s)
      } else if (ex.picture_order_content) {
        const s = Object.assign({}, settings.picture_order_content);
        if (ex.picture_order_content.voiceOver) {
          s.sound = ex.picture_order_content.voiceOver.fileUrl;
        }
        newsounds.push(s)
        return null
      } else if (ex.row_content) {
        const s = Object.assign({}, settings.row_content);
        if (ex.row_content.voiceOver) {
          s.sound = ex.row_content.voiceOver.fileUrl;
        }
        newsounds.push(s)
      } else if (ex.make_word_content) {
        const s = Object.assign({}, settings.make_word_content);
        if (ex.make_word_content.voiceOver && ex.make_word_content.voiceOver.fileUrl) {
          s.sound = ex.make_word_content.voiceOver.fileUrl;
        }
        if (ex.make_word_content.word && ex.make_word_content.word.correctAudio) {
          s.correct = ex.make_word_content.word.correctAudio;
        }
        newsounds.push(s)
      } else if (ex.find_pair_content) {
        const s = Object.assign({}, settings.find_pair_content);
        if (ex.find_pair_content.voiceOver) {
          s.sound = ex.find_pair_content.voiceOver.fileUrl
        }
        newsounds.push(s);
      } else {
        return null
      }
    }
  });
  store.dispatch(setSounds(newsounds));
}

export const setCurrentCourse = id => {
  store.dispatch(setCourseId(id))
}

export const checkFinish = (onExit) => {
  const { lessonId, lessonCount, courseId } = store.getState();
  if (lessonId !== 0 && lessonId === lessonCount - 1) {

    const exerciseCompletedIds = parseStatusExercises();
    onExit(exerciseCompletedIds)
    // location.href = '/course/' + courseId
  }
}


const parseStatusExercises = () => {
  const arr = [];

  const {lessonStatus, exercises} = store.getState();
  lessonStatus.forEach((lS, index) => {
    if (lS && exercises[index]) {
      arr.push(exercises[index].id)
    }
  })
  return arr;
}

export const setSettings = data => {
  const convertObj = JSON.parse(data);
  convertObj.isPhone = false;
  convertObj.mascot = YUTU_MASCOT;
  checkImage(data)
  // store.dispatch(resetStore())
  setParams(convertObj)
}

const checkImage = data => {
  const pattern = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpe?g|gif|png)/g;
  data = data.replace(/\\/g, "");
  const imageArr = data.match(pattern)
  if (imageArr) {
    preloadImages(imageArr)
  } else {
    store.dispatch(setPreload(true))
  }
}

const preloadImages = urlOfImages => {
  const newUrlOfImages = unique(urlOfImages)
  let preFetchTasks = [];
  newUrlOfImages.forEach(url => {
    preFetchTasks.push(
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = () => reject()

        img.src = url
      })
    )
  });

  Promise.all(preFetchTasks).then((results) => {
    try {
      let downloadedAll = true;
      results.forEach(result => {
        if (!result) {
          downloadedAll = false;
        }
      })
      if (downloadedAll) {
        store.dispatch(setPreload(true))
      }

    } catch (e) { console.log(e) }
  })
}

export const lessonCompletion = (index = null) => {
  changeStatuses(index)
}

export const onLessonReset = (index = null) => {
  changeStatuses(index, false)
}

const changeStatuses = (index = null, done = true) => {
  if (!index) {
    index = store.getState().lessonId;
  }
  const newStatuses = store.getState().lessonStatus.slice();
  newStatuses[index] = done;
  checkCountDoneLssn(newStatuses)
  changeCurrentExDone(done);
  store.dispatch(setLessonStatus(newStatuses));
}
//setCurrentExDone
const checkCurrentExDone = index => {
  changeCurrentExDone(store.getState().lessonStatus[index])
}

const changeCurrentExDone = value => {
  store.dispatch(setCurrentExDone(value));
}

const checkCountDoneLssn = value => {
  let count = 0;
  value.forEach(lsn => {
    count += lsn
  })
  store.dispatch(setCompletedLesson(count));
}

export const onIndexChanged = index => {
  const { exercises, lessonStatus, lessonCount, listIds, maxLessonIndex } = store.getState();
  if (exercises[index] && (
    exercises[index].audio_book_content ||
    exercises[index].audio_abc_content || exercises[index].info_content || exercises[index].video_info_content)) {
    if (!lessonStatus[index]) {
      lessonCompletion(index);
    }
  } else {
    checkCurrentExDone(index)
  }
  if (index >= 0 && index < lessonCount) {
    store.dispatch(setLessonId(index || 0));
    const currentId = listIds[index];
    store.dispatch(setCurrentId(currentId || 0))
    if (index > maxLessonIndex) {
      store.dispatch(setMaxLessonIndex(index))
    }
  }
}

const defaultLessonStatuses = exercises => {
  store.dispatch(setLessonStatus(exercises.map(_ => false)));
  store.dispatch(setLessonCount(exercises.length));
  setTimeout(() => {
    store.dispatch(setLessonId(0));
  }, 100);
}

export const calculateCoef = size => {
  const wC = size.width / DEFAULT_WIDTH;
  const hC = size.height / DEFAULT_HEIGHT;

  const coefMin = wC < hC ? wC : hC;
  const coefMax = wC > hC ? wC : hC;
  const newViewSize = {
    width: DEFAULT_WIDTH * coefMin,
    height: DEFAULT_HEIGHT * coefMin,
    maxWidth: DEFAULT_WIDTH * coefMin,
    maxHeight: DEFAULT_HEIGHT * coefMin,
    position: "relative"
  }
  store.dispatch(setMascotSettings({
    size: {width: size.width, height: size.height + 64},
    newSize: { x: DEFAULT_WIDTH * coefMin, y: 591 * coefMin },
    widthScale: wC,
    heightScale: hC,
    misScale: coefMin,
    top: 56,
  }))
  store.dispatch(setBaseViewSize(newViewSize));
  store.dispatch(setBaseCoef(coefMin));
  store.dispatch(setCoefMax(coefMax));
  store.dispatch(setPairPoses(calculatePairPositions(coefMin)));
  store.dispatch(setRowPoses(calculateRowPoses(coefMin)));
  const doc = document.documentElement
  doc.style.setProperty('--baseScale', `${coefMin}`)
}

export const showModal = text => {
  store.dispatch(setActiveModal(true))
  store.dispatch(setTextModal(text))
}

export const hideModal = () => {
  store.dispatch(setActiveModal(false))
}