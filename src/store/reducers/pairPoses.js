const pairPoses = (state = null, action) => {
  switch (action.type) {
    case 'SET_PAIR_POSES':
      return action.value;
    default:
      return state;
  }
}
const rowPoses = (state = null, action) => {
  switch (action.type) {
    case 'SET_ROW_POSES':
      return action.value;
    default:
      return state;
  }
}

export default {pairPoses, rowPoses};