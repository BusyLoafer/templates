const lose = (state = false, action) => {
  switch (action.type) {
    case 'SET_LOSE':
      return action.value;
    default:
      return state;
  }
}
export default lose;