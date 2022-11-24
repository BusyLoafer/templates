const mascotSettings = (state = null, action) => {
  switch (action.type) {
    case 'SET_MASCOT_SETTINGS':
      return action.value;
    default:
      return state;
  }
}
export default mascotSettings;