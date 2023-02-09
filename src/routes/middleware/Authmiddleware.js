import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Portals from '../../components/Portals';

function Authmiddleware({ component: Component, layout: Layout, isAuthProtected, ...rest }) {
  const { account_type } = useSelector((store) => store.Login.admin);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthProtected && !account_type) {
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        }
        return (
          <>
            <Layout>
              <Component {...props} />
            </Layout>
            <Portals />
          </>
        );
      }}
    />
  );
}

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes?.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default Authmiddleware;
