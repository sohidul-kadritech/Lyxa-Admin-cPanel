import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import { apiError, logoutUserSuccess } from './actions';
import { LOGOUT_USER } from './actionTypes';

// Include Both Helper File with needed methods
import { getFirebaseBackend } from '../../../helpers/firebase_helper';

const fireBaseBackend = getFirebaseBackend();

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem('authUser');

    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(response));
    }
    history.push('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
