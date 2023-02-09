import { all, fork } from 'redux-saga/effects';

// public
import ForgetSaga from './auth/forgetpwd/saga';
import AuthSaga from './auth/login/saga';
import ProfileSaga from './auth/profile/saga';
import AccountSaga from './auth/register/saga';
import calendarSaga from './calendar/saga';
import LayoutSaga from './layout/saga';

export default function* rootSaga() {
  yield all([AccountSaga(), fork(AuthSaga), ProfileSaga(), ForgetSaga(), LayoutSaga(), fork(calendarSaga)]);
}
