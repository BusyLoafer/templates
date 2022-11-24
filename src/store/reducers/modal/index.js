const activeModal = (state = false, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_MODAL':
      return action.value;
    default:
      return state;
  }
}

const textModal = (state = "", action) => {
  switch (action.type) {
    case 'SET_TEXT_MODAL':
      return action.value;
    default:
      return state;
  }
}
export {activeModal, textModal};