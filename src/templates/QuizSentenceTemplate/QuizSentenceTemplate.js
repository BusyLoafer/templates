import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import { BottomModal, ModalContent, ModalFooter, SlideAnimation } from 'react-native-modals';
import {
  DEFAULT,
  CHOOSEN,
  ERROR,
  EMPTY,
  SUCCESS,
  BUTTON_SIZE,
  YUTU_MASCOT,
  TEXT,
  BOTTOM_PANEL,
  SOUNDS as S,
  GIRAFFE_MASCOT,
  M_SOUNDS as MS,
  RESET_TYPE,
  CHECK_TYPE,
  HELP_TYPE,
  EX_CONTENT_TYPE,
} from "../../lib/const";
import YutuButton from "../../components/Buttons/YutuButton";
import Label from "../../components/Text/Label";
import { checkShuffle, shuffleId } from "../../lib/utils";
import { GIRAFFE, YUTU } from "../../lib/Lottie";
import { setBtnAction, setConfetti, setLessonCheck, setLessonNext } from "../../store/actions";
import MascotWithText from "../../components/Mascots/lottie/MascotWithText";
import { EventBus } from "../../lib/EventBus";
import { lessonCompletion, onLessonReset, showModal } from "../../components/MainComponent/Manager";
import { useAnimation, motion } from "framer-motion";

import "./style.scss"
import AnimateButtonsPanel from "../../components/Panels/ButtonsPanel/AnimateButtonsPanel";

const lessonType = EX_CONTENT_TYPE.quizSentence;
const {
  btnSize,
  btnAreaPadding,
  btnBorderRadius,
} = BUTTON_SIZE;

const QuizSentenceTemplate = (props) => {

  // ? props
  const {
    ex,
    exerciseDone,
    mascot,
    onLayout
  } = props;

  const dispatch = useDispatch();

  // ? refs
  const areaRef = useRef(null);
  const btnRef = useRef(null);

  const modal = useAnimation();


  const ref = useRef(null);
  const snapTo = (i) => ref.current.snapTo(i);

  // ? store
  const fontScale = useSelector(state => state.fontScale);
  const coef = useSelector(state => state.baseCoef);
  const currentId = useSelector(state => state.currentId);
  const btnSizeCoef = useSelector(state => state.btnSizeCoef)
  const baseViewSize = useSelector(state => state.baseViewSize);
  const btnAction = useSelector(state => state.btnAction);

  // ? state
  const [currentLetters, setCurrentLetters] = useState([]);
  const [chossenLetters, setChossenLetters] = useState([]);
  const [btnType, setBtnType] = useState(CHOOSEN);
  const [correctWord, setCorrectWord] = useState("");
  const [label, setLabel] = useState("");
  const [showHelpWindow, setShowHelpWindow] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [mascotText, setMascotText] = useState("");
  const [btnDis, setBtnDis] = useState(false)
  const [mascotData, setMascotData] = useState({
    mascot: null,
    autoPlayMascot: true,
    loop: true,
    onAnimationFinish: () => { }
  });

  // ? effects
  useEffect(() => {
    dispatch(setLessonCheck(false))
  }, [currentId])

  useEffect(() => {
    if (ex.id === currentId) {
      switch (btnAction) {
        case RESET_TYPE:
          reset();
          break;
        case CHECK_TYPE:
          checkWord();
          break;
        case HELP_TYPE:
          help();
          break;
      }
      if (btnAction !== "") {
        dispatch(setBtnAction(""))
      }
    }
  }, [btnAction])

  useEffect(() => {
    if (ex) {
      const data = ex[lessonType]
      setCorrectWord(data.buttons.correctValue);

      setLabel(data.label.value);

      setMascotData({
        ...mascotData,
        mascot: mascot === YUTU_MASCOT ? YUTU.wait : GIRAFFE.wait
      })
      setHelpText(data.title.value);

      setMascotText(data.text.value)
      if (exerciseDone) {
        const size = data.buttons.correctValue.length;
        let rightValues = data.buttons.correctValue;
        const arr = data.buttons.values.slice();
        const chosenArr = [];
        const currentArr = [];
        for (let i = 0; i < size; i++) {
          chosenArr.push(null);
        }
        arr.forEach((val, index) => {
          const i = rightValues.indexOf(val);
          rightValues = rightValues.split("")
          rightValues[i] = "_"
          rightValues = rightValues.join("")
          if (i >= 0) {
            currentArr.push({
              id: index,
              value: val,
              show: false
            })
            chosenArr[i] = {
              id: index,
              value: val,
              show: true
            }
          } else {
            currentArr.push({
              id: index,
              value: val,
              show: true
            })
          }
        })
        setChossenLetters(chosenArr);
        setCurrentLetters(currentArr);
        setBtnType(SUCCESS);
      } else {
        zeroingLetters();
        shuffleLetters();
      }
    }
  }, [ex])

  const shuffleLetters = () => {

    let arr = ex[lessonType].buttons.values.slice();

    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    arr = arr.map((value, index) => {
      return {
        id: index,
        value: value,
        show: true
      }
    })
    setCurrentLetters(arr);
  }

  const shuffleCurrentLetters = buttons => {
    const currentIds = buttons.map(btn => {
      return btn.id
    });
    let arr = currentIds.slice();
    let verified = false;
    while (!verified) {
      arr = shuffleId(arr);
      verified = checkShuffle(arr, currentIds)
    }
    arr = arr.map(id => {
      const letter = buttons.find(btn => btn.id === id);
      letter.show = true;
      return letter
    });
    setCurrentLetters(arr);
  }

  const zeroingLetters = () => {
    const size = ex[lessonType].buttons.values.length;
    const arr = [];

    for (let index = 0; index < size; index++) {
      arr.push(null);
    }
    setChossenLetters(arr);
  }

  const addWord = index => {
    if (currentLetters[index].show) {
      const letter = {}
      for (let key in currentLetters[index]) {
        letter[key] = currentLetters[index][key];
      }

      const arr = chossenLetters.slice();
      arr.push(letter)

      setChossenLetters(arr);
      currentLetters[index].show = false
      EventBus.$emit(S.play, { name: S.click })
      if (arr.filter(letter => letter != null).length > 0 && !exerciseDone) {
        dispatch(setLessonCheck(true))
      } else {
        dispatch(setLessonCheck(false))
      }
    }
  }

  const checkWord = () => {
    const arr = chossenLetters.map(letter => letter ? letter.value : "")
    const word = arr.filter(item => item !== "").join(" ")
    if (word.length > 0) {
      if (word === correctWord) {
        setBtnType(SUCCESS);
        setBtnDis(true);
        dispatch(setConfetti(true));
        lessonCompletion();
        dispatch(setLessonCheck(false));
        EventBus.$emit(S.play, { name: S.win })
        setMascotWin()
      } else {
        setBtnType(ERROR);
        setBtnDis(true);
        const key = mascot === YUTU_MASCOT ? YUTU_MASCOT : GIRAFFE_MASCOT;
        EventBus.$emit(S.play, { name: MS[key].smallFalse, callback: setMascotDataDefault });
        setMascotError()
      }
    }
  }

  const setMascotWin = () => {
    setMascotData({
      mascot: mascot === YUTU_MASCOT ? YUTU.did : GIRAFFE.did,
      autoPlayMascot: true,
      loop: true,
      win: true,
      onAnimationFinish: () => { }
    })
  }

  const setMascotError = () => {
    setMascotData({
      mascot: mascot === YUTU_MASCOT ? YUTU.error : GIRAFFE.error,
      autoPlayMascot: true,
      loop: false,
      onAnimationFinish: setMascotDataDefault
    })
  }

  const setMascotDataDefault = () => {
    setBtnDis(false)
    setBtnType(CHOOSEN)
    if (currentId === ex.id) {
      setMascotData({
        mascot: mascot === YUTU_MASCOT ? YUTU.wait : GIRAFFE.wait,
        autoPlayMascot: true,
        loop: true,
        onAnimationFinish: () => { }
      })
    }
  }

  const deleteLetter = index => {
    let arr = chossenLetters.slice()
    let letterID = arr[index].id
    if (letterID !== null) {
      arr[index] = null;
      setChossenLetters(arr)
      onLessonReset();
      setBtnType(CHOOSEN);
      dispatch(setLessonCheck(true))
      if (arr.filter(letter => letter != null).length == 0 && !exerciseDone) {
        dispatch(setLessonCheck(false))
      }
      currentLetters.map(letter => {
        if (letter.id === letterID) {
          letter.show = true
        }
        return letter
      })
    }
  }

  const reset = () => {
    dispatch(setLessonNext(false))
    dispatch(setLessonCheck(false))
    shuffleCurrentLetters(currentLetters);
    zeroingLetters();
    // setDone(false);
    dispatch(setConfetti(false));
    // dispatch(setLose(false));
    setMascotDataDefault();
    onLessonReset();
  }

  const help = () => {
    setShowHelpWindow(true);
    showModal(helpText)
  }

  return (
    <div className="quizSentence" style={baseViewSize}>
      <div className="pageRow">
        <MascotWithText
          show={true}
          start={currentId === ex.id}
          text={mascotText}
          soundShow={false}
          mascotData={mascotData.mascot ? mascotData.mascot : {}}
          autoPlayMascot={mascotData.autoPlayMascot}
          onAnimationFinish={mascotData.onAnimationFinish}
          loop={mascotData.loop}
          win={mascotData.win}
          fontScale={fontScale}
          mascot={mascot}
        />

        {/*  */}
        <div
          ref={areaRef}
          className="areaGroup"
        >
          <div className="delimiter" style={{ marginTop: -2 * btnSizeCoef }} />
          <div className="delimiter" style={{ marginTop: 59 * btnSizeCoef }} />
          <div className="delimiter" style={{ marginTop: 120 * btnSizeCoef }} />
          {
            chossenLetters.map((letter, index) => {
              return (
                <div key={"area_group_" + index} >
                  {
                    letter &&
                    <div key={"area_" + index}
                      className="area"
                      style={{
                        height: btnSize * btnSizeCoef + btnAreaPadding * btnSizeCoef,
                        borderRadius: btnBorderRadius + btnAreaPadding * btnSizeCoef / 2
                      }}
                    >
                      <YutuButton
                        text={letter.value}
                        btnState={btnType}
                        onClick={() => {
                          deleteLetter(index);
                          EventBus.$emit(S.play, { name: S.click })
                        }}
                        isWord={true}
                      // disabled={btnDis}
                      />
                    </div>
                  }
                </div>
              )
            })
          }
        </div>
      </div>

      <div style={styles.pageRow}>
        <AnimateButtonsPanel
          show={currentId === ex.id}
          onClick={addWord}
          buttons={currentLetters}
          isWord={true}
          align={"flex-start"}
        />
      </div>
    </div>
  );
}

export default QuizSentenceTemplate;

const styles = {
  page: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16
  },
  pageRow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: "relative",
    width: '100%'
  },
  areaGroup: {
    flex: 0,
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginBottom: 32,
    paddingHorizontal: 16,
    position: "relative",
    marginTop: 12,
    //backgroundColor: "green",
  },
  btnGroup: {
    flex: 0,
    flexDirection: "row",
    flexWrap: 'wrap',
    // paddingHorizontal: 16,
    justifyContent: "center",
  },
  btn: {
    marginHorizontal: 4,
    marginBottom: 4,
  },
  emptyBtn: {
    backgroundColor: "#EAEFFC",
  },
  area: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    marginBottom: 8
  },
  text: {
    position: "relative",
    color: TEXT.color,
    fontWeight: "500",
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 4,
  },
  delimiter: {
    position: "absolute",
    top: 0,
    left: 16,
    borderTopColor: "#D2DAE1",
    borderTopWidth: 1,
    width: "100%",
    height: 1
  },
  colorBtn: {
    width: "100%",
    backgroundColor: "#7480FF",
    borderRadius: 40,
    textAlign: "center",
    paddingVertical: 16,
    marginHorizontal: 16,
  },
  colorBtnText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500"
  },
  helpWindow: {
    borderRadius: 32,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  helpWindowBody: {
    paddingVertical: 0
  },
  helpWindowContent: {
    color: '#121C42',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: "400",
    paddingBottom: 24
  },
  swipeDown: {
    backgroundColor: "#F0F2F6",
    borderRadius: 100,
    width: 67,
    height: 5,
    alignSelf: "center",
    marginBottom: 16
  }
}