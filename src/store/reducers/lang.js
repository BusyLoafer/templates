const lang = (state = "ru", action) => {
  switch (action.type) {
    case 'SET_LANG':
      return action.value;
    default:
      return state;
  }
}
export default lang;