import { SCALE } from "../../lib/const";

const btnSizeCoef = (state = SCALE.btnTablet, action) => {
  switch (action.type) {
    case 'SET_BTN_SICE_COEF':
      return action.value;
    default:
      return state;
  }
}
export default btnSizeCoef;