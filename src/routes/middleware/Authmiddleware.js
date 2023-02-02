import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import Portals from "../../components/Portals";
import { useSelector } from "react-redux";

const Authmiddleware = ({ component: Component, layout: Layout, isAuthProtected, ...rest }) => {
  const {account_type} = useSelector((store) => store.Login.admin)
  
  return <Route
    {...rest}
    render={(props) => {
      if (isAuthProtected && !account_type) {
        return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
      } else {
        return (
          <React.Fragment>
            <Layout>
              <Component {...props} />
            </Layout>
            <Portals/>
          </React.Fragment>
        );
      }
    }}
  />
};

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes?.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default Authmiddleware;
