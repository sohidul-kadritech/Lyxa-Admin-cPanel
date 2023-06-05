import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { useGlobalContext } from '../../context';
import Login from '../../pages/Login';

export default function AuthLayout() {
  const { currentUser } = useGlobalContext();

  if (currentUser?.userType) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  let lastLoginType = '';

  if (localStorage.getItem('lastLoginType')) {
    lastLoginType = JSON.parse(localStorage.getItem('lastLoginType'));
  }

  const redirectPath =
    // eslint-disable-next-line prettier/prettier
    !lastLoginType || lastLoginType === 'seller' || lastLoginType === 'shop' ? '/login/business' : '/login/team';

  return (
    <Switch>
      <Route exact path="/login/business">
        <Login loginFor="business" />
      </Route>
      <Route exact path="/login/team">
        <Login loginFor="team" />
      </Route>
      <Route exact path="*">
        <Redirect to={{ pathname: redirectPath }} />
      </Route>
    </Switch>
  );
}
