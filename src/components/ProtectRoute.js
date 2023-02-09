export const protectRoute = () => (next) => {
  if (localStorage.getItem('token')) {
    next();
  } else {
    next('/login');
  }
};
