import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import { userForgetPasswordError, userForgetPasswordSuccess } from './actions';
import { FORGET_PASSWORD } from './actionTypes';

// Include Both Helper File with needed methods
import { postFakeForgetPwd, postJwtForgetPwd } from '../../../helpers/fakebackend_helper';
import { getFirebaseBackend } from '../../../helpers/firebase_helper';

const fireBaseBackend = getFirebaseBackend();

// If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const response = yield call(fireBaseBackend.forgetPassword, user.email);
      if (response) {
        yield put(userForgetPasswordSuccess('Reset link are sended to your mailbox, check there first'));
      }
    } else if (process.env.REACT_APP_DEFAULTAUTH === 'jwt') {
      const response = yield call(postJwtForgetPwd, '/jwt-forget-pwd', {
        email: user.email,
      });
      if (response) {
        yield put(userForgetPasswordSuccess('Reset link are sended to your mailbox, check there first'));
      }
    } else {
      const response = yield call(postFakeForgetPwd, '/fake-forget-pwd', {
        email: user.email,
      });
      if (response) {
        yield put(userForgetPasswordSuccess('Reset link are sended to your mailbox, check there first'));
      }
    }
  } catch (error) {
    yield put(userForgetPasswordError(error));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
}

export default forgetPasswordSaga;
