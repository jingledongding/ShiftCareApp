import * as effects from 'redux-saga/effects';

function* rootSaga() {
  yield effects.take('never-come');
}

export default rootSaga;