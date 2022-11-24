const allImages = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ALL_IMAGES':
      return action.value;
    default:
      return state;
  }
}
export default allImages;