import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { generateImageStyle, generateTextStyle } from '../../lib/StyleGenerator';
import { EX_CONTENT_TYPE, purpur } from '../../lib/const';
import { parseText } from '../../lib/utils';
import ReactPlayer from 'react-player';
import PlaySvg from '../../components/svg/PlaySvg';
import { EventBus } from '../../lib/EventBus';
import "./style.scss"

const lessonType = EX_CONTENT_TYPE.audioAbc;

export default (props) => {

  // ? props
  const {
    ex,
  } = props;

  // ? store
  const coef = useSelector(state => state.baseCoef);
  const viewSize = useSelector(state => state.baseViewSize);
  const currentId = useSelector(state => state.currentId);
  const fontScale = useSelector(state => state.fontScale);
  const allImages = useSelector(state => state.allImages);

  // ? state
  const [image, setImage] = useState(null);
  const [imageStyle, setImageStyle] = useState({});
  const [text, setText] = useState([]);
  const [textStyle, setTextStyle] = useState({});
  const [title, setTitle] = useState([]);
  const [titleStyle, setTitleStyle] = useState({});
  const [video, setVideo] = useState(null);
  const [pause, setPause] = useState(true);

  // ? refs
  const playerRef = useRef(null);

  // ? effects
  useEffect(() => {
    EventBus.$on("stopVideo", fullStopVideo)
    return () => {
      EventBus.$off("stopVideo", fullStopVideo)
    }
  }, [])

  useEffect(() => {
    if (currentId !== ex.id) {
      stopVideo()
    } else {
      setPause(false)
    }
  }, [currentId])

  useEffect(() => {
    const data = ex[lessonType];
    if (data.picture && data.picture.fileUrl !== "") {
      setImageStyle(generateImageStyle(data.picture, coef));

      if (data.picture.fileUrl.substr(-3) === "mp4") {
        setVideo(data.picture.fileUrl)
      } else {
        setImage(data.picture);
      }
    }

    if (data.text) {
      setText(parseText(data.text.value))
      setTextStyle(generateTextStyle(data.text, coef, fontScale))
    }

    if (data.title) {
      setTitle(parseText(data.title.value))
      setTitleStyle(generateTextStyle(data.title, coef, fontScale))
    }
  }, [ex]);

  // ? functions
  const stopVideo = () => {
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
      }
    }, 10);
    setPause(true)
  }

  const fullStopVideo = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  }

  return (
    <div className="wrapper">
      <div style={viewSize}>
        {
          video &&
          <div
            className="absolute videoWrapper"
            style={imageStyle}
          >
            <div className='videoBox'>

              <ReactPlayer
                className='videoPlayer'
                url={video}
                ref={(ref) => {
                  playerRef.current = ref
                }}
                width={imageStyle.width}
                height={imageStyle.height}
                stopOnUnmount={true}
                playing={!pause}
                onEnded={stopVideo}
                controls={false}
              />

              {
                pause &&
                <button
                  onClick={() => {
                    EventBus.$emit("stopTSound")
                    setPause(false)
                  }}
                >
                  <div
                    className='playButton'
                    style={{
                      top: (imageStyle.height - 84 * coef) * 0.5,
                      left: (imageStyle.width - 84 * coef) * 0.5,
                      borderRadius: 84,
                      width: 84 * coef,
                      height: 84 * coef,
                      paddingLeft: 4 * coef
                    }}
                  >
                    <PlaySvg size={{ x: 24, y: 24 }} fill={purpur} />
                  </div>
                </button>
              }
            </div>
          </div>
        }
        {
          image &&
          <img
            src={image.fileUrl}
            className="absolute image"
            style={imageStyle}
          />

        }
        <div
          className='absolute'
          style={textStyle}
        >
          {
            text.length > 0 && text.map((txt, index) => {
              return (
                <p
                  style={txt.color ? { color: txt.color } : {}}
                  key={index}
                >
                  {txt.value}
                </p>
              )
            })
          }
        </div>

        <div
          className='absolute'
          style={titleStyle}
        >
          {
            title.length > 0 && title.map((txt, index) => {
              return (
                <p
                  style={txt.color ? { color: txt.color } : {}}
                  key={index}
                >
                  {txt.value}
                </p>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

