import React, {useEffect, useState} from "react";
import {motion, useAnimation} from "framer-motion";

const AnimatedPath = props => {

	const {
		d, progress, line, showMask
	} = props;

	const [showCurrent, setShowCurrent] = useState(true)

	const step = useAnimation({
		pathLength: 0,
		strokeWidth: 0,
		stroke: line.color
	});

	const step1 = useAnimation({offset: "-20%"});
	const step2 = useAnimation({offset: "-10%"});
	const step3 = useAnimation({offset: "0%"});

	useEffect(() => {
		if (progress.value > 0) {
			step.set({
				pathLength: progress.value,
				strokeWidth: line.width,
				stroke: line.color
			})
		} else {
			step.set({
				pathLength: 0,
				strokeWidth: 0,
				stroke: line.color
			})
		}
	}, [progress])

	useEffect(() => {
		if (showMask) {
			setTimeout(() => {
				startBlink()
			}, 100)
		}
	}, [showMask])


	const startBlink = () => {
		step1.set({offset: "0%"})
		step2.set({offset: "20%"})
		step3.set({offset: "40%"})
		step1.start({offset: "90%", transition: {duration: 1}})
		step2.start({offset: "110%", transition: {duration: 1}})
		step3.start({offset: "130%", transition: {duration: 1}}).then(() => {
			setShowCurrent(false)
		})
	}

	return (
		<div>
			{
				showMask && showCurrent ?
					<div>
						<mask id="mask">
							<path
								d={d}
								strokeWidth={line.width}
								stroke={"#FFF"}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</mask>

						<radialGradient id="blinkGradient" gradientTransform="translate(-0.25 -0.25) scale(1.5, 1.5)">
							<motion.stop animate={step1} offset="0%" stopColor={line.color}/>
							<motion.stop animate={step2} offset="10%" stopColor={"#FFF"}/>
							<motion.stop animate={step3} offset="30%" stopColor={line.color}/>
						</radialGradient>

						<rect
							fill="url(#blinkGradient)"
							mask="url(#mask)"
							height="100%"
							width="100%"
						/>
					</div>
					:
					<motion.path
						animate={step}
						d={d}
						strokeWidth={showCurrent ? 0 : line.width}
						stroke={line.color}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
			}
		</div>
	);
};

export default AnimatedPath;