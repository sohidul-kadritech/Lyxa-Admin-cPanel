/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';

function CardMaintenance(props) {
  return (
    <Col md="4" className="text-center">
      <Card className="mt-4 maintenance-box">
        <CardBody>{props.children}</CardBody>
      </Card>
    </Col>
  );
}

CardMaintenance.propTypes = {
  children: PropTypes.any,
};

export default CardMaintenance;
