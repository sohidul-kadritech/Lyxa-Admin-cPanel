import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';

// SimpleBar
import SimpleBar from 'simplebar-react';

import { Link } from 'react-router-dom';
import {
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  showRightSidebarAction,
} from '../../store/actions';

import './rightbar.scss';
// Import images
import layout1 from '../../assets/images/layouts/layout-1.jpg';
import layout2 from '../../assets/images/layouts/layout-2.jpg';
import layout3 from '../../assets/images/layouts/layout-3.jpg';

function RightSidebar({
  showRightSidebarAction,
  layoutType,
  changeLayout,
  layoutWidth,
  topbarTheme,
  leftSideBarType,
  leftSideBarTheme,
}) {
  return (
    <>
      <div className="right-bar">
        <SimpleBar style={{ height: '900px' }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  showRightSidebarAction(false);
                }}
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close noti-icon" />
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>

            <hr className="my-0" />

            <div className="p-4">
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts</span>
                <input
                  type="radio"
                  id="radioVertical"
                  name="radioFruit"
                  value="vertical"
                  checked={layoutType === 'vertical'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayout(e.target.value);
                    }
                  }}
                />
                <label htmlFor="radioVertical">Vertical</label>
                {'   '}
                <input
                  type="radio"
                  id="radioHorizontal"
                  name="radioFruit"
                  value="horizontal"
                  checked={layoutType === 'horizontal'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayout(e.target.value);
                    }
                  }}
                />
                <label htmlFor="radioHorizontal">Horizontal</label>
              </div>

              <hr className="mt-1" />

              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">
                  Layout Width
                </span>
                <input
                  type="radio"
                  id="radioFluid"
                  name="radioWidth"
                  value="fluid"
                  checked={layoutWidth === 'fluid'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayoutWidth(e.target.value);
                    }
                  }}
                />{' '}
                <label htmlFor="radioFluid">Fluid</label>
                {'   '}
                <input
                  type="radio"
                  id="radioBoxed"
                  name="radioWidth"
                  value="boxed"
                  checked={layoutWidth === 'boxed'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayoutWidth(e.target.value);
                    }
                  }}
                />{' '}
                <label htmlFor="radioBoxed">Boxed</label>
              </div>
              <hr className="mt-1" />

              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">
                  Topbar Theme
                </span>
                <input
                  type="radio"
                  id="radioThemeLight"
                  name="radioTheme"
                  value="light"
                  checked={topbarTheme === 'light'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeTopbarTheme(e.target.value);
                    }
                  }}
                />
                <label htmlFor="radioThemeLight">Light</label>
                {'   '}
                <input
                  type="radio"
                  id="radioThemeDark"
                  name="radioTheme"
                  value="dark"
                  checked={topbarTheme === 'dark'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeTopbarTheme(e.target.value);
                    }
                  }}
                />

                <label htmlFor="radioThemeDark">Dark</label>
                {'   '}
              </div>

              {layoutType === 'vertical' ? (
                <>
                  <hr className="mt-1" />
                  <div className="radio-toolbar">
                    <span className="mb-2 d-block" id="radio-title">
                      Left Sidebar Type{' '}
                    </span>
                    <input
                      type="radio"
                      id="sidebarDefault"
                      name="sidebarType"
                      value="default"
                      checked={leftSideBarType === 'default'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarType(e.target.value);
                        }
                      }}
                    />
                    <label htmlFor="sidebarDefault">Default</label>
                    {'   '}
                    <input
                      type="radio"
                      id="sidebarCompact"
                      name="sidebarType"
                      value="compact"
                      checked={leftSideBarType === 'compact'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarType(e.target.value);
                        }
                      }}
                    />
                    <label htmlFor="sidebarCompact">Compact</label>
                    {'   '}
                    <input
                      type="radio"
                      id="sidebarIcon"
                      name="sidebarType"
                      value="icon"
                      checked={leftSideBarType === 'icon'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarType(e.target.value);
                        }
                      }}
                    />
                    <label htmlFor="sidebarIcon">Icon</label>
                  </div>

                  <hr className="mt-1" />

                  <div className="radio-toolbar">
                    <span className="mb-2 d-block" id="radio-title">
                      Left Sidebar Color
                    </span>
                    <input
                      type="radio"
                      id="leftsidebarThemelight"
                      name="leftsidebarTheme"
                      value="light"
                      checked={leftSideBarTheme === 'light'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarTheme(e.target.value);
                        }
                      }}
                    />

                    <label htmlFor="leftsidebarThemelight">Light</label>
                    {'   '}
                    <input
                      type="radio"
                      id="leftsidebarThemedark"
                      name="leftsidebarTheme"
                      value="dark"
                      checked={leftSideBarTheme === 'dark'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarTheme(e.target.value);
                        }
                      }}
                    />

                    <label htmlFor="leftsidebarThemedark">Dark</label>
                    {'   '}
                    <input
                      type="radio"
                      id="leftsidebarThemecolored"
                      name="leftsidebarTheme"
                      value="colored"
                      checked={leftSideBarTheme === 'colored'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarTheme(e.target.value);
                        }
                      }}
                    />

                    <label htmlFor="leftsidebarThemecolored">Colored</label>
                  </div>
                  <hr className="mt-1" />
                </>
              ) : null}

              <h6 className="text-center">Choose Layouts</h6>

              <div className="mb-2">
                <Link to="//veltrix-v.react.themesbrand.com" target="_blank">
                  <img src={layout1} className="img-fluid img-thumbnail" alt="" />
                </Link>
              </div>

              <div className="mb-2">
                <Link to="//veltrix-v-dark.react.themesbrand.com" target="_blank">
                  <img src={layout2} className="img-fluid img-thumbnail" alt="" />
                </Link>
              </div>

              <div className="mb-2">
                <Link to="//veltrix-v-rtl.react.themesbrand.com" target="_blank">
                  <img src={layout3} className="img-fluid img-thumbnail" alt="" />
                </Link>
              </div>

              <Link to="#" className="btn btn-primary btn-block mt-3" target="_blank">
                <i className="mdi mdi-cart ms-1" /> Purchase Now
              </Link>
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay" />
    </>
  );
}

RightSidebar.propTypes = {
  changeLayout: PropTypes.func,
  layoutType: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  topbarTheme: PropTypes.any,
};

const mapStateToProps = (state) => ({ ...state.Layout });

export default connect(mapStateToProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeLayoutWidth,
  changeTopbarTheme,
  showRightSidebarAction,
})(RightSidebar);
