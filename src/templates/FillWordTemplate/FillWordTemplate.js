import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { SOUNDS as S, RESET_TYPE, EX_CONTENT_TYPE, TYPE_WEIGHT } from '../../lib/const';
import { setBtnAction, setLessonReset } from '../../store/actions';
import { resetStates, setFullWin } from "../../lib/yutuManager";
import { EventBus } from "../../lib/EventBus";
import { onLessonReset } from "../../components/MainComponent/Manager";
import SimpleText from "../../components/Text/SimpleText";
import "./style.scss"
const lessonType = EX_CONTENT_TYPE.fillwords;

const baseColors = [
  "#57ADFD",
  "#69C9D6",
  "#7480FF",
  "#77C801",
  "#6F4DB8",
  "#EC5569"
]

const FillWordTemplate = props => {

  // ? props
  const {
    ex,
    exerciseDone,
  } = props;

  // ? refs
  const selectedRef = useRef([]);
  const coordinates = useRef([]);
  const root = useRef(document.getElementById("app")).current;

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const currentId = useSelector(state => state.currentId);
  const btnAction = useSelector(state => state.btnAction);
  const dispatch = useDispatch();

  // ? state
  const [letters, setLetters] = useState([]);
  const [allLetters, setAllLetters] = useState([])
  const [selected, setSelected] = useState([]);
  const [checkedLetters, setCheckedLetters] = useState([]);
  const [letterColor, setLetterColor] = useState({});
  const [color, setColor] = useState(baseColors[0]);
  const [colors, setColors] = useState(baseColors);
  const [findedWords, setFindedWords] = useState([])

  // ? effects
  useEffect(() => {
    if (ex) {
      const data = ex[lessonType];
      const lettersArr = [];
      const newAllLetters = [];
      let allwords = [];
      data.words.forEach(word => {
        word.coordinates.forEach((coor, i) => {
          allwords[coor[0] * data.tableSize + coor[1]] = word.value[i];
        })
      })
      for (let i = 0; i < data.tableSize; i++) {
        const tempArr = [];
        for (let j = 0; j < data.tableSize; j++) {
          const index = i * data.tableSize + j;
          if (allwords[index]) {
            const newLetter = {
              id: index,
              value: allwords[index]
            }
            tempArr.push(newLetter)
            newAllLetters.push(newLetter)
          }
        }
        lettersArr.push(tempArr);
      }
      setLetters(lettersArr)
      setAllLetters(newAllLetters)
      if (exerciseDone) {
        const ob = {}
        data.words.forEach((word, wIndex) => {
          word.coordinates.forEach((coor, i) => {
            ob[coor[0] * data.tableSize + coor[1]] = baseColors[wIndex];
          })
        })
        setLetterColor(ob)
      }
    }
    changeColor()
  }, [ex])

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

  useEffect(() => {
    if (findedWords.length > 0) {
      if (findedWords.length === ex[lessonType].words.length) {
        win();
      } else {
        dispatch(setLessonReset(true));
      }
    }
  }, [findedWords])

  const win = () => {
    EventBus.$emit(S.play, { name: S.win });
    setFullWin();
  }

  const changeColor = (arr = [], currentColor = null) => {
    if (arr.length === 0) {
      arr = baseColors.slice();
    }
    if (!currentColor) {
      currentColor = arr[0]
    }
    const index = arr.indexOf(currentColor);
    if (index >= 0) {
      arr.splice(index, 1)
    }
    currentColor = arr[Math.floor(Math.random() * arr.length)];
    setColor(currentColor);
    setColors(arr);
  }

  const _setSelected = value => {
    setSelected(value);
    selectedRef.current = value;
  }

  const wordStart = ({ offsetX, offsetY }) => {
    root.addEventListener("mouseup", checkWord);
    const { id, dx, dy } = findIds(offsetX, offsetY)
    if (!letterColor[id]) {
      coordinates.current.push({ x: dx, y: dy })
      _setSelected([id])
    }
  }

  const findIds = (x, y) => {
    const dx = Math.floor(x / (80 * coef))
    const dy = Math.floor(y / (80 * coef))
    let id = dy * ex[lessonType].tableSize + dx;
    if (dx < 0 || dy < 0 || dx >= ex[lessonType].tableSize || dy >= ex[lessonType].tableSize) id = -1
    return { id, dx, dy }
  }

  const checkWord = () => {
    root.removeEventListener("mouseup", checkWord);
    const ids = selectedRef.current.slice();
    const currenWord = selectedRef.current.map(id => allLetters[id].value).join("");
    let findedWord = ex[lessonType].words.find(word => word.value === currenWord);

    if (findedWord) {
      findedWord.coordinates.forEach((coor, index) => {
        if (coor[0] * ex[lessonType].tableSize + coor[1] !== ids[index]) {
          findedWord = null
        }
      })
    }

    if (findedWord) {
      EventBus.$emit(S.play, { name: S.flip.right })
      setCheckedLetters(oldLetters => {
        const newLetters = oldLetters.slice()
        ids.forEach(id => newLetters.push(id));
        return newLetters
      })
      setLetterColor(old => {
        ids.forEach(id => {
          old[id] = color
        });
        return old;
      })
      setFindedWords(old => {
        const newWords = old.slice()
        newWords.push(findedWord.value)
        return newWords
      })
      changeColor(colors, color);
    } else if (ids.length > 0) {
      EventBus.$emit(S.play, { name: S.fail })
    }
    cleanLetters();
  }


  const cleanLetters = () => {
    _setSelected([]);
    coordinates.current = [];
  }

  const checkNeighbor = (id, lastId) => {
    const size = ex[lessonType].tableSize;
    const y = Math.floor(id / size);
    const x = id - y * size;
    const lastY = Math.floor(lastId / size);
    const deltaY = Math.abs(lastY - y);
    const deltaX = Math.abs(lastId - lastY * size - x);

    return (deltaY === 1 ^ deltaX === 1)
      && deltaY <= 1 && deltaX <= 1;
  }

  const checkLetter = ({ offsetX, offsetY }) => {
    const { id, dx, dy } = findIds(offsetX, offsetY)
    if (id === -1) return
    if (letterColor[id]) return

    const last = selectedRef.current[selectedRef.current.length - 1]
    if (last === id) return

    const index = selectedRef.current.indexOf(id)
    let newIds = selectedRef.current.slice();
    if (index >= 0) {
      coordinates.current = coordinates.current.slice(0, index + 1)
      newIds = newIds.slice(0, index + 1);
    } else {
      if (!checkNeighbor(id, last)) return;
      coordinates.current.push({ x: dx, y: dy })
      newIds.push(id);
    }
    _setSelected(newIds)
  }

  const reset = () => {
    onLessonReset();
    resetStates(["NRWC"]);
    setFindedWords([]);
    setLetterColor({})
    setCheckedLetters([])
    changeColor()
  }


  return <div className="fillwordsTemplate">

    <div
      className="fillwordBox"
      onMouseDown={({ nativeEvent }) => {
        wordStart(nativeEvent)
      }}
      onMouseMove={({ nativeEvent }) => {
        checkLetter(nativeEvent)
      }}
      onMouseUp={() => {
        checkWord();
      }}
    >

      {
        letters.map((line, i) => {
          return (
            <div
              className="line"
              key={i}
            >
              {
                line.map(letter => {
                  return (
                    <div
                      className="letter"
                      style={{
                        width: 72 * coef,
                        height: 72 * coef,
                        margin: 4 * coef,
                        backgroundColor: selected.includes(letter.id) ? color :
                          letterColor[letter.id] ? letterColor[letter.id] : "#E3F8FA",
                      }}
                      key={letter.id}
                    >
                      <SimpleText
                        text={letter.value.toUpperCase()}
                        fontSize={56}
                        fontFamily={TYPE_WEIGHT.big}
                        style={{
                          color: selected.includes(letter.id) || checkedLetters.includes(letter.id) || exerciseDone ? "white" : "#121C42"
                        }}
                      />
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }

    </div>

  </div>;
};

export default FillWordTemplate;
