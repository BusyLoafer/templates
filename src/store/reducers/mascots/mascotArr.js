const mascotArr = (state = [], action) => {
  switch (action.type) {
    case 'SET_MASCOT_ARR':
      return action.value;
    default:
      return state;
  }
}
export default mascotArr;