const baseViewSize = (state = {width: 0, height: 0}, action) => {
  switch (action.type) {
    case 'SET_BASE_VIEW_SIZE':
      return action.value;
    default:
      return state;
  }
}
export default baseViewSize;