import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Portals from '../../components/Portals';
import { useGlobalContext } from '../../context/GlobalContext';

function Authmiddleware({ component: Component, layout: Layout, isAuthProtected, ...rest }) {
  // const { account_type } = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { userType } = currentUser;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthProtected && !userType) {
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
