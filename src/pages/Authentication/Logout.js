import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logoutUser } from '../../store/actions';

function Logout({ logoutUser, history }) {
  useEffect(() => {
    logoutUser(history);
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

Logout.propTypes = {
  history: PropTypes.object,
  logoutUser: PropTypes.func,
};

export default withRouter(connect(null, { logoutUser })(Logout));
