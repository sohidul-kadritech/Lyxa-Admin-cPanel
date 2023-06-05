import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
// import LoginOld from './pages/Authentication/Login';
import AuthLayout from './routes/middleware/AuthLayout';
import Authmiddleware from './routes/middleware/Authmiddleware';

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <AuthLayout />
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
