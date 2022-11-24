import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import PlaySvg from "../../components/svg/PlaySvg";
import { EX_CONTENT_TYPE, VIDEO } from "../../lib/const";
import ReactPlayer from 'react-player';
import { EventBus } from "../../lib/EventBus";
import "./style.scss"

const lessonType = EX_CONTENT_TYPE.video;

const VideoTemplate = props => {

  const {
    ex,
  } = props;


  const coef = useSelector(state => state.baseCoef);
  const baseViewSize = useSelector(state => state.baseViewSize);
  const currentId = useSelector(state => state.currentId);

  const [pause, setPause] = useState(false);

  const player = useRef(null);
  const layoutRef = useRef(null);

  useEffect(() => {
    EventBus.$on(VIDEO.stop, fullStopVideo);
    return () => {
      EventBus.$off(VIDEO.stop, fullStopVideo);
    };
  }, []);

  useEffect(() => {
    if (currentId !== ex.id) {
      stopVideo()
    } else {
      setPause(false)
    }
  }, [currentId]);

  const stopVideo = () => {
    setTimeout(() => {
      if (player.current) {
        player.current.seekTo(0);
      }
    }, 10);
    setPause(true)
  }
  const fullStopVideo = () => {
    if (player.current) {
      player.current.seekTo(0);
    }
  }

  return (
    <div
      className="videoTemplate"
      ref={layoutRef}
      style={baseViewSize}
    >
      <ReactPlayer
        className='videoPlayer'
        url={ex[lessonType].video.fileUrl}
        ref={(ref) => {
          player.current = ref
        }}
        stopOnUnmount={true}
        playing={!pause}
        onEnded={stopVideo}
        controls={false}
      />

      {
        pause &&
        <div
          className="pause"
        >
          <div className="pause-block">
            <div
              className="pause-round"
              onClick={() => { setPause(false) }}
              style={{
                width: 84 * coef,
                height: 84 * coef,
                borderRadius: 42 * coef
              }}
            >
              <div style={{ paddingLeft: 6 * coef }}>
                <PlaySvg
                  size={{ x: 24 * coef, y: 24 * coef }}
                  fill={"#7480FF"}
                />
              </div>
            </div>
          </div>
        </div>
      }
    </div >
  )
}

export default VideoTemplate;