import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux'
import Lottie from "lottie-react";
import { YUTU_MASCOT, MASCOT_JSON, EX_CONTENT_TYPE } from '../../lib/const';
import { generateTextStyle, generateImageStyle } from '../../lib/StyleGenerator';
import "./style.scss"

const lessonType = EX_CONTENT_TYPE.info;

const InfoTemplate = props => {

  // ? props
  const {
    ex
  } = props;

  // ? consts
  const defaultOptions = YUTU_MASCOT ? MASCOT_JSON.YUTU_MASCOT_JSON
      : MASCOT_JSON.GIRAFFE_MASCOT_JSON

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const divSize = useSelector(state => state.baseViewSize);
  const fontScale = useSelector(state => state.fontScale);
  const currentId = useSelector(state => state.currentId);

  // ? state
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [mascot, setMascot] = useState("");
  const [textStyle, setTextStyle] = useState({});
  const [titleStyle, setTitleStyle] = useState({});
  const [mascotStyle, setMascotStyle] = useState({});

  // ? refs
  const lottieRef = useRef(null);

  useEffect(() => {
    const data = ex[lessonType];
    setMascot(YUTU_MASCOT ? MASCOT_JSON.YUTU_MASCOT_JSON
        : MASCOT_JSON.GIRAFFE_MASCOT_JSON)
    setMascotStyle(generateImageStyle(data.mascot, coef));
    console.log(generateImageStyle(data.mascot, coef))
    setTitle(data.title.value)
    setTitleStyle(generateTextStyle(data.title, coef, fontScale));

    setText(data.text.value)
    setTextStyle(generateTextStyle(data.text, coef, fontScale));
  }, [ex]);

  return (
    <div className='swiper-slide infoTemplate' >
      <div style={Object.assign({ position: "relative" }, divSize)}>

        <div
          className='abs'
          style={mascotStyle}
        >
          <Lottie
            animationData={mascot}
            autoPlay={true}
            loop={true}
            style={{
              width: mascotStyle.width,
              height: mascotStyle.height
            }}
          />
        </div>

        <p
          className='abs'
          style={titleStyle}
        >
          {title}
        </p>

        <p
          className='abs'
          style={textStyle}
        >
          {text}
        </p>

      </div>
    </div>
  )
}

export default InfoTemplate;
