const exercises = (state = [], action) => {
  switch (action.type) {
    case 'SET_EXERCISES':
      return action.value;
    default:
      return state;
  }
}
export default exercises;