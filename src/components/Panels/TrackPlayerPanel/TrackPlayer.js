import React, {useEffect, useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import "./style.scss"
import ReactSlider from 'react-slider'
import RevertSvg from "../../svg/RevertSvg";

const maxValue = 100;

export default (props) => {

	// ? props
	const {
		show,
		time,
		duration,
		onChange,
		setRepeat,
		repeat
	} = props;

	// ? store

	// ? refs

	// ? state
	const [value, setValue] = useState(0);

	// ? effects
	useEffect(() => {
		if (duration) {
			setValue(time / (duration / maxValue))
		}
	}, [time])

	const onChangeValue = value => {
		if (duration) {
			onChange(duration / maxValue * value);
		}
	}

	// ? functions
	if (!show) return null

	const getNormalTime = time => {
		const roundedTime = Math.floor(time)
		let min = Math.floor(roundedTime / 60)
		if (min < 10) min = '0' + min
		let sec = roundedTime % 60
		if (sec < 10) sec = "0" + sec
		return min + ":" + sec;
	}

	return (
		<div className="track-block">
			<div className="track-left">
				<ReactSlider
					className="slider"
					thumbClassName="slider-thumb"
					trackClassName="slider-track"
					min={0}
					max={maxValue}
					value={value}
					onAfterChange={onChangeValue}
					// renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
				/>
				<span className="time">{getNormalTime(time)}</span>
			</div>
			<div className="track-right">
				<div
					style={{cursor: "pointer"}}
					onClick={() => setRepeat(!repeat)}
				>
					<RevertSvg
						color={!repeat ? "#A1ABCD" : "#7480FF"}
					/>
				</div>
				<span className="time">{getNormalTime(duration)}</span>
			</div>
		</div>
	)
}

