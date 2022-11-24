const completedLesson = (state = 0, action) => {
  switch (action.type) {
    case 'SET_COMPLETED_LESSON':
      return action.value;
    default:
      return state;
  }
}
export default completedLesson;