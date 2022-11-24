import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import './style.scss';
import 'swiper/swiper.scss';
import UpPanel from '../Panels/UpPanel/UpPanel';
import BottomPanel from '../Panels/BottomPanel/BottomPanel';
import { allData } from '../../lib/tempData';
import { calculateCoef, checkFinish, onIndexChanged, setCurrentCourse, setSettings } from './Manager';
import { useSelector } from 'react-redux';
import InfoTemplate from '../../templates/InfoTemplate/InfoTemplate';
import AudioTemplate from '../../templates/AudioTemplate/AudioTemplate';
import RebusTemplate from '../../templates/RebusTemplate/RebusTemplate';
import { EX_CONTENT_TYPE } from '../../lib/const';
import QuizTemplate from '../../templates/QuizTemplate/QuizTemplate';
import Mascots from '../Mascots/Mascots';
import BaseSounds from '../BaseSounds';
import QuizImageTemplate from '../../templates/QuizImageTemplate/QuizImageTemplate';
import QuizSwowTemplate from '../../templates/QuizSwowTemplate/QuizSwowTemplate';
import PuzzleTemplate from '../../templates/PuzzleTemplate/PuzzleTemplate';
import QuizSentenceTemplate from '../../templates/QuizSentenceTemplate/QuizSentenceTemplate';
import BottomModal from '../Panels/BottomModal/BottomModal';
import ConfettiBox from '../Mascots/ConfettiBox';
import DrawTemplate from '../../templates/DrawTemplate/DrawTemplate';
import PairsTemplate from '../../templates/PairsTemplate/PairsTemplate';
import OrderTemplate from '../../templates/OrderTemplate/OrderTemplate';
import RowTemplate from '../../templates/RowTemplate/RowTemplate';
import VideoTemplate from '../../templates/VideoTemplate/VideoTemplate';
import WordOrderTemplate from '../../templates/WordOrderTemplate/WordOrderTemplate';
import MemoryTemplate from '../../templates/MemoryTemplate/MemoryTemplate';
import FillWordTemplate from '../../templates/FillWordTemplate/FillWordTemplate';
import BubbleTemplate from '../../templates/BubbleTemplate/BubbleTemplate';
import {setExercises, setLessonCount, setLessonStatus} from "../../store/actions";
import AudioBookTemplate from "../../templates/AudioBookTemplate/AudioBookTemplate";
import store from "../../store";

const MainComponent = props => {

  // ? refs
  const sw = useRef(null)

  // ? props
  const { data, courseId, lessonTitle, onExit } = props;

  // ? state
  const [swiperRef, setSwiperRef] = useState(null);

  // ? store
  const exercises = useSelector(state => state.exercises);
  const preload = useSelector(state => state.preload);
  const coef = useSelector(state => state.baseCoef);
  const lessonStatus = useSelector(state => state.lessonStatus);
  const lessonId = useSelector(state => state.lessonId);

  // ? effects
  useEffect(() => {
    return () => {
      store.dispatch(setExercises([]))
      store.dispatch(setLessonStatus([]));
      store.dispatch(setLessonCount(0));
    }
  }, [])

  useEffect(() => {
    if (swiperRef && swiperRef.width) {
      calculateCoef({ width: swiperRef.width, height: swiperRef.height })
    }
  }, [swiperRef]);

  useEffect(() => {
    if (courseId) {
      setCurrentCourse(courseId);
    }
  }, [courseId])
  

  useEffect(() => {
    if (preload) {
      setTimeout(onLayout, 300)
    }
  }, [preload]);

  useEffect(() => {
    if (data && data.length) {
      setSettings(data);
    }
  }, [data])

  // ? functions

  const onLayout = () => {
    onIndexChanged(0);
  }

  const onActiveIndexChange = e => {
    onIndexChanged(e.activeIndex);
  }

  const onNextClick = value => {
    if (value < 0) {
      swiperRef.slidePrev(0)
    } else {
      checkFinish(onExit)
      swiperRef.slideNext(0)
    }
  }

  const templateType = (ex, index) => {
    if (ex[EX_CONTENT_TYPE.info]) {
      return <InfoTemplate ex={ex} />
    } else if (ex[EX_CONTENT_TYPE.audioAbc]) {
      return <AudioTemplate ex={ex} />
    } else if (ex[EX_CONTENT_TYPE.audioBook]) {
      return <AudioBookTemplate ex={ex} />
    } else if (ex[EX_CONTENT_TYPE.rebus]) {
      return <RebusTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.quiz]) {
      return <QuizTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.quizImage]) {
      return <QuizImageTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.quizSwow]) {
      return <QuizSwowTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.puzzle]) {
      return <PuzzleTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.quizSentence]) {
      return <QuizSentenceTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.draw]) {
      return <DrawTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.pair]) {
      return <PairsTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.pictureOrder]) {
      return <OrderTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.row]) {
      return <RowTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.video]) {
      return <VideoTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.makeWord]) {
      return <WordOrderTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.memory]) {
      return <MemoryTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.fillwords]) {
      return <FillWordTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else if (ex[EX_CONTENT_TYPE.bubble]) {
      return <BubbleTemplate ex={ex} exerciseDone={lessonStatus[index]} />
    } else {
      return <div key={ex.id} />
    }
  }

  const renderExercise = useCallback(() => {
    return exercises.map((ex, index) => (
      <SwiperSlide key={ex.id} virtualIndex={index} className="swiper-slide">
        {templateType(ex, index)}
      </SwiperSlide>
    ))
  }, [lessonStatus, lessonId, coef]);

  return (
    <div className='mainApp' id="yutu-templates">
      <div className='mainSwiper'>
        <UpPanel onExit={onExit} lessonTitle={lessonTitle} />
        <Swiper
          modules={[Virtual]}
          slidesPerView={1}
          virtual
          ref={sw}
          allowTouchMove={false}
          onSwiper={setSwiperRef}
          onActiveIndexChange={onActiveIndexChange}
        >
          {renderExercise()}
        </Swiper>
        <ConfettiBox />
        <Mascots />
        <BottomPanel onNextClick={onNextClick} />
        <BaseSounds />
        <BottomModal />
      </div>
    </div>
  )
}

export default MainComponent;