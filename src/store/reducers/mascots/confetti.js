const confetti = (state = false, action) => {
  switch (action.type) {
    case 'SET_CONFETTI':
      return action.value;
    default:
      return state;
  }
}
export default confetti;