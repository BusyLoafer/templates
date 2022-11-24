import { setConfetti, setLessonNext, setLessonReset, setLose, setWin } from "../store/actions";
import store from "../store";
import { lessonCompletion, onLessonReset } from "../components/MainComponent/Manager";

export const resetStates = (args = []) => {
  args.forEach(arg => {
    switch (arg) {
      case "reset":
        store.dispatch(setLessonReset(false));
        break;
      case "next":
        store.dispatch(setLessonNext(false));
        break;
      case "win":
        store.dispatch(setWin(false));
        break;
      case "confetti":
        store.dispatch(setConfetti(false));
        break;
      case "lose":
        store.dispatch(setLose(false));
        break;
      case "NRWC":
        store.dispatch(setLessonReset(false));
        store.dispatch(setLessonNext(false));
        store.dispatch(setConfetti(false));
        store.dispatch(setWin(false));
    }
  })
}

export const switchOnStates = (args = []) => {
  args.forEach(arg => {
    switch (arg) {
      case "reset":
        store.dispatch(setLessonReset(true));
        break;
      case "next":
        store.dispatch(setLessonNext(true));
        break;
      case "win":
        store.dispatch(setWin(true));
        break;
      case "confetti":
        store.dispatch(setConfetti(true));
        break;
      case "lose":
        store.dispatch(setLose(true));
      case "NRWC":
        store.dispatch(setLessonReset(true));
        store.dispatch(setLessonNext(true));
        store.dispatch(setConfetti(true));
        store.dispatch(setWin(true));
        break;
    }
  })
}

export const setFullWin = () => {
  store.dispatch(setWin(true));
  store.dispatch(setConfetti(true));
  lessonCompletion();
}

export const setFullLose = () => {
  store.dispatch(setWin(false));
  store.dispatch(setLessonNext(false));
  store.dispatch(setConfetti(false));
  onLessonReset();
}