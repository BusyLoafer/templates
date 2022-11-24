import React, {useEffect, useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import {generateAudioImageStyle, generateImageStyle, generateTextStyle} from '../../lib/StyleGenerator';
import {EX_CONTENT_TYPE, purpur} from '../../lib/const';
import {parseText} from '../../lib/utils';
import ReactPlayer from 'react-player';
import PlaySvg from '../../components/svg/PlaySvg';
import {EventBus} from '../../lib/EventBus';
import "./style.scss"
import SimpleImage from "../../components/Images/SimpleImage";
import ReactSlider from 'react-slider'
import RevertSvg from "../../components/svg/RevertSvg";

const lessonType = EX_CONTENT_TYPE.audioBook;

export default (props) => {

	// ? props
	const {
		ex,
	} = props;

	// ? store
	const coef = useSelector(state => state.baseCoef);
	const viewSize = useSelector(state => state.baseViewSize);
	const currentId = useSelector(state => state.currentId);

	// ? state
	const [image, setImage] = useState(null);
	const [imageStyle, setImageStyle] = useState({});
	const [text, setText] = useState([]);


	// ? effects

	useEffect(() => {
		const data = ex[lessonType];
		if (data.picture.fileUrl) {
			setImage(data.picture.fileUrl);
			setImageStyle(generateAudioImageStyle(data.picture, coef, true))
		}
		setText(data.text.value);
	}, [ex]);

	// ? functions

	return (
		<div className="wrapper">
			<div className="audiobook" style={viewSize}>
				<div className="audiobook-body">
					<SimpleImage
						show={!!image}
						style={imageStyle}
						image={image}
					/>

					<p className="audiobook-text">
						{text}
					</p>
				</div>

			</div>
		</div>
	)
}

