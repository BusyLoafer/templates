// import './sass/index.scss'
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './store'
import MainComponent from './components/MainComponent/MainComponent';
import { setCourseId } from './store/actions';

const Templates = props => {

  const { data, onExit, courseId, lessonTitle } = props;

  if (!data) return null

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (data) {
      const less = "{\"exercises\":" + data.exercises_json + "}";
      setLesson(less)
    }
  }, [data])


  return (
    <div className="App" id="app-template">

      <Provider store={store}>
        <MainComponent
          courseId={courseId}
          data={lesson}
          lessonTitle={lessonTitle}
          onExit={onExit}
        />
      </Provider>

    </div>
  );
}

export default App;