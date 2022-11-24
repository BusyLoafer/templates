import React, {useEffect, useRef, useState} from 'react'
import CloseSvg from '../../svg/CloseSvg';
import ExperienceSvg from '../../svg/ExperienceSvg';
import {motion, useAnimation} from "framer-motion";
import './style.scss'
import {useSelector} from 'react-redux';

const values = {
	baseScale: 0,
	scale: 1,
	baseExp: "-3%",
	basePath: "0%",
	dur: {duration: 0.6},
	baseOpacity: 0,
	opacity: 1
}

export default (props) => {

	// ? props
	const {onExit, lessonTitle = "Title"} = props;

	// ? store
	const lessonCount = useSelector(state => state.lessonCount);
	const lessonId = useSelector(state => state.lessonId);
	const completedLesson = useSelector(state => state.completedLesson);
	const courseId = useSelector(state => state.courseId);
	const exercises = useSelector(state => state.exercises);
	const lessonStatus = useSelector(state => state.lessonStatus);

	// ? state
	const [pageWidth, setPageWidth] = useState(0)

	// ? refs
	const pageRef = useRef(null);
	const currentCount = useRef(0);

	const path = useAnimation();
	const exp = useAnimation();

	// ? effects
	useEffect(() => {
		setPageWidth(pageRef.current.clientWidth * 2);
	}, [])

	useEffect(() => {
		if (completedLesson >= 0 && lessonCount > 0) {
			const forward = completedLesson > currentCount.current
			currentCount.current = completedLesson
			startAnim(forward);
		}
	}, [completedLesson, lessonCount])

	// ? functions
	const startAnim = forward => {
		path.start({
			width: 100 / lessonCount * completedLesson + "%",
			transition: {duration: 1}
		});
		if (forward) {
			exp.start({
				left: 100 / lessonCount * (completedLesson + 0.25) + "%",
				opacity: [values.opacity, values.opacity, values.baseOpacity],
				scale: [values.baseScale, values.scale, values.scale * 1.4],
				transition: {duration: 1.25, times: [0, 0.6, 1]}
			}).then(() => {
				exp.set({
					left: 100 / lessonCount * completedLesson + "%",
					opacity: values.baseOpacity,
					scale: values.baseScale
				})
			})
		} else {
			exp.set({
				left: 100 / lessonCount * completedLesson + "%",
				opacity: values.baseOpacity,
				scale: values.baseScale
			})
		}
	}

	const onExitClick = () => {
		const exerciseCompletedIds = parseStatusExercises();
		onExit(exerciseCompletedIds)
		// location.href = '/course/' + courseId
	}

	const parseStatusExercises = () => {
		const arr = []
		lessonStatus.forEach((lS, index) => {
			if (lS && exercises[index]) {
				arr.push(exercises[index].id)
			}
		})
		return arr;
	}


	return (
		<div className='upPanel'>

			{/*<div className='uiPanel'>*/}
			<div
				className='closeBtn'
				onClick={onExitClick}
			>
				<CloseSvg/>
			</div>

			<div className='uiPanel'>
				<div className="uiPanel-up">
					<div className="uiTitle">{lessonTitle}</div>
					<div
						className='lessonCount'
						style={{width: pageWidth ? (pageWidth * 2 - 5) + 'px' : "10%"}}
					>
						<p>
							{lessonId + 1}
						</p>

						<div ref={pageRef}>
							<p>
								/{lessonCount}
							</p>
						</div>

					</div>
				</div>

				<div className='path pathBackground'>

					<div style={{width: "100%", position: "relative"}}>

						<motion.div
							animate={path}
							className='path activePath'
							transition={values.dur}
							style={{width: values.basePath}}
						/>

						<motion.div
							animate={exp}
							transition={values.dur}
							className='abs'
							style={{left: values.baseExp, top: -18, opacity: values.baseOpacity, scale: values.baseScale}}
						>
							<ExperienceSvg/>
						</motion.div>
					</div>

				</div>
			</div>


			{/*</div>*/}

		</div>
	)
}