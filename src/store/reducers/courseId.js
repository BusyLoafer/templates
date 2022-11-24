const courseId = (state = 0, action) => {
  switch (action.type) {
    case 'SET_COURSE_ID':
      return action.value;
    default:
      return state;
  }
}
export default courseId;