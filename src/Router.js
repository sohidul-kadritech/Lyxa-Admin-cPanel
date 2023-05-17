import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Authentication/Login';
import NewLogin from './pages/Login';
import Authmiddleware from './routes/middleware/Authmiddleware';

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/new-login">
          <NewLogin />
        </Route>
        <Route path="/">
          <Authmiddleware>
            <Layout />
          </Authmiddleware>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
