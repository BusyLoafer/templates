import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { SOUNDS as S, MAKE_WORD, RESET_TYPE, TYPE_WEIGHT, EX_CONTENT_TYPE } from '../../lib/const';
import { generateImageStyle } from "../../lib/StyleGenerator";
import SimpleLetterSvg from "../../components/svg/SimpleLetterSvg";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../../lib/config";
import { shuffleId } from "../../lib/utils";
import { setBtnAction, setLessonReset } from "../../store/actions";
import { resetStates, setFullWin } from "../../lib/yutuManager";
import { onLessonReset } from "../../components/MainComponent/Manager";
import { EventBus } from "../../lib/EventBus";
import SimpleImage from "../../components/Images/SimpleImage";
import SimpleText from "../../components/Text/SimpleText";
import TextSvg from "../../components/svg/TextSvg";
import DragBox from "../../components/Animations/DragBox";
import "./style.scss"

const { basePositions, colors, rotations } = MAKE_WORD;
const lessonType = EX_CONTENT_TYPE.makeWord;

const MAX_FONT_SIZE = 80;

const WordOrderTemplate = props => {

  const {
    ex,
    exerciseDone,
  } = props;

  const dispatch = useDispatch();

  const wordBox = useRef(null);
  const textRef = useRef(null);
  const mainViewRef = useRef(null);
  const checkId = useRef(0);
  const letters = useRef([]);
  const word = useRef("");
  const positions = useRef([]);
  const startLesson = useRef(false);

  const coef = useSelector(state => state.baseCoef);
  const currentId = useSelector(state => state.currentId);
  const coefMax = useSelector(state => state.coefMax);
  const baseViewSize = useSelector(state => state.baseViewSize);
  const btnAction = useSelector(state => state.btnAction);
  const mascotSettings = useSelector(state => state.mascotSettings);

  const [image, setImage] = useState(null);
  const [box, setBox] = useState(null);
  const [imageStyle, setImageStyle] = useState(null);
  const [start, setStart] = useState(false);
  const [letterId, setLetterId] = useState(-1);
  const [check, setCheck] = useState(false);
  const [poses, setPoses] = useState([]);
  const [fontSize, setFontSize] = useState(40);
  const [scale, setScale] = useState(null);
  const [sound, setSound] = useState(false);
  const [baseLetters, setBaseLetters] = useState([]);
  const [checkIndex, setCheckIndex] = useState(0)


  useEffect(() => {
    if (ex) {
      const data = ex[lessonType]
      if (data.letters && data.letters.values) {
        const arr = [];
        data.letters.values.forEach((letter, index) => {
          arr.push({
            value: letter,
            id: index,
            show: !exerciseDone,
          })
        })
        letters.current = arr
        setBaseLetters(arr)
      }
      if (data.picture && data.picture.fileUrl) {
        setImage(data.picture.fileUrl)
        const curCoef = data.picture.width && data.picture.width < data.picture.height ? coefMax : coef;
        setImageStyle(generateImageStyle(data.picture, curCoef, false, false));
      }
      if (data.word) {
        word.current = data.word.text;
        setSound(!!data.word.correctAudio)
      }
    }
  }, [ex]);

  useEffect(() => {
    setTimeout(() => {
      measureView();
    }, 100)
  }, [])


  useEffect(() => {
    if (scale && positions.current.length > 0 && !startLesson.current && ex.id === currentId) {
      let arr = basePositions.map(pos => {
        return {
          x: pos.x * scale.x,
          y: pos.y * scale.y
        }
      })
      arr = shuffleId(arr)
      setTimeout(() => {
        positions.current = arr
        setPoses(arr)
      }, 20)
      startLesson.current = true
    }
  }, [scale, currentId]);

  useEffect(() => {
    if (ex.id === currentId) {
      switch (btnAction) {
        case RESET_TYPE:
          reset();
          break;
      }
      if (btnAction !== "") {
        dispatch(setBtnAction(""))
      }
    }
  }, [btnAction])

  const measureView = () => {
    const { offsetLeft, offsetTop, clientWidth, clientHeight } = textRef.current
    const { size } = mascotSettings
    let wCoef = (size.width - 20) / clientWidth;
    let fSize = fontSize * wCoef;
    if (fSize > MAX_FONT_SIZE) {
      fSize = MAX_FONT_SIZE;
      wCoef = fSize / fontSize;
    }
    setFontSize(fSize);

    
    const newScale = {
      x: size.width / DEFAULT_WIDTH,
      y: size.height / DEFAULT_HEIGHT,
    }
    setScale(newScale)

    const box = {};

    const center = {
      x: offsetLeft + clientWidth * 0.5,
      y: offsetTop + clientHeight * 0.5
    }
    positions.current = basePositions.map(_ => ({x: center.x - 40, y: center.y - 40}))

    box.y = offsetTop;
    box.x = center.x - clientWidth * wCoef * 0.5;
    box.w = clientWidth * wCoef;
    box.h = clientHeight * wCoef;
    box.y2 = box.y + box.h;
    box.x2 = box.x + box.w;

    box.h = clientHeight;
    wordBox.current = box;
    setBox(box);
    setStart(true);
  }

  const checkPosition = (pos, id, paste) => {
    const pageX = pos.x;
    const pageY = pos.y;
    const box = wordBox.current
    let checkPos = false;

    if (pageY > box.y
      && pageY < box.y2
      && pageX > box.x
      && pageX < box.x2) {
      checkPos = true;
      setCheck(true);
    } else {
      setCheck(false);
    }
    if (paste) {
      const value = letters.current.filter(letter => letter.id === id)[0].value;
      if (checkPos && value.toUpperCase() === word.current[checkId.current].toUpperCase()) {
        setCheck(false);
        nextLetter(id);
        dispatch(setLessonReset(true))
        EventBus.$emit(S.play, { name: S.right })
      } else {
        setCheck(false);
        EventBus.$emit(S.play, { name: S.fail })
      }
    }
  }

  const nextLetter = id => {
    letters.current = letters.current.map(letter => {
      if (letter.id === id) {
        return {
          id: letter.id,
          value: letter.value,
          show: false
        }
      }
      return letter
    })
    setBaseLetters(letters.current)
    checkId.current++;
    if (['.', ','].includes(word.current[checkId.current])) checkId.current++;
    setCheckIndex(checkId.current)
    if (checkId.current >= word.current.length) {
      EventBus.$emit(S.play, { name: S.win, silence: sound })
      setFullWin();
    }
  }

  const reset = () => {
    resetStates(["NRWC"]);
    onLessonReset();
    checkId.current = 0;
    setCheckIndex(checkId.current)
    letters.current = letters.current.map(letter => {
      return {
        id: letter.id,
        value: letter.value,
        show: true
      }
    })
    setBaseLetters(letters.current)
  }


  return <div
    ref={mainViewRef}
    className="wordOrderTemplate"
    style={baseViewSize}
  >
    <SimpleImage
      show={!!image}
      image={image}
      resizeMode={"contain"}
      style={Object.assign({ marginBottom: 16 }, imageStyle)}
    />

    <div
      ref={textRef}
    >
      <SimpleText
        show={!box}
        text={word.current}
        fontSize={fontSize}
        fontFamily={TYPE_WEIGHT.middle}
      />
    </div>

    {
      box &&
      <TextSvg
        box={box}
        word={word.current.split("")}
        checkId={exerciseDone ? 20 : checkIndex}
        check={check}
        fontSize={fontSize * coef}
      />
    }

    <div>
      {
        ex.id === currentId && poses.length > 0 && baseLetters.map((letter, index) => {
          if (!letter.show || ['.', ','].includes(letter.value)) {
            return null
          }
          const pos = poses[index];
          return (
            <DragBox
              show={letter.show}
              x={pos.x}
              y={pos.y}
              onMouseDown={() => {
                setLetterId(index);
              }}
              onMouseMove={(pos) => {
                checkPosition(pos, letter.id)
              }}
              onMouseUp={(pos) => {
                setLetterId(-1);
                checkPosition(pos, letter.id, true)
              }}
              key={index}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  zIndex: 10
                }}
              >
                <SimpleLetterSvg
                  letter={letter.value}
                  fill={colors[index]}
                  stroke={"white"}
                  box={{ x: 80, y: 80 }}
                  fontSize={70}
                  rotate={letterId !== index ? rotations[index] : "0"}
                />
              </div>
            </DragBox>
          );
        })
      }
    </div>

  </div>;
};

export default WordOrderTemplate;
