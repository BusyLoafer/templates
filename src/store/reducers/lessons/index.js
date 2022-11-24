const lessonCheck = (state = false, action) => {
  switch (action.type) {
    case 'SET_LESSON_CHECK':
      return action.value;
    default:
      return state;
  }
}

const lessonCount = (state = 0, action) => {
  switch (action.type) {
    case 'SET_LESSON_COUNT':
      return action.value;
    default:
      return state;
  }
}

const lessonId = (state = -1, action) => {
  switch (action.type) {
    case 'SET_LESSON_ID':
      return action.value;
    default:
      return state;
  }
}

const lessonNext = (state = false, action) => {
  switch (action.type) {
    case 'SET_LESSON_NEXT':
      if (action.value === undefined) {
        return false;
      }
      return action.value;
    default:
      return state;
  }
}

const lessonReset = (state = false, action) => {
  switch (action.type) {
    case 'SET_LESSON_RESET':
      return action.value;
    default:
      return state;
  }
}

const lessonStatus = (state = [], action) => {
  switch (action.type) {
    case 'SET_LESSON_STATUS':
      return action.value;
    default:
      return state;
  }
}

const maxLessonIndex = (state = 0, action) => {
  switch (action.type) {
    case 'SET_MAX_LESSON_INDEX':
      return action.value;
    default:
      return state;
  }
}

const currentExDone = (state = false, action) => {
  switch (action.type) {
    case 'SET_CURRENT_EX_DONE':
      return action.value;
    default:
      return state;
  }
}

export {lessonCheck, lessonCount, lessonId, lessonNext, lessonReset, lessonStatus, maxLessonIndex, currentExDone}