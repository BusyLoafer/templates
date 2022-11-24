const mascot = (state = "", action) => {
  switch (action.type) {
    case 'SET_MASCOT':
      return action.value;
    default:
      return state;
  }
}
export default mascot;