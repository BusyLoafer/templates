const playing = (state = false, action) => {
  switch (action.type) {
    case 'SET_PLAYING':
      return action.value;
    default:
      return state;
  }
}
export default playing;