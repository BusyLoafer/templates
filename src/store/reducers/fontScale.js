const fontScale = (state = 1, action) => {
  switch (action.type) {
    case 'SET_FONT_SCALE':
      return action.value;
    default:
      return state;
  }
}
export default fontScale;