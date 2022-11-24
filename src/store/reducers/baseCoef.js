const baseCoef = (state = 1, action) => {
  switch (action.type) {
    case 'SET_BASE_COEF':
      return action.value;
    default:
      return state;
  }
}
export default baseCoef;