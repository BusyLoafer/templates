import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {EX_CONTENT_TYPE, RESET_TYPE, SOUNDS as S} from '../../lib/const';
import {shuffleId} from '../../lib/utils';
import {setBtnAction, setLessonNext, setLessonReset, setLose} from "../../store/actions";
import {resetStates, setFullWin, switchOnStates} from '../../lib/yutuManager';
import {EventBus} from '../../lib/EventBus';
import {lessonCompletion, onLessonReset} from '../../components/MainComponent/Manager';
import SimpleImage from '../../components/Images/SimpleImage';
import DragBox from '../../components/Animations/DragBox';
import Question from '../../components/svg/QuestionSvg';

import {motion, useAnimationControls} from "framer-motion";
import "./style.scss"
import SeparatorSvg from "../../components/svg/SeparatorSvg";

const lessonType = EX_CONTENT_TYPE.row;
const bigImageSize = 100;
const centerBig = bigImageSize * 0.5;
const smallImageSize = 60;
const centerSmall = smallImageSize * 0.5;


const RowTemplate = props => {

  // ? props
  const {
    ex,
    exerciseDone,
    onLayout
  } = props;

  // ? refs
  const imagesRef = useRef(null);
  const variantsRef = useRef(null);
  const arr = useRef([3, 2, 1, 0]).current;

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const viewSize = useSelector(state => state.baseViewSize);
  const btnAction = useSelector(state => state.btnAction);
  const currentId = useSelector(state => state.currentId);
  const bug = useSelector(state => state.lose);
  const poses = useSelector(state => state.rowPoses);

  const dispatch = useDispatch();

  const controls = useAnimationControls()

  // ? state
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [varIndex, setVarIndex] = useState(-1);
  const [imageIndex, setImageIndex] = useState(-1);
  const [imageSelectIndex, setImageSelectIndex] = useState(-1);
  const [anim, setAnim] = useState(true);

  // ? Effects
  useEffect(() => {
    if (ex) {
      const data = ex[lessonType];
      generateImages(exerciseDone)
    }
  }, [ex])

  useEffect(() => {
    if (ex.id === currentId && !bug) {
      reset();
    }
  }, [bug])

  useEffect(() => {
    if (ex.id === currentId) {
      controls.start(y => {
        return {
          top: y,
          transition: {duration: 0.5}
        }
      }).then(() => setAnim(false))
    }
  }, [currentId])


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

  // ? functions

  const win = () => {
    EventBus.$emit(S.play, {name: S.win})
    switchOnStates(["NRWC"])
    lessonCompletion();
  }

  const lose = () => {
    resetStates(["next", "reset"])
    dispatch(setLose(true))
  }

  const checkWin = () => {
    if (!exerciseDone && imagesRef.current.length === 4) {
      let check = true;
      let full = true;
      let empty = true;
      imagesRef.current.forEach((im, index) => {
        if (im.uri && ex[lessonType].hiddenItems.includes(index)) {
          empty = false;
        }
        if (!im.uri) {
          check = false;
          full = false;
        } else if (im.id !== index) {
          check = false;
        }
      })
      setTimeout(() => {
        dispatch(setLessonReset(!empty))
      }, 100);
      if (full) {
        if (check) {
          win()
        } else {
          lose()
        }
      }
    }
  }

  const generateImages = (right = false) => {
    const data = ex[lessonType];
    const newImages = [];
    const newVariants = [];

    data.images.values.forEach((val, index) => {
      if (!data.hiddenItems.includes(index) || right) {
        newImages.push({
          uri: val,
          id: index
        })
      } else {
        newImages.push({
          uri: null,
          id: -1
        })
        newVariants.push({
          uri: val,
          id: index,
        })
      }
    })

    data.images.other.forEach(val => {
      if (val.length) {
        newVariants.push({
          uri: val,
          id: -1,
        })
      }
    })
    if (right) {
      data.hiddenItems.forEach(val => {
        if (val.length) {
          newVariants.push({
            uri: null,
            id: -1,
          })
        }
      })
    }
    _setImages(newImages);
    _setVariants(shuffleId(newVariants))
  }

  const _setImages = value => {
    imagesRef.current = value
    checkWin()
    setImages(value);
  }

  const _setVariants = value => {
    variantsRef.current = value;
    setVariants(value)
  }

  const checkLength = (point1, point2, len) => {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)) < len;
  }

  const checkPosition = (newPos, pos, big, imIndex = -1) => {

    // const { locationX, locationY } = e.nativeEvent;
    // const delta = big ? params.centerBig : dragPoints.centerSmall;

    // const point = {
    //   x: pos.x + pan.x._value + locationX - delta,
    //   y: pos.y + pan.y._value + locationY - delta
    // }

    let bigIndex = -1
    let check = false;
    poses.lines.forEach((imPos, index) => {
      // console.log(newPos, imPos)
      if (!check && ex[lessonType].hiddenItems.includes(index) && checkLength(imPos, newPos, poses.bigImageSize * 0.5)) {
        check = true;
        bigIndex = index
      }
    })

    if (check) {
      if (imIndex >= 0) {
        changeImage(imIndex, bigIndex, big && check)
        setImageIndex(-1)
      } else {
        setImageIndex(bigIndex)
      }
    } else {
      if (big && newPos.x > poses.ose && imIndex >= 0) {
        deleteImage(imIndex)
      }
      setImageIndex(-1)
    }
  }

  const deleteImage = from => {
    const to = variantsRef.current.findIndex(im => im.uri === null)
    if (to >= 0) {
      changeImage(to, from)
    }
  }

  const changeImage = (from, to, b2b = false) => {
    const tempData = Object.assign({}, b2b ? imagesRef.current[from] : variantsRef.current[from]);

    if (b2b) {
      if (from !== to) {
        const newImages = imagesRef.current.slice();
        newImages[from].id = newImages[to].id
        newImages[from].uri = newImages[to].uri
        newImages[to].id = tempData.id
        newImages[to].uri = tempData.uri
        _setImages(newImages);
      }
    } else {

      const newVariants = variantsRef.current.map((im, i) => {
        if (i === from) return {
          uri: imagesRef.current[to].uri,
          id: imagesRef.current[to].id
        }
        return im
      })

      const newImages = imagesRef.current.map((im, i) => {
        if (i === to) return {
          uri: tempData.uri,
          id: tempData.id,
        }
        return im
      })

      _setVariants(newVariants)
      _setImages(newImages);
    }
    if (exerciseDone) {
      onLessonReset();
    }
  }

  const reset = () => {
    onLessonReset();
    generateImages();
    resetStates(["NRWC"]);
  }

  const color = (i) => {
    let color = "#DBEDFF";
    if (imageIndex === i && imageSelectIndex !== i) {
      color = "#7480FF"
    } else {
      color = exerciseDone ? "#77C801" : bug ? "#EC5569" : color;
    }
    return color
  }

  return (
    <div className='rowTemplate'>
      <div style={viewSize}>

        {
          poses && poses.separators.map((pos, i) => (
            <motion.div
              style={{
                position: "absolute",
                left: pos.x,
                top: anim ? poses.separators[0].y - 40 : pos.y,
              }}
              animate={controls}
              custom={pos.y}
              key={i}
            >
              <SeparatorSvg
                size={{x: poses.separatorSize.x, y: poses.separatorSize.y}}
                color={exerciseDone ? "#77C801" : bug ? "#EC5569" : "#DBEDFF"}
              />
            </motion.div>
          ))
        }

        {
          poses && images.length && arr.map((i) => {
            const im = images[i];
            const pos = poses.left[i]
            if (im.uri) {
              if (!ex[lessonType].hiddenItems.includes(i)) {
                return (
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: poses.bigImageSize,
                      height: poses.bigImageSize,
                      backgroundColor: exerciseDone ? "#77C801" : bug ? "#EC5569" : "#DBEDFF",
                      borderRadius: 24 * coef,
                      position: "absolute",
                      left: pos.x,
                      top: anim ? poses.left[0].y : pos.y,
                      zIndex: 20 - i
                    }}
                    animate={controls}
                    custom={pos.y}
                    key={i}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        borderRadius: 16 * coef,
                        width: poses.bigImageSize - 16 * coef,
                        height: poses.bigImageSize - 16 * coef,
                      }}
                    >
                      <SimpleImage
                        image={im.uri}
                        style={{
                          objectFit: "contain",
                          width: poses.bigImage,
                          height: poses.bigImage
                        }}
                      />
                    </div>
                  </motion.div>
                )
              } else {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: poses.bigImageSize,
                      height: poses.bigImageSize,
                      backgroundColor: exerciseDone ? "#77C801" : bug ? "#EC5569" : "#DBEDFF",
                      borderRadius: 24 * coef,
                      position: "absolute",
                      left: pos.x,
                      top: pos.y,
                    }}
                    key={i}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        borderRadius: 16 * coef,
                        width: poses.bigImageSize - 16 * coef,
                        height: poses.bigImageSize - 16 * coef,
                      }}
                    >
                      <DragBox
                        x={8 * coef}
                        y={8 * coef}
                        onMouseDown={() => {
                          setImageSelectIndex(i);
                        }}
                        onMouseMove={pos => {
                          const point = {
                            x: pos.x + poses.left[i].x,
                            y: pos.y + poses.left[i].y
                          }
                          checkPosition(point, poses.left[i], true)
                        }}
                        onMouseUp={pos => {
                          setImageSelectIndex(-1);
                          const point = {
                            x: pos.x + poses.left[i].x,
                            y: pos.y + poses.left[i].y
                          }
                          checkPosition(point, poses.left[i], true, i);
                        }}
                        key={i}
                      >
                        <SimpleImage
                          image={im.uri}
                          style={{
                            width: poses.bigImage,
                            height: poses.bigImage,
                          }}
                        />
                      </DragBox>
                    </div>
                  </div>
                )
              }
            } else {
              return (
                <motion.div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: poses.bigImageSize,
                    height: poses.bigImageSize,
                    backgroundColor: color(i),
                    borderRadius: 24 * coef,
                    position: "absolute",
                    left: pos.x,
                    top: anim ? poses.left[0].y : pos.y,
                    zIndex: 20 - i
                  }}
                  animate={controls}
                  custom={pos.y}
                  key={i}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                      borderRadius: 16 * coef,
                      width: poses.bigImageSize - 16 * coef,
                      height: poses.bigImageSize - 16 * coef,
                    }}
                  >
                    <Question
                      size={{x: 40 * coef, y: 40 * coef}}
                      fill="#57ADFD"
                    />
                  </div>
                </motion.div>
              )
            }
          })
        }

        {
          variants.map((_, index) => {
            const count = variants.length;
            const variant = variants[count - index - 1]
            const i = count - index - 1
            const size = varIndex === i ? 162 * coef : poses.smallImageSize;
            if (!variant.uri) {
              return (
                <div
                  style={{
                    width: size,
                    height: size,
                    position: "absolute",
                    left: poses.right[count][i].x,
                    top: poses.right[count][i].y,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex"
                  }}
                  key={i}
                >
                  <div
                    style={{
                      width: 16 * coef,
                      height: 16 * coef,
                      borderRadius: 16,
                      backgroundColor: "#A1ABCD"
                    }}
                  />
                </div>
              )
            }
            return (
              <motion.div
                style={{
                  position: "absolute",
                  left: poses.right[count][i].x,
                  top: anim ? poses.right[count][0].y : poses.right[count][i].y
                }}
                animate={controls}
                custom={poses.right[count][i].y}
                key={i}
              >
                <DragBox
                  x={0}
                  y={0}
                  onMouseDown={() => {
                    setVarIndex(i);
                  }}
                  onMouseMove={pos => {
                    const point = {
                      x: pos.x + poses.right[count][i].x,
                      y: pos.y + poses.right[count][i].y
                    }
                    checkPosition(point, poses.right[count][i], false)
                  }}
                  onMouseUp={pos => {
                    setVarIndex(-1);
                    const point = {
                      x: pos.x + poses.right[count][i].x,
                      y: pos.y + poses.right[count][i].y
                    }
                    checkPosition(point, poses.right[count][i], false, i);
                  }}
                >
                  <SimpleImage
                    image={variant.uri}
                    style={{
                      width: size,
                      height: size,
                    }}
                  />
                </DragBox>
              </motion.div>
            )
          })
        }

      </div>

    </div>
  );
};

export default RowTemplate;
