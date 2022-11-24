import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { WIN_SHOW_MAX_COUNT } from '../../lib/const';
import { setConfetti, setLose, setWin, setWinShowCounter } from '../../store/actions';
import Win from './lottie/Win';
import Lose from './lottie/Lose';
import './style.scss';


export default () => {

  // ? store
  const currentId = useSelector(state => state.lessonId);
  const win = useSelector(state => state.win);
  const lose = useSelector(state => state.lose);
  const mascotSettings = useSelector(state => state.mascotSettings);
  const mascotArr = useSelector(state => state.mascotArr);
  const panelSize = useSelector(state => state.panelSize);

  const dispatch = useDispatch();

  // ? state
  const [winShowCounter, setWinShowCounter] = useState(WIN_SHOW_MAX_COUNT);
  const [mascot, setMascot] = useState("yutu");
  const [style, setStyle] = useState({})

  // ? effects
  useEffect(() => {
    if (mascotSettings && mascotSettings.size) {
      setStyle(Object.assign({
        pointerEvents: lose && !win ? "auto" : "none",
        zIndex: win || lose ? 305 : 200,
      }, mascotSettings.size))
    }
  }, [win, lose])


  useEffect(() => {
    onFinish();
    setMascot(mascotArr[currentId])
  }, [currentId])


  useEffect(() => {
    if (!win) {
      let counter = winShowCounter + 1;
      if (counter >= WIN_SHOW_MAX_COUNT) {
        counter = 0;
      }
      setWinShowCounter(counter)
    }
  }, [win])

  // ? functions
  const onFinish = name => {
    switch (name) {
      case "win":
        dispatch(setWin(false))
        break;
      case "lose":
        dispatch(setLose(false))
        break;
      case "confetti":
        dispatch(setConfetti(false))
        break;
      default:
        dispatch(setWin(false))
        dispatch(setLose(false))
        dispatch(setConfetti(false))
    }
  }

  if (!mascotSettings) return null;

  return (
    <div
      className='mascots'
      style={style}
    >

      <Win
        show={win && winShowCounter === 0}
        onFinish={() => { onFinish("win") }}
        mascot={mascot}
      />

      <Lose
        show={lose}
        onFinish={() => { onFinish("lose") }}
        mascot={mascot}
      />

    </div>
  )
}