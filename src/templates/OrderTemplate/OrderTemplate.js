import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { EX_CONTENT_TYPE, ORDER, RESET_TYPE, SOUNDS as S } from '../../lib/const';
import { shuffleId } from '../../lib/utils';
import { setBtnAction, setLessonNext, setLessonReset, setLose } from "../../store/actions";
import { resetStates, setFullWin } from '../../lib/yutuManager';
import { EventBus } from '../../lib/EventBus';
import PathOrderSvg from '../../components/svg/PathOrderSvg';
import DragBox from '../../components/Animations/DragBox';
import { lessonCompletion, onLessonReset } from '../../components/MainComponent/Manager';
import SimpleText from '../../components/Text/SimpleText';
import SimpleImage from '../../components/Images/SimpleImage';

import "./style.scss"

const { pathSize, roundSize, imageSize, pathPoints, imagePoints } = ORDER;
const lessonType = EX_CONTENT_TYPE.pictureOrder;

const OrderTemplate = props => {

  // ? props
  const {
    ex,
    exerciseDone
  } = props;

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const viewSize = useSelector(state => state.baseViewSize);
  const btnAction = useSelector(state => state.btnAction);
  const currentId = useSelector(state => state.currentId);
  const lose = useSelector(state => state.lose);

  const dispatch = useDispatch();

  // ? state
  const [done, setDone] = useState(false);
  const [positions, setPositions] = useState([]);
  const [imagePositions, setImagePositions] = useState([]);
  const [imageId, setImageId] = useState(-1);
  const [roundId, setRoundId] = useState(-1);

  // ? refs
  const imagePositionsRef = useRef([]);

  // ? effects
  useEffect(() => {
    if (ex.id === currentId && !lose) {
      reset();
    }
  }, [lose])

  useEffect(() => {
    setPositions(pathPoints.map(pos => {
      return {
        x: pos.x * coef,
        y: pos.y * coef
      }
    }))
  }, []);

  useEffect(() => {
    if (ex) {
      const data = ex[lessonType]
      if (data.images && data.images.values.length) {
        generateImages(exerciseDone);
      }
    }
  }, [ex]);

  useEffect(() => {
    if (currentId === ex.id) {
      if (imagePositions.length === 8) {
        checkWin();
      }
    }
  }, [imagePositions, currentId]);

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

  const generateImages = (right = false) => {
    const randomImages = right ?
      ex[lessonType].images.values.slice() :
      shuffleId(ex[lessonType].images.values.slice());
    _setImagePositions(imagePoints.map((pos, index) => {
      let verification = index % 2 !== 0

      if (right) {
        verification = index % 2 === 0
      }
      return {
        x: pos.x * coef,
        y: pos.y * coef,
        id: pos.id,
        url: verification ? randomImages[pos.id - right * 1] : null,
        check: index % 2 !== 0
      }
    }))
  }

  const _setImagePositions = (value) => {
    setImagePositions(value);
    imagePositionsRef.current = value
  }

  const checkPosition = (newPos, index, paste) => {
    const pos = imagePositionsRef.current[index];

    let posIndex = -1;
    imagePositionsRef.current.forEach((iPos, i) => {
      if ((!pos.check || i % 2 === 0) && posIndex < 0 && index !== i) {
        if (checkLength(newPos, iPos)) {
          posIndex = i;
        }
      }
    })

    if (posIndex >= 0) {
      if (paste) {
        const newImagesPos = imagePositionsRef.current.slice();
        const tempUrl = newImagesPos[posIndex].url;
        newImagesPos[posIndex].url = newImagesPos[index].url
        newImagesPos[index].url = tempUrl
        _setImagePositions(newImagesPos);
        EventBus.$emit(S.play, { name: S.right })
        setRoundId(-1)
      } else {
        setRoundId(posIndex)
      }
    } else {
      setRoundId(-1)
    }
  }

  const checkLength = (point1, point2) => {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)) < roundSize * coef * 0.5;
  }

  const checkWin = () => {
    let check = true;
    let full = true;
    let empty = true;
    for (let i = 0; i < 4; i++) {
      if (!imagePositions[i * 2].url) {
        full = false;
      } else {
        empty = false
      }
      if (imagePositions[i * 2].url !== ex[lessonType].images.values[i]) {
        check = false;
      }
    }
    setTimeout(() => {
      dispatch(setLessonReset(!empty));
    }, 100)
    if (check) {
      setDone(true);
      dispatch(setLessonNext(true))
      if (!exerciseDone) {
        setImagePositions(imagePositions.slice())
        setFullWin()
        lessonCompletion();
        EventBus.$emit(S.play, { name: S.win })
      }
    } else if (full) {
      dispatch(setLose(true))
    }
  }

  const reset = () => {
    onLessonReset();
    resetStates(["win", "confetti", "next", "reset"])
    generateImages();
    setDone(false);
  }

  return (
    <div className='orderTemplate' style={viewSize}>
      <div style={viewSize}>
        {
          positions.map((pos, index) => {
            const color = exerciseDone ? "#77C801" : imagePositions[index * 2] && imagePositions[index * 2].url ? "#7480FF" : "#A1ABCD"
            return (
              <div
                className='abs'
                style={Object.assign(
                  {
                    top: pos.y,
                    left: pos.x,
                  },
                  index % 2 !== 0 ? {
                    transform: "scale(-1, 1)"
                  } : {}
                )}
                key={index}
              >
                <PathOrderSvg
                  color={color}
                  size={{ x: pathSize.x * coef, y: pathSize.y * coef }}
                />
              </div>
            )
          })
        }

        {
          imagePositions.map((pos, index) => {
            if (index % 2 === 0) {
              if (!pos.url) {
                return (
                  <div
                    className={'abs emptyRound ' + (roundId === index ? "emptyRound-active" : "")}
                    style={{
                      top: pos.y - roundSize * coef * 0.5,
                      left: pos.x - roundSize * coef * 0.5,
                      width: roundSize * coef,
                      height: roundSize * coef,
                      borderRadius: 80 * coef,
                    }}
                    key={index}
                  >
                    <div
                      className='number'
                      style={{
                        width: 25 * coef,
                        height: 25 * coef,
                        borderRadius: 8 * coef,
                      }}
                    >
                      <SimpleText text={pos.id} />
                    </div>
                  </div>
                )
              } else {
                if (!exerciseDone) {
                  return (
                    <DragBox
                      x={pos.x - roundSize * coef * 0.5}
                      y={pos.y - roundSize * coef * 0.5}
                      onMouseDown={() => {
                        setImageId(pos.id);
                      }}
                      onMouseMove={pos => {
                        checkPosition(pos, index)
                      }}
                      onMouseUp={pos => {
                        setImageId(-1);
                        checkPosition(pos, index, true)
                      }}
                      key={index}
                    >
                      <div
                      className={"fixImage " + (exerciseDone ? "fixImage-done" : 
                      roundId === index || imagePositions[index * 2] &&
                      imagePositions[index * 2].url ? "fixImage-active" : "")}
                        style={{
                          width: roundSize * coef,
                          height: roundSize * coef,
                          borderRadius: roundSize * coef * 0.5,
                        }}
                      >
                        <SimpleImage
                          image={pos.url}
                          style={{
                            width: roundSize * coef - 2,
                            height: roundSize * coef - 2,
                          }}
                        />
                      </div>
                    </DragBox>
                  )
                } else {
                  return (
                    <div
                    className={'abs fixImage ' + 
                    (roundId === index ? "fixImage-active" : exerciseDone ? "fixImage-done" : "")}
                      style={{
                        left: pos.x - roundSize * coef * 0.5,
                        top: pos.y - roundSize * coef * 0.5,
                        width: roundSize * coef,
                        height: roundSize * coef,
                        borderRadius: roundSize * coef * 0.5,
                      }}
                      key={index}
                    >
                      <SimpleImage
                        style={{
                          width: roundSize * coef,
                          height: roundSize * coef,
                        }}
                        image={pos.url}
                      />
                    </div>
                  )
                }
              }
            } else {
              if (!pos.url) {
                return (
                  <div
                    className='abs emptyPoint'
                    style={{
                      top: pos.y - 8 * coef,
                      left: pos.x - 8 * coef,
                      width: 16 * coef,
                      height: 16 * coef,
                    }}
                    key={index}
                  />
                )
              } else {
                return (
                  <DragBox
                    x={pos.x - imageSize * coef * 0.5}
                    y={pos.y - imageSize * coef * 0.5}
                    onMouseDown={() => {
                      setImageId(pos.id);
                    }}
                    onMouseMove={pos => {
                      checkPosition(pos, index)
                    }}
                    onMouseUp={pos => {
                      setImageId(-1);
                      checkPosition(pos, index, true)
                    }}
                    key={index}
                  >
                    <SimpleImage
                      style={{
                        width: imageSize * coef,
                        height: imageSize * coef,
                      }}
                      image={pos.url}
                    />
                  </DragBox>
                )
              }
            }
          })
        }
      </div>

    </div>
  );
};

export default OrderTemplate;