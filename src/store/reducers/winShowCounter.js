import { WIN_SHOW_MAX_COUNT } from "../../lib/const";

const winShowCounter = (state = WIN_SHOW_MAX_COUNT - 1, action) => {
  switch (action.type) {
    case 'SET_WIN_SHOW_COUNTER':
      return action.value;
    default:
      return state;
  }
}
export default winShowCounter;