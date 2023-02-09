import classname from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Col, Collapse, Row } from 'reactstrap';

// i18n
import { withTranslation } from 'react-i18next';

import { connect } from 'react-redux';

function Navbar({ location, leftMenu, t, menuOpen }) {
  const [ui, setui] = useState(false);

  const [email, setemail] = useState(false);

  const [component, setcomponent] = useState(false);
  const [form, setform] = useState(false);
  const [table, settable] = useState(false);
  const [chart, setchart] = useState(false);
  const [icon, seticon] = useState(false);
  const [map, setmap] = useState(false);
  const [extra, setextra] = useState(false);
  const [auth, setauth] = useState(false);

  function activateParentDropdown(item) {
    item.classList.add('active');
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add('active'); // li
      const parent2 = parent.parentElement;
      parent2.classList.add('active'); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add('active'); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add('active'); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add('active'); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add('active'); // li
            }
          }
        }
      }
    }
    return false;
  }

  useEffect(() => {
    let matchingMenuItem = null;
    const ul = document.getElementById('navigation');
    const items = ul.getElementsByTagName('a');
    for (let i = 0; i < items.length; ++i) {
      if (location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });

  return (
    <div className="topnav">
      <div className="container-fluid">
        <nav className="navbar navbar-light navbar-expand-lg topnav-menu" id="navigation">
          <Collapse isOpen={leftMenu} className="navbar-collapse" id="topnav-menu-content">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="dashboard">
                  <i className="ti-home me-2" />
                  {t('Dashboard')} {menuOpen}
                </Link>
              </li>

              <li className="nav-item dropdown mega-dropdown">
                <Link
                  to="/#"
                  onClick={(e) => {
                    e.preventDefault();
                    setui(!ui);
                  }}
                  className="nav-link dropdown-toggle arrow-none"
                >
                  <i className="ti-package me-2"></i>
                  {t('UI Elements')}
                </Link>
                <div
                  className={classname(
                    // eslint-disable-next-line max-len
                    'dropdown-menu mega-dropdown-menu px-2 dropdown-menu-start dropdown-mega-menu-xl',
                    { show: ui }
                  )}
                >
                  <Row>
                    <Col lg={4}>
                      <div>
                        <Link to="ui-alerts" className="dropdown-item">
                          {t('Alerts')}
                        </Link>
                        <Link to="ui-buttons" className="dropdown-item">
                          {t('Buttons')}
                        </Link>
                        <Link to="ui-cards" className="dropdown-item">
                          {t('Cards')}
                        </Link>
                        <Link to="ui-carousel" className="dropdown-item">
                          {t('Carousel')}
                        </Link>
                        <Link to="ui-dropdowns" className="dropdown-item">
                          {t('Dropdowns')}
                        </Link>
                        <Link to="ui-grid" className="dropdown-item">
                          {t('Grid')}
                        </Link>
                        <Link to="ui-images" className="dropdown-item">
                          {t('Images')}
                        </Link>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div>
                        <Link to="ui-lightbox" className="dropdown-item">
                          {t('Lightbox')}
                        </Link>
                        <Link to="ui-modals" className="dropdown-item">
                          {t('Modals')}
                        </Link>
                        <Link to="ui-rangeslider" className="dropdown-item">
                          {t('Range Slider')}
                        </Link>
                        <Link to="ui-session-timeout" className="dropdown-item">
                          {t('Session Timeout')}
                        </Link>
                        <Link to="ui-progressbars" className="dropdown-item">
                          {t('Progress Bars')}
                        </Link>
                        <Link to="ui-sweet-alert" className="dropdown-item">
                          {t('Sweet-Alert')}
                        </Link>
                        <Link to="ui-tabs-accordions" className="dropdown-item">
                          {t('Tabs & Accordions')}
                        </Link>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div>
                        <Link to="ui-typography" className="dropdown-item">
                          {t('Typography')}
                        </Link>
                        <Link to="ui-video" className="dropdown-item">
                          {t('Video')}
                        </Link>
                        <Link to="ui-general" className="dropdown-item">
                          {t('General')}
                        </Link>
                        <Link to="ui-colors" className="dropdown-item">
                          {t('Colors')}
                        </Link>
                        <Link to="ui-rating" className="dropdown-item">
                          {t('Rating')}
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </div>
              </li>

              <li className="nav-item dropdown">
                <Link
                  to="/#"
                  className="nav-link dropdown-toggle arrow-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setcomponent(!component);
                  }}
                >
                  <i className="ti-harddrives me-2"></i>
                  {t('Components')}
                </Link>
                <div className={classname('dropdown-menu', { show: component })}>
                  <div className="dropdown">
                    <Link
                      to="/#"
                      className="dropdown-item dropdown-toggle arrow-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setemail(!email);
                      }}
                    >
                      {t('Email')} <div className="arrow-down"></div>
                    </Link>
                    <div className={classname('dropdown-menu', { show: email })}>
                      <Link to="email-inbox" className="dropdown-item">
                        {t('Inbox')}
                      </Link>
                      <Link to="email-read" className="dropdown-item">
                        {t('Read Email')}
                      </Link>
                      <Link to="/email-compose" className="dropdown-item">
                        {t('Email Compose')}{' '}
                      </Link>
                    </div>
                  </div>
                  <Link to="calendar" className="dropdown-item">
                    {t('Calendar')}
                  </Link>
                  <div className="dropdown">
                    <Link
                      to="/#"
                      className="dropdown-item dropdown-toggle arrow-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setform(!form);
                      }}
                    >
                      {t('Forms')} <div className="arrow-down"></div>
                    </Link>
                    <div className={classname('dropdown-menu', { show: form })}>
                      <Link to="form-elements" className="dropdown-item">
                        {t('Form Elements')}
                      </Link>
                      <Link to="form-layouts" className="dropdown-item">
                        {t('Form Layouts')}
                      </Link>
                      <Link to="form-validation" className="dropdown-item">
                        {t('Form Validation')}
                      </Link>
                      <Link to="form-advanced" className="dropdown-item">
                        {t('Form Advanced')}
                      </Link>
                      <Link to="form-editors" className="dropdown-item">
                        {t('Form Editors')}
                      </Link>
                      <Link to="form-uploads" className="dropdown-item">
                        {t('Form File Upload')}{' '}
                      </Link>
                      <Link to="form-xeditable" className="dropdown-item">
                        {t('Form Xeditable')}
                      </Link>
                      <Link to="form-repeater" className="dropdown-item">
                        {t('Form Repeater')}
                      </Link>
                      <Link to="form-wizard" className="dropdown-item">
                        {t('Form Wizard')}
                      </Link>
                      <Link to="form-mask" className="dropdown-item">
                        {t('Form Mask')}
                      </Link>
                    </div>
                  </div>
                  <div className="dropdown">
                    <Link
                      to="/#"
                      className="dropdown-item dropdown-toggle arrow-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setchart(!chart);
                      }}
                    >
                      {t('Charts')} <div className="arrow-down"></div>
                    </Link>
                    <div className={classname('dropdown-menu', { show: chart })}>
                      <Link to="chartist-charts" className="dropdown-item">
                        {' '}
                        {t('Chartjs Chart')}
                      </Link>

                      <Link to="e-charts" className="dropdown-item">
                        {' '}
                        {t('E Chart')}
                      </Link>

                      <Link to="/chartjs-charts" className="dropdown-item">
                        {' '}
                        {t('Chartjs Chart')}
                      </Link>

                      <Link to="apex-charts" className="dropdown-item">
                        {' '}
                        {t('Apex charts')}
                      </Link>

                      <Link to="sparkline-charts" className="dropdown-item">
                        {' '}
                        {t('Sparkline Chart')}
                      </Link>
                    </div>
                  </div>

                  <div className="dropdown">
                    <Link
                      to="/#"
                      className="dropdown-item dropdown-toggle arrow-none"
                      onClick={(e) => {
                        e.preventDefault();
                        settable(!table);
                      }}
                    >
                      {t('Tables')} <div className="arrow-down"></div>
                    </Link>
                    <div className={classname('dropdown-menu', { show: table })}>
                      <Link to="tables-basic" className="dropdown-item">
                        {t('Basic Tables')}
                      </Link>
                      <Link to="tables-datatable" className="dropdown-item">
                        {t('Data Tables')}
                      </Link>
                      <Link to="tables-responsive" className="dropdown-item">
                        {t('Responsive Table')}
                      </Link>
                      <Link to="tables-editable" className="dropdown-item">
                        {t('Editable Table')}
                      </Link>
                    </div>
                  </div>
                  <div className="dropdown">
                    <Link
                      to="/#"
                      className="dropdown-item dropdown-toggle arrow-none"
                      onClick={(e) => {
                        e.preventDefault();
                        seticon(!icon);
                      }}
                    >
                      {t('Icons')} <div className="arrow-down"></div>
                    </Link>
                    <div className={classname('dropdown-menu', { show: icon })}>
                      <Link to="icons-materialdesign" className="dropdown-item">
                        {t('Material Design')}
                      </Link>
                      <Link to="icons-fontawesome" className="dropdown-item">
                        {t('Font awesome')}{' '}
                      </Link>

                      <Link to="/icons-ion" className="dropdown-item">
                        Ion Icons
                      </Link>

                      <Link to="/icons-themify" className="dropdown-item">
                        Themify Icons
                      </Link>

                      <Link to="icons-dripicons" className="dropdown-item">
                        {t('Dripicons')}
                      </Link>

                      <Link to="/icons-typicons" className="dropdown-item">
                        Typicons Icons
                      </Link>
                    </div>
                  </div>
                  <div className="dropdown">
                    <Link
                      to="/#"
                      className="dropdown-item dropdown-toggle arrow-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setmap(!map);
                      }}
                    >
                      {t('Maps')} <div className="arrow-down"></div>
                    </Link>
                    <div className={classname('dropdown-menu', { show: map })}>
                      <Link to="maps-google" className="dropdown-item">
                        {t('Google Maps')}{' '}
                      </Link>
                      <Link to="maps-vector" className="dropdown-item">
                        {t('Vector Maps')}{' '}
                      </Link>
                      <Link to="maps-leaflet" className="dropdown-item">
                        {t('Leaflet Maps')}{' '}
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item dropdown mega-dropdown">
                <Link
                  to="/#"
                  className="nav-link dropdown-toggle arrow-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setauth(!auth);
                  }}
                >
                  <i className="ti-archive me-2"></i> {t('Authentication')}
                </Link>
                <div
                  className={classname('dropdown-menu mega-dropdown-menu px-2 dropdown-mega-menu-lg', { show: auth })}
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <div>
                        <Link to="pages-login" className="dropdown-item">
                          {t('Login')}
                        </Link>
                        <Link to="pages-register" className="dropdown-item">
                          {t('Register')}
                        </Link>
                        <Link to="page-recoverpw" className="dropdown-item">
                          {t('Recover Password')}
                        </Link>
                        <Link to="auth-lock-screen" className="dropdown-item">
                          {t('Lock Screen')}
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div>
                        <Link to="pages-login-2" className="dropdown-item">
                          {t('Login 2')}
                        </Link>
                        <Link to="pages-register-2" className="dropdown-item">
                          {t('Register 2')}
                        </Link>
                        <Link to="page-recoverpw-2" className="dropdown-item">
                          {t('Recover Password 2')}
                        </Link>
                        <Link to="auth-lock-screen-2" className="dropdown-item">
                          {t('Lock Screen 2')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setextra(!extra);
                  }}
                >
                  <i className="ti-support me-2"></i> {t('Extra pages')}
                </Link>

                <div
                  className={classname('dropdown-menu mega-dropdown-menu px-2 dropdown-mega-menu-lg', {
                    show: extra,
                  })}
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <div>
                        <Link to="pages-timeline" className="dropdown-item">
                          {t('Timeline')}
                        </Link>
                        <Link to="pages-starter" className="dropdown-item">
                          {t('Starter Page')}
                        </Link>
                        <Link to="pages-directory" className="dropdown-item">
                          {t('Directory')}
                        </Link>
                        <Link to="pages-404" className="dropdown-item">
                          {t('Error 404')}
                        </Link>
                        <Link to="pages-500" className="dropdown-item">
                          {t('Error 500')}
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div>
                        <Link to="pages-pricing" className="dropdown-item">
                          {t('Pricing')}
                        </Link>
                        <Link to="pages-gallery" className="dropdown-item">
                          {t('Gallery')}
                        </Link>
                        <Link to="pages-maintenance" className="dropdown-item">
                          {t('Maintenance')}
                        </Link>
                        <Link to="pages-comingsoon" className="dropdown-item">
                          {t('Coming Soon')}
                        </Link>
                        <Link to="pages-faqs" className="dropdown-item">
                          {t('FAQs')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="#"
                  id="topnav-emailtemplates"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setemail(!email);
                  }}
                >
                  <i className="ti-bookmark-alt me-2"></i>Email Templates
                </Link>
                <div
                  className={classname('dropdown-menu', {
                    show: email,
                  })}
                  aria-labelledby="topnav-emailtemplates"
                >
                  <Link to="email-template-basic" className="dropdown-item">
                    {t('Basic Action')}
                  </Link>
                  <Link to="email-template-alert" className="dropdown-item">
                    {t('Alert Email')}
                  </Link>
                  <Link to="email-template-billing" className="dropdown-item">
                    {t('Billing Email')}
                  </Link>
                </div>
              </li>
            </ul>
          </Collapse>
        </nav>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(connect(mapStatetoProps, {})(withTranslation()(Navbar)));
