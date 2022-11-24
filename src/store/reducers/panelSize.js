import { PANEL_SIZE } from "../../lib/const";

const panelSize = (state = PANEL_SIZE, action) => {
  switch (action.type) {
    case 'SET_PANEL_SIZE':
      return action.value;
    default:
      return state;
  }
}
export default panelSize;