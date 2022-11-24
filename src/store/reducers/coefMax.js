const coefMax = (state = 1, action) => {
  switch (action.type) {
    case 'SET_COEF_MAX':
      return action.value;
    default:
      return state;
  }
}
export default coefMax;