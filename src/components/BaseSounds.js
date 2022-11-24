import React, { useEffect } from 'react'
import {
  AudioClick, AudioComplite, AudioError, AudioPuzzleFail, AudioPuzzleRight, YUTU, GIRAFFE,
  Flip, RightFlip, WrongFlip, Boom
} from '../lib/Sound';
import { SOUNDS as S, M_SOUNDS as MS } from '../lib/const';
import { EventBus } from '../lib/EventBus';


const soundClick = new Audio(AudioClick.url);
const soundWin = new Audio(AudioComplite.url);
const soundError = new Audio(AudioError.url);
const soundRight = new Audio(AudioPuzzleRight.url);
const soundFail = new Audio(AudioPuzzleFail.url);
const flip = new Audio(Flip.url);
const rightFlip = new Audio(RightFlip.url);
const wrongFlip = new Audio(WrongFlip.url);
const boom = new Audio(Boom.url);
// boom.play()

const yutuSound = {
  bigTrue: new Audio(YUTU.bigTrue.url),
  bigTrue2: new Audio(YUTU.bigTrue2.url),
  bigFalse: new Audio(YUTU.bigFalse.url),
  bigFalse2: new Audio(YUTU.bigFalse2.url),
  smallTrue: new Audio(YUTU.smallTrue.url),
  smallFalse: new Audio(YUTU.smallFalse.url)
}

const giraffeSound = {
  bigTrue: new Audio(GIRAFFE.bigTrue.url),
  bigTrue2: new Audio(GIRAFFE.bigTrue2.url),
  bigFalse: new Audio(GIRAFFE.bigFalse.url),
  bigFalse2: new Audio(GIRAFFE.bigFalse2.url),
  smallTrue: new Audio(GIRAFFE.smallTrue.url),
  smallFalse: new Audio(GIRAFFE.smallFalse.url)
}


let currentCallback = () => { };

const checkCallback = () => {
  currentCallback();
}

export default () => {

  useEffect(() => {
    EventBus.$on(S.play, play);

    EventBus.$on(S.stop, stop);

    EventBus.$on(S.allStop, allStop);

    EventBus.$on(S.winStop, winStop);

    return () => {
      EventBus.$off(S.play, play);

      EventBus.$off(S.stop, stop);

      EventBus.$off(S.allStop, allStop);

      EventBus.$off(S.winStop, winStop);
    }
  }, [])

  const allStop = () => {
    soundClick.pause();
    soundError.pause();
    soundRight.pause();
    soundFail.pause();
    flip.pause();
    rightFlip.pause();
    wrongFlip.pause();
    soundClick.currentTime = 0;
    soundError.currentTime = 0;
    soundRight.currentTime = 0;
    soundFail.currentTime = 0;
    flip.currentTime = 0;
    rightFlip.currentTime = 0;
    wrongFlip.currentTime = 0;

    currentCallback = () => { }
  }

  const winStop = () => {
    yutuSound.bigTrue2.pause();
    yutuSound.bigTrue2.currentTime = 0;
    yutuSound.bigTrue.pause();
    yutuSound.bigTrue.currentTime = 0;
    giraffeSound.bigTrue2.pause();
    giraffeSound.bigTrue2.currentTime = 0;
    giraffeSound.bigTrue.pause();
    giraffeSound.bigTrue.currentTime = 0;

    currentCallback = () => { }
  }

  const stop = data => {
    const { name } = data;
    switch (name) {
      case S.error:
        soundError.pause();
        soundError.currentTime = 0;
        break;
      case S.win:
        soundWin.pause();
        soundWin.currentTime = 0;
        break;
      case S.click:
        soundClick.pause();
        soundClick.currentTime = 0;
        break;
      case S.boom:
        boom.pause();
        boom.currentTime = 0;
        break;
      case MS.yutu.bigTrue[0]:
        yutuSound.bigTrue.pause();
        yutuSound.bigTrue.currentTime = 0;
        break;
      case MS.yutu.bigTrue[1]:
        yutuSound.bigTrue2.pause();
        yutuSound.bigTrue2.currentTime = 0;
        break;
      case MS.yutu.bigFalse[0]:
        yutuSound.bigFalse.pause();
        yutuSound.bigFalse.currentTime = 0;
        break;
      case MS.yutu.bigFalse[1]:
        yutuSound.bigFalse2.pause();
        yutuSound.bigFalse2.currentTime = 0;
        break;
      case MS.yutu.smallTrue:
        yutuSound.smallTrue.pause();
        yutuSound.smallTrue.currentTime = 0;
        break;
      case MS.yutu.smallFalse:
        yutuSound.smallFalse.pause();
        yutuSound.smallFalse.currentTime = 0;
        break;
      case MS.giraffe.bigTrue[0]:
        giraffeSound.bigTrue.pause();
        giraffeSound.bigTrue.currentTime = 0;
        break;
      case MS.giraffe.bigTrue[1]:
        giraffeSound.bigTrue2.pause();
        giraffeSound.bigTrue2.currentTime = 0;
        break;
      case MS.giraffe.bigFalse[0]:
        giraffeSound.bigFalse.pause();
        giraffeSound.bigFalse.currentTime = 0;
        break;
      case MS.giraffe.bigFalse[1]:
        giraffeSound.bigFalse2.pause();
        giraffeSound.bigFalse2.currentTime = 0;
        break;
      case MS.giraffe.smallTrue:
        giraffeSound.smallTrue.pause();
        giraffeSound.smallTrue.currentTime = 0;
        break;
      case MS.giraffe.smallFalse:
        giraffeSound.smallFalse.pause();
        giraffeSound.smallFalse.currentTime = 0;
        break;
      case S.flip.base:
        flip.pause();
        flip.currentTime = 0;
        break;
      case S.flip.error:
        wrongFlip.pause();
        wrongFlip.currentTime = 0;
        break;
      case S.flip.right:
        rightFlip.pause();
        rightFlip.currentTime = 0;
        break;
    }
  }

  const play = data => {
    const { name, callback = () => { }, silence = false } = data;
    let sound = null;
    currentCallback = callback;
    switch (name) {
      case S.error:
        sound = soundError;
        break;
      case S.win:
        sound = soundWin;
        break;
      case S.click:
        sound = soundClick;
        break;
      case S.right:
        sound = soundRight;
        break;
      case S.fail:
        sound = soundFail;
        break;
      case S.boom:
        sound = boom;
        break;
      case MS.yutu.bigTrue[0]:
        sound = yutuSound.bigTrue;
        break;
      case MS.yutu.bigTrue[1]:
        sound = yutuSound.bigTrue2;
        break;
      case MS.yutu.bigFalse[0]:
        sound = yutuSound.bigFalse;
        break;
      case MS.yutu.bigFalse[1]:
        sound = yutuSound.bigFalse2;
        break;
      case MS.yutu.smallTrue:
        sound = yutuSound.smallTrue;
        break;
      case MS.yutu.smallFalse:
        sound = yutuSound.smallFalse;
        break;
      case MS.giraffe.bigTrue[0]:
        sound = giraffeSound.bigTrue;
        break;
      case MS.giraffe.bigTrue[1]:
        sound = giraffeSound.bigTrue2;
        break;
      case MS.giraffe.bigFalse[0]:
        sound = giraffeSound.bigFalse;
        break;
      case MS.giraffe.bigFalse[1]:
        sound = giraffeSound.bigFalse2;
        break;
      case MS.giraffe.smallTrue:
        sound = giraffeSound.smallTrue;
        break;
      case MS.giraffe.smallFalse:
        sound = giraffeSound.smallFalse;
        break;
      case S.flip.base:
        sound = flip;
        break;
      case S.flip.error:
        sound = wrongFlip;
        break;
      case S.flip.right:
        sound = rightFlip;
        break;
    }
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  return null;
}
