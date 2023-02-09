/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable class-methods-use-this */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class NonAuthLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.capitalizeFirstLetter.bind(this);
  }

  capitalizeFirstLetter = (string) => string.charAt(1).toUpperCase() + string.slice(2);

  render() {
    return <>{this.props.children}</>;
  }
}

NonAuthLayout.propTypes = {
  children: PropTypes.any,
};

export default withRouter(NonAuthLayout);
