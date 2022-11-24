import React, {useEffect, useState, useRef, useCallback} from "react";
import {setBtnAction, setLessonNext, setLessonReset, setPlaying} from '../../../store/actions';
import {useSelector, useDispatch} from 'react-redux';
import {RESET_TYPE, SOUND_TYPE, PAUSE_TYPE, PLAY_TYPE, HELP_TYPE, NEXT_TYPE, CHECK_TYPE, SOUNDS as S} from "../../../lib/const";
import PanelSvgButton from "../../Buttons/PanelSvgButton";
import {EventBus} from "../../../lib/EventBus";
import './style.scss'
import FlashPanelButton from "../../Buttons/FlashPanelButton";
import PassLesson from "../../../../components/User/Lottie/PassLesson";
import {lessonCompletion} from "../../MainComponent/Manager";
import TrackPlayer from "../TrackPlayerPanel/TrackPlayer";

export default (props) => {

	// ? props
	const {
		onNextClick = () => {
		},
	} = props;

	// ? store
	const lessonStatus = useSelector(state => state.lessonStatus);
	const lessonId = useSelector(state => state.lessonId);
	const playing = useSelector(state => state.playing);
	const lessonNext = useSelector(state => state.lessonNext);
	const lessonCheck = useSelector(state => state.lessonCheck);
	const lessonReset = useSelector(state => state.lessonReset);
	const panelSize = useSelector(state => state.panelSize);
	const sounds = useSelector(state => state.sounds);

	const dispatch = useDispatch();

  // ? state
  const [settings, setSettings] = useState([]);
  const [reset, setReset] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [next, setNext] = useState(false);
  const [showNextWarning, setShowNextWarning] = useState(false)
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [repeat, setRepeat] = useState(false);

	// ? refs
	const soundRef = useRef(null);
	const correctRef = useRef(null);
	const soundArr = useRef(null);
	const exIndex = useRef(null);
	const repeatRef = useRef(false);

	// ? effects
	useEffect(() => {
		EventBus.$on(S.allStop, fullStopSound);
		return () => {
			fullStopSound();
			EventBus.$off(S.allStop, fullStopSound);
		}
	}, []);

	useEffect(() => {
		checkNextOrSound(exIndex.current, !playing);
	}, [playing])

	useEffect(() => {
		repeatRef.current = repeat;
	}, [repeat])

	useEffect(() => {
		if (sounds) {

			soundArr.current = sounds.map(s => {
				return {
					sound: s.sound ? new Audio(s.sound) : undefined,
					correct: s.correct ? new Audio(s.correct) : undefined,
				}
			})

			setSettings(sounds.map(s => {
				if (s) {
					return {
						sound: !!s.sound,
						correct: !!s.correct,
						panelShow: s.panelShow,
						help: s.help,
						check: s.check,
						next: s.next,
						status: s.status,
						reset: s.reset,
						soundOrNext: s.soundOrNext,
						book: !!s.book,
					}
				}
				return null;
			}))
		}
	}, [sounds]);

	useEffect(() => {
		if (lessonStatus[lessonId]) {
			if (soundArr.current && soundArr.current[lessonId] && soundArr.current[lessonId].correct) {
				setCorrect(true);
				onPlayCorrect();
			}
			if (!settings[lessonId] || settings[lessonId].status === undefined) {
				dispatch(setLessonNext(true));
			}
		} else {
			setCorrect(false);
		}
	}, [lessonStatus])

	useEffect(() => {
		setReset(lessonReset);
	}, [lessonReset])


	useEffect(() => {
		if (settings.length) {
			checkReset();
			checkNext();
			checkAndPlaySound(lessonId);
		}
	}, [lessonId, settings])

	useEffect(() => {
		setNext(lessonNext);
	}, [lessonNext])

	// ? functions
	const checkNext = () => {
		dispatch(setLessonNext(
			lessonStatus[lessonId]
			&& settings[lessonId]
			&& settings[lessonId].status === undefined
		));
	}

	const checkReset = () => {
		if (settings[lessonId] && settings[lessonId].reset) {
			dispatch(setLessonReset(true));
		} else if (lessonStatus[lessonId] &&
			(settings[lessonId] && settings[lessonId].status === undefined || settings[lessonId] && settings[lessonId].status)) {
			dispatch(setLessonReset(true));
		} else {
			dispatch(setLessonReset(false));
		}
	}

	const subscribe = (leave = false) => {
		if (soundRef.current) {
			if (!leave) {
				soundRef.current.addEventListener('ended', () => {
					if (repeatRef.current) {
						soundRef.current.currentTime = 0;
						soundRef.current.play();
					} else {
						dispatch(setPlaying(false))
					}
				});
			} else {
				soundRef.current.removeEventListener('ended', () => dispatch(setPlaying(false)));
			}
		}
	}

	const subscribeOnUpdate = (leave = false) => {
		if (soundRef.current) {
			if (!leave) {
				soundRef.current.addEventListener('play', checkDuration);
				soundRef.current.addEventListener('durationchange', checkDuration);
				soundRef.current.addEventListener('timeupdate', getCurrentTime);
			} else {
				soundRef.current.removeEventListener('timeupdate', getCurrentTime);
			}
		}
	}

	const getCurrentTime = useCallback(() => {
		setCurrentTime(soundRef.current.currentTime)
	}, [])

	const checkDuration = () => {
		setTimeout(() => {
			if (soundRef.current.duration) {
				setDuration(soundRef.current.duration)
				soundRef.current.removeEventListener('play', checkDuration)
				soundRef.current.removeEventListener('durationchange', checkDuration)
			}
		}, 200)
	}

	const correctSubscribe = (leave = false) => {
		if (correctRef.current) {
			if (!leave) {
				correctRef.current.addEventListener('ended', () => dispatch(setPlaying(false)));
			} else {
				correctRef.current.removeEventListener('ended', () => dispatch(setPlaying(false)));
			}
		}
	}

	const checkAndPlaySound = index => {
		setRepeat(false);
		stopSound();
		if (soundArr.current && soundArr.current[index]) {
			if (soundArr.current[index].sound) {
				subscribe(true);
				subscribeOnUpdate(true);
				soundRef.current = soundArr.current[index].sound;
				subscribe();
				let status = lessonStatus[index];
				if (settings[index] && settings[index].status !== undefined) {
					status = settings[index].status;
				}
				if (!status) {
					dispatch(setPlaying(true));
					soundRef.current.play();
				}
				if (settings[index] && settings[index].book) {
					subscribeOnUpdate()
				} else {
					subscribeOnUpdate(true)
				}
			} else {
				checkNextOrSound(index);
				dispatch(setPlaying(false));
				subscribe(true);
				soundRef.current = null;
			}
			correctSubscribe(true);
			if (soundArr.current && soundArr.current[index] && soundArr.current[index].correct) {
				correctRef.current = soundArr.current[index].correct;
				correctSubscribe();
			} else {
				correctRef.current = null;
			}
		} else {
			dispatch(setPlaying(false));
			subscribe(true);
			soundRef.current = null;
		}
		exIndex.current = lessonId;
	}

	const onSoundClick = () => {
		let cor = correct;
		if (!lessonStatus[lessonId]) {
			cor = false;
		}
		toggleSound({correct: cor});
	}
	const onSoundBookClick = () => {
		if (soundRef.current) {
			if (playing) {
				soundRef.current.pause();
				dispatch(setPlaying(false));
			} else {
				soundRef.current.play();
				dispatch(setPlaying(true));
			}
		}
	}

	const onResetClick = () => {
		dispatch(setBtnAction(RESET_TYPE));
	}

	const onCheckClick = () => {
		dispatch(setBtnAction(CHECK_TYPE));
	}

	const onHelpClick = () => {
		dispatch(setBtnAction(HELP_TYPE));
	}

	const onPlayCorrect = () => {
		if (soundRef.current && !soundRef.current.paused) {
			soundRef.current.pause();
			soundRef.current.currentTime = 0;
		}
		if (correctRef.current) {
			dispatch(setPlaying(true));
			correctRef.current.play();
		} else {
			dispatch(setPlaying(false));
		}
	}

	const fullStopSound = (data = {pause: false}) => {
		stopSound(!data.pause);
		if (!data.pause) {
			soundArr.current.forEach(s => {
				if (s.sound) {
					s.sound.pause();
				}
				if (s.correct) {
					s.sound.pause();
				}
			})
			soundArr.current = [];
		}
	}

	const stopSound = (stopPlaying = true) => {
		if (soundRef.current && !soundRef.current.paused) {
			soundRef.current.pause();
			soundRef.current.currentTime = 0;
		}
		if (correctRef.current && !correctRef.current.paused) {
			correctRef.current.pause();
			correctRef.current.currentTime = 0;
		}
		if (stopPlaying) {
			dispatch(setPlaying(false));
		}
	}

	const toggleSound = data => {
		const sound1 = data && data.correct ? correctRef.current : soundRef.current;
		const sound2 = !data || !data.correct ? correctRef.current : soundRef.current;
		if (sound2 && !sound2.paused) {
			sound2.pause();
			sound2.currentTime = 0;
		}
		if (sound1) {
			if (!sound1.paused) {
				sound1.pause();
				sound1.currentTime = 0;
				dispatch(setPlaying(false));
			} else {
				dispatch(setPlaying(true));
				sound1.play();
			}
		} else {
			dispatch(setPlaying(false));
		}
	}

	const checkNextOrSound = (index, value = true) => {
		if (settings[index] && settings[index].soundOrNext) {
			dispatch(setLessonNext(value));
		}
	}

	const lesSet = settings[lessonId];

  const checkNextClick = () => {
    if (next || lesSet && !lesSet.next) {
      onNextClick();
    } else {
      setShowNextWarning(true)
    }
  }

  const closeWarning = () => {
    setShowNextWarning(false);
  }

  const forseLessonCompletion = () => {
    lessonCompletion(exIndex.current)
    closeWarning();
    onNextClick();
  }

	const checkDisMusic = () => {
		if (!settings[lessonId]) {
			return true
		} else if (!lessonStatus[lessonId]) {
			return !settings[lessonId].sound
		} else if (settings[lessonId].soundOrNext) {
			return false
		} else {
			return !settings[lessonId].correct
		}
	}

	if (lesSet && !lesSet.panelShow) return null;

	return (
		<div className='bottomPanelWrapper'>
			<div className="bottomPanel">

				{/*<PanelSvgButton*/}
				{/*  reverse={true}*/}
				{/*  type={NEXT_TYPE}*/}
				{/*  disabled={lessonId === 0}*/}
				{/*  onClick={() => onNextClick(-1)}*/}
				{/*/>*/}

				<PanelSvgButton
					type={playing ? PAUSE_TYPE : SOUND_TYPE}
					disabled={checkDisMusic()}
					onClick={onSoundClick}
					show={lesSet && !lesSet.book}
				/>

				<FlashPanelButton
					show={lesSet && lesSet.book}
					type={playing ? PAUSE_TYPE : PLAY_TYPE}
					onClick={onSoundBookClick}
				/>

				<PanelSvgButton
					type={RESET_TYPE}
					disabled={!reset}
					onClick={onResetClick}
				/>

				{
					settings[lessonId] && settings[lessonId].help &&
					<PanelSvgButton
						type={HELP_TYPE}
						onClick={onHelpClick}
					/>
				}

				{
					lessonCheck ?
						<PanelSvgButton
							type={CHECK_TYPE}
							onClick={onCheckClick}
						/>
						:
						<FlashPanelButton
							show={!lessonCheck}
							type={NEXT_TYPE}
							dis={lesSet && lesSet.next}
							active={next}
							onClick={checkNextClick}
						/>
				}

				<TrackPlayer
					show={lesSet && lesSet.book}
					time={currentTime}
					duration={duration}
					onChange={time => soundRef.current.currentTime = time}
					repeat={repeat}
					setRepeat={setRepeat}
				/>

			</div>
      <PassLesson
        show={showNextWarning}
        onClose={closeWarning}
        onOk={forseLessonCompletion}
      />
		</div>
	);
}