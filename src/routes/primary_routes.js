import Layout from '../components/Layout';
import Login from '../pages/Authentication/Login';

export const primary_routes = [
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/',
    component: Layout,
  },
];
