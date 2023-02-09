import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbItem, Col, Row } from 'reactstrap';

function Breadcrumb(props) {
  const { title, breadcrumbItems } = props;
  const itemLength = breadcrumbItems.length;

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{title}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              {breadcrumbItems.map((item, key) => (
                <BreadcrumbItem key={Math.random()} active={key + 1 === itemLength}>
                  <Link to="#">{item.title}</Link>
                </BreadcrumbItem>
              ))}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
}

Breadcrumb.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  breadcrumbItems: PropTypes.array,
  title: PropTypes.string,
};

export default Breadcrumb;
