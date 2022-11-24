const btnAction = (state = "", action) => {
  switch (action.type) {
    case 'SET_BTN_ACTION':
      return action.value;
    default:
      return state;
  }
}
export default btnAction;