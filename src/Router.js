import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Authmiddleware from './routes/middleware/Authmiddleware';

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login/team">
          <Login loginFor="team" />
        </Route>
        {/* <Route exact path="/login/old">
          <LoginOld />
        </Route> */}
        <Route exact path="/login/business">
          <Login loginFor="business" />
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
