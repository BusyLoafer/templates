import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PuzzleElement from '../../components/svg/puzzle/PuzzleElement';
import { EX_CONTENT_TYPE, PUZZLE, RESET_TYPE, SOUNDS as S } from '../../lib/const';
import { PATHS } from '../../lib/PuzzlePath';
import { checkShuffle } from '../../lib/utils';
import { setBtnAction, setLessonNext } from '../../store/actions';
import OkSvg from '../../components/svg/OkSvg';
import { setFullLose, setFullWin } from '../../lib/yutuManager';
import { EventBus } from '../../lib/EventBus';
import SimpleImage from '../../components/Images/SimpleImage';
import DragBox from '../../components/Animations/DragBox';
import "./style.scss"

const { baseMinSize, baseMaxSize, imagePadding, partPadding, partSize } = PUZZLE;

const deltaSize = baseMaxSize - baseMinSize;
const lessonType = EX_CONTENT_TYPE.puzzle;


const PuzzleTemplate = props => {

  // ? props
  const {
    ex,
    exerciseDone
  } = props;

  const dispatch = useDispatch();

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const currentId = useSelector(state => state.currentId);
  const btnAction = useSelector(state => state.btnAction);
  const baseViewSize = useSelector(state => state.baseViewSize);

  // ? state
  const [imageSize, setImageSize] = useState({});
  const [coefEl, setCoefEl] = useState(1);
  const [partsCount, setPartsCount] = useState(0);
  const [elWidth, setElWidth] = useState(0);
  const [imagePartsPos, setImagePartsPos] = useState([]);
  const [partIds, setPartIds] = useState([]);
  const [partPos, setPartPos] = useState([]);
  const [imageBox, setImageBox] = useState([]);
  const [parts, setParts] = useState([]);

  // ? refs
  const pparts = useRef([]).current;

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
    if (ex) {
      const data = ex[lessonType];
      calculateImageSize(data);
    }
  }, [ex]);

  useEffect(() => {
    if (currentId === ex.id) {
      getImageBox()
    }
  }, [currentId])

  useEffect(() => {
    if (currentId === ex.id) {
      dispatch(setLessonNext(exerciseDone))
    }
  }, [currentId, exerciseDone])

  useEffect(() => {
    if (partsCount > 0) {
      generateImagePartsPos();
      generateParts(ex[lessonType]);
    }
  }, [coefEl, partsCount]);

  useEffect(() => {
    if (partsCount > 0) {
      generatePartsPos();
    }
  }, [partsCount])

  useEffect(() => {
    if (imagePartsPos && imagePartsPos.length > 0 && !exerciseDone) {
      checkFullImage()
    }
  }, [imagePartsPos]);

  const getImageBox = () => {
    if (partsCount > 0) {
      const x = partsCount * 0.5;
      const wDelta = imageSize.width / x;
      const hDelta = imageSize.height * 0.5;
      const px = (baseViewSize.width - imageSize.width) * 0.5
      const py = (baseViewSize.height - imageSize.height) * 0.5
      const arr = [];
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < x; j++) {
          arr.push({
            x1: px + j * wDelta,
            y1: py + i * hDelta,
            x2: px + (j + 1) * wDelta,
            y2: py + (i + 1) * hDelta
          })
        }
      }
      setImageBox(arr)
    }
  }

  const generateImagePartsPos = () => {
    const opacity = exerciseDone !== undefined ? 1 - exerciseDone : 1
    const basePos = [
      { opacity: opacity },
      { left: elWidth, opacity: opacity },
      { left: elWidth * 2, opacity: opacity },
      { top: elWidth - deltaSize * coefEl, opacity: opacity },
      { top: elWidth, left: elWidth - deltaSize * coefEl, opacity: opacity },
      { top: elWidth, left: elWidth * 2 - deltaSize * coefEl, opacity: opacity },
    ]

    let newPos = []

    if (partsCount === 4) {
      basePos.forEach((pos, index) => {
        if ([0, 1, 3, 4].includes(index)) {
          newPos.push(pos)
        }
      })
    } else {
      newPos = basePos.slice();
    }
    setImagePartsPos(newPos);
  }

  const generatePartsPos = () => {
    const x = partsCount === 4 ? 0.5 : 1
    const deltaX = (partSize + partPadding) * x
    const deltaY = imageSize.height * 0.5 + imagePadding + partSize / 2.5
    const arr = []
    for (let i = 0; i < 3; i += 2) {
      for (let j = -1; j < 2; j++) {
        if (partsCount !== 4 || j !== 0) {
          arr.push({
            x: baseViewSize.width * 0.5 + j * deltaX - partSize * 0.5,
            y: baseViewSize.height * 0.5 + (1 - i) * deltaY - partSize * 0.5
          })
        }
      }
    }
    setPartPos(arr)
  }

  const generateParts = data => {
    if (data.puzzle && data.puzzle.parts) {
      const opacity = exerciseDone ? 0 : 1;
      let parts = data.puzzle.parts.map((part, index) => {
        let id = index;
        if (partsCount === 4) {
          switch (index) {
            case 1:
            case 2:
              id += 1;
              break
            case 3:
              id += 2;
              break
          }
        }

        return {
          id: id,
          uri: part,
          opacity: opacity,
        }

      })
      const partIds = parts.map(part => part.id)
      setPartIds(partIds);
      parts = shufflePuzzle(parts);
      pparts.current = parts;
      setParts(parts)
    }
  }

  const calculateImageSize = (data) => {
    const { partsNumber } = data.puzzle;
    const width = baseViewSize.width - imagePadding * 2 * coef;
    const widthEl = width / (partsNumber / 2);
    const height = widthEl * 2;
    const coef2 = widthEl / baseMinSize;

    setElWidth(widthEl);
    setPartsCount(partsNumber);
    setImageSize({ width: width, height: height });
    setCoefEl(coef2 * 1.005);
  }

  const checkPosition = (pos, id) => {
    const index = partIds.indexOf(id)
    const checkPos = imageBox[index]
    if (checkPos.x1 < pos.x &&
      checkPos.x2 > pos.x &&
      checkPos.y1 < pos.y &&
      checkPos.y2 > pos.y) {
      changePuzzle(index, id)
    } else {
      EventBus.$emit(S.play, { name: S.fail })
    }
  }

  const checkFullImage = () => {
    let check = true;
    imagePartsPos.forEach((pos) => {
      if (pos.opacity) {
        check = false;
      }
    })
    if (check) {
      EventBus.$emit(S.play, { name: S.win })
      EventBus.$emit("stopTSound");
      setFullWin();
    }
  }
  const changePuzzle = (index, id) => {
    const newParts = pparts.current.slice();
    const partIndex = newParts.findIndex(nPart => nPart.id === id);
    newParts[partIndex].opacity = 0;
    pparts.current = newParts
    setParts(newParts)

    setImagePartsPos(imagePartsPos => {
      const newImagePartsPos = imagePartsPos.map(pos => Object.assign({}, pos))
      newImagePartsPos[index].opacity = 0;
      return newImagePartsPos
    })
    EventBus.$emit(S.play, { name: S.right })
  }

  const reset = () => {
    let newParts = shufflePuzzle(pparts.current.slice());
    newParts.map(part => part.opacity = 1)
    pparts.current = newParts
    setParts(newParts)

    const newImagePartsPos = imagePartsPos.map(pos => {
      const newPos = Object.assign({}, pos);
      newPos.opacity = 1;
      return newPos;
    })
    setImagePartsPos(newImagePartsPos)
    getImageBox();
    setFullLose();
  }

  const shufflePuzzle = (array) => {
    let arr = array.slice()

    let verified = false;
    while (!verified) {
      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      verified = checkShuffle(arr, array)
    }
    return arr;
  }

  return (
    <div
      className='puzzleTemplate'
      style={baseViewSize}
    >

      <div className='imageWrapper'>
        {imageSize.width &&
          <div style={{ width: imageSize.width, height: imageSize.height, position: "relative" }}>
            <div className='imageBox'>
              <SimpleImage
                image={ex[lessonType].puzzle.result}
                resizeMode={"stretch"}
                style={{
                  height: imageSize.height,
                  width: imageSize.width
                }}
              />
              <div
                className='abs partsWrapper'
                style={{
                  height: imageSize.height,
                  width: imageSize.width,
                }}
              >
                {partIds.map((id, index) => {
                  return (
                    <div className='abs' style={imagePartsPos[index]} key={id}>
                      <PuzzleElement coef={coefEl} paths={PATHS[id]} />
                    </div>
                  )
                })}

              </div>
            </div>
            {
              exerciseDone &&
              <div className='okWrapper' >
                <OkSvg />
              </div>
            }
          </div>
        }
      </div>

      {
        parts.map((part, index) => {
          const pos = partPos[index]
          return (
            <DragBox
              show={part.opacity}
              key={index}
              y={pos.y}
              x={pos.x}
              onMouseUp={(newPos) => { checkPosition(newPos, part.id) }}
            >
              <SimpleImage
                image={part.uri}
                style={{
                  height: partSize,
                  width: partSize,
                  pointerEvents: "none"
                }}
              />
            </DragBox>
          )
        })
      }

    </div >
  )
}

export default PuzzleTemplate;