import React from 'react';

import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';

import ApexRadial from './ApexRadial';

function MonthlyEarning() {
  return (
    <>
      {' '}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Monthly Earning</CardTitle>
          <Row>
            <Col sm="6">
              <p className="text-muted">This month</p>
              <h3>$34,252</h3>
              <p className="text-muted">
                <span className="text-success me-2">
                  {' '}
                  12% <i className="mdi mdi-arrow-up"></i>{' '}
                </span>{' '}
                From previous period
              </p>
              <div className="mt-4">
                <Link to="" className="btn btn-primary waves-effect waves-light btn-sm">
                  View More <i className="mdi mdi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col sm="6">
              <div className="mt-4 mt-sm-0">
                <ApexRadial />
              </div>
            </Col>
          </Row>
          <p className="text-muted mb-0">We craft digital, graphic and dimensional thinking.</p>
        </CardBody>
      </Card>
    </>
  );
}

export default MonthlyEarning;
