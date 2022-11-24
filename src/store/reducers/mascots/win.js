const win = (state = false, action) => {
  switch (action.type) {
    case 'SET_WIN':
      return action.value;
    default:
      return state;
  }
}
export default win;