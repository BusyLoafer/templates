import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { EX_CONTENT_TYPE, RESET_TYPE, SOUNDS as S } from "../../lib/const";
import { setBtnAction, setLessonReset } from "../../store/actions";
import CheckSvg from "../../components/svg/CheckSvg";
import { setFullWin, resetStates } from "../../lib/yutuManager";
import { EventBus } from "../../lib/EventBus";
import BubbleSvg from "../../components/svg/BubbleSvg";
import { onLessonReset } from "../../components/MainComponent/Manager";
import "./style.scss"
import Bubble from "../../components/Animations/Bubble";
const lessonType = EX_CONTENT_TYPE.bubble;

const posesX = [
  313,
  91,
  203,
  84,
  278,
  162
]

const colors = [
  "#CFC7FF",
  "#FFC7CA",
  "#E7C0FF",
  "#FFDEC7",
  "#CBE1C6",
  "#C7EEFF",
]
const MAX_BUBBLE_COUNT = 6;
const timeout = 1000;

const boxTime = 6000;


// const aBubble = Animated.createAnimatedComponent(Bubble);


const BubbleTemplate = props => {

  const {
    ex,
    exerciseDone,
  } = props;

  const hitsRef = useRef([])
  const bubblesRef = useRef([])

  const coef = useSelector(state => state.baseCoef);
  const currentId = useSelector(state => state.currentId);
  const panelSize = useSelector(state => state.panelSize);
  const isPhone = useSelector(state => state.isPhone);
  const btnAction = useSelector(state => state.btnAction);
  const baseViewSize = useSelector(state => state.baseViewSize);
  const mascotSettings = useSelector(state => state.mascotSettings);

  const dispatch = useDispatch();

  const [hits, setHits] = useState([]);
  const [box, setBox] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const [xPositions, setXPositions] = useState([]);
  const [images, setImages] = useState([]);
  const [bubbleSize, setBubbleSize] = useState({ x: 88, y: 122 });

  useEffect(() => {
    setXPositions(posesX.map(p => p * coef));
    setImages(ex[lessonType].images.values.filter(val => val));
    generateHits();

    return (() => {
      setBubbles([]);
    })
  }, []);

  useEffect(() => {
    setBox(mascotSettings.size)
  }, [mascotSettings])


  useEffect(() => {
    if (isPhone) {
      setBubbleSize({ x: 88 * coef, y: 122 * coef })
    } else {
      // setBubbleSize({ x: 88 * coef, y: 122 * coef })
      setBubbleSize({ x: 66 * coef, y: 91.5 * coef })
    }
  }, [coef, isPhone]);

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
    if (ex.id === currentId && !exerciseDone && box && images.length > 0) {
      createBubbles();
    }
    if (ex.id !== currentId) {
      setBubbles([]);
    }
  }, [box, images, currentId, exerciseDone]);

  const generateHits = () => {
    const newHits = []
    for (let i = 0; i < ex[lessonType].correctCount; i++) {
      newHits.push(false);
    }
    _setHits(newHits);
  }

  const _setHits = value => {
    setHits(value);
    hitsRef.current = value
  }

  const createBubbles = () => {
    const newBubbles = [];

    for (let i = 0; i < MAX_BUBBLE_COUNT; i++) {
      newBubbles.push({
        size: bubbleSize,
        x: xPositions[i] - bubbleSize.x * 0.5,
        y: box.height - panelSize.down + 220 * coef - bubbleSize.y * 0.5,
        color: colors[i],
        timeout: i * timeout,
        id: i,
      })
    }
    bubblesRef.current = newBubbles;
    setBubbles(newBubbles)
  }

  const generateImage = () => {
    const imageIndex = Math.floor(Math.random() * images.length)
    return {
      url: images[imageIndex],
      right: !ex[lessonType].hiddenItems.includes(imageIndex)
    }
  }

  const checkWin = () => {
    if (!exerciseDone) {
      setTimeout(() => {
        dispatch(setLessonReset(hitsRef.current.some(hit => hit)));
      }, 100);
      if (hitsRef.current.every(hit => hit)) {
        EventBus.$emit(S.play, { name: S.win });
        setBubbles([]);
        setFullWin();
      }
    }
  }

  const onBubbleClick = correct => {
    EventBus.$emit(S.play, { name: S.boom })
    changeHits(correct)
  }

  const changeHits = value => {
    let newHits = hitsRef.current.slice();
    const lastIndex = newHits.lastIndexOf(true)
    if (lastIndex >= 0) {
      if (value) {
        newHits[lastIndex + 1] = true
      } else {
        newHits[lastIndex] = false
      }
    } else if (value) {
      newHits[0] = true
    }
    _setHits(newHits)
  }

  const reset = () => {
    if (exerciseDone) {
      createBubbles();
    }
    onLessonReset();
    resetStates(["NRWC"])
    generateHits();
  }


  return <div
  className="bubbleTemplate"
    style={baseViewSize}
  // onLayout={(event) => {
  //   onLayout();
  //   measureView(event);
  // }}
  >
    {
      !exerciseDone &&
      <div style={Object.assign({ height: 51 * coef, }, styles.hitsPanel)} >
        {
          hits.map((hit, index) => {
            return (
              <div style={styles.minBubble} key={index} >
                <BubbleSvg
                  nodeColor={hit ? "#77C801" : "#C4D3FA"}
                  bubbleColor={hit ? "#77C801" : "#EAEFFC"}
                  checked={hit}
                  size={{ x: 26 * coef, y: 36 * coef }}
                />
              </div>
            )
          })
        }
      </div>
    }

    {
      !exerciseDone ?
        <div style={{ display: "flex", flexGrow: 1 }} >

          {
            box &&
            <div style={{
              position: "absolute",
              top: -100,
              height: box.height - panelSize.down + 100,
              width: "100%",
            }}>
              <div style={{ display: "flex", flexGrow: 1 }} >
                {
                  bubbles.map((bubble, index) => {
                    return (
                      <Bubble
                        bubble={bubble}
                        onBoom={onBubbleClick}
                        checkWin={checkWin}
                        getSettings={generateImage}
                        key={index}
                      />
                    )
                  }
                  )
                }

              </div>
            </div>
          }

        </div>
        :
        <div style={styles.winWrapper} >
          <div
            style={{
              width: 144 * coef,
              height: 144 * coef,
              borderRadius: 144,
              display: 'flex',
              backgroundColor: "#77C801",
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CheckSvg
              size={{ x: 70 * coef, y: 51 * coef }}
            />
          </div>
        </div>
    }

    <div style={{ height: panelSize.down, backgroundColor: "white" }} />

  </div>;
};

export default BubbleTemplate;

const styles = {
  wrapper: {
    flexGrow:1,
    display: "flex",
    overflow: "visible",
    backgroundColor: "white"
  },
  minBubble: {
    paddingHorizontal: 4
  },
  hitsPanel: {
    position: "absolute",
    display: "flex",
    top: 0,
    width: "100%",
    justifyContent: 'center',
    flexWrap: "nowrap",
    flexDirection: "row",
    backgroundColor: "white",
    zIndex: 100,
  },
  winWrapper: {
    flexGrow:1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
  }
};