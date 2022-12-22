export const protectRoute = () => {
  return (next) => {
    if (localStorage.getItem("token")) {
      next();
    } else {
      next("/login");
    }
  };
};
