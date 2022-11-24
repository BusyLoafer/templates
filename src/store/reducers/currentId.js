const currentId = (state = 0, action) => {
  switch (action.type) {
    case 'SET_CURRENT_ID':
      return action.value;
    default:
      return state;
  }
}
export default currentId;