/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbItem, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner } from 'reactstrap';

function Breadcrumb({ breadcrumbItem, maintitle, title, loading, callBanner, lisener }) {
  // const [bannerViewStyle, setBannerViewStyle] = useState(
  //   localStorage.getItem('bannerView') ? localStorage.getItem('bannerView') : 'list'
  // );
  const [bannerViewStyle, setBannerViewStyle] = useState('list');

  const [setting_Menu, setsetting_Menu] = useState(false);

  const changeStyle = (view) => {
    localStorage.setItem('bannerView', view);
    setBannerViewStyle(view);
    lisener(view);
  };

  return (
    <Row className="align-items-center">
      <Col sm={6}>
        <div className="page-title-box">
          <h4 className="font-size-18">{breadcrumbItem}</h4>
          <ol className="breadcrumb mb-0">
            {maintitle ? (
              <BreadcrumbItem>
                <Link to="/#">{maintitle}</Link>
              </BreadcrumbItem>
            ) : (
              ''
            )}
            {title && (
              <BreadcrumbItem>
                <Link to="/#">{title}</Link>
              </BreadcrumbItem>
            )}

            <BreadcrumbItem active>{breadcrumbItem}</BreadcrumbItem>
          </ol>
        </div>
      </Col>
      <Col sm={6}>
        <div className="d-flex justify-content-end align-items-center">
          <div className="d-flex">
            <div className="me-4 d-flex align-items-center cursor-pointer" onClick={() => callBanner(true)}>
              {loading ? (
                <Spinner animation="border" variant="info" style={{ width: '20px', height: '20px' }} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  width="20px"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
            </div>

            <Dropdown
              // isOpen={setting_Menu}
              toggle={() => {
                lisener();
                setsetting_Menu(!setting_Menu);
              }}
            >
              <DropdownToggle color="primary" className="btn btn-primary dropdown-toggle waves-effect waves-light">
                {bannerViewStyle === 'list' ? (
                  <i className="mdi mdi- me-2">---</i>
                ) : (
                  <i className="mdi mdi-grid me-2"></i>
                )}{' '}
                Add
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => changeStyle('list')} tag="a" href="#">
                  <i className="mdi mdi-arrow me-2">---</i> Style 1
                </DropdownItem>
                <DropdownItem onClick={() => changeStyle('grid')} tag="a" href="#">
                  <i className="mdi mdi-grid me-2"></i>Style 2
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </Col>
    </Row>
  );
}

Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string,
};

export default Breadcrumb;
