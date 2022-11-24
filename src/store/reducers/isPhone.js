const isPhone = (state = false, action) => {
  switch (action.type) {
    case 'SET_IS_PHONE':
      return action.value;
    default:
      return state;
  }
}

export default isPhone;