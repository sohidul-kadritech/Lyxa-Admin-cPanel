import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

// Redux Store
import { showRightSidebarAction, toggleLeftmenu } from '../../store/actions';
// reactstrap

// Import menuDropdown
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
// import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

// i18n

// import images
import logodarkImg from '../../assets/images/logo-dark.png';
import logolightImg from '../../assets/images/logo-light.png';
import { logoSvg } from '../../assets/staticData';

function Header({ toggleLeftmenu, leftMenu }) {
  // eslint-disable-next-line no-unused-vars
  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box">
            <Link to="/dashboard" className="logo logo-dark">
              <span className="logo-sm">
                {/* <img src={logoSvg} alt="" height="22" /> */}
                {logoSvg}
              </span>
              <span className="logo-lg">
                <img src={logodarkImg} alt="" height="17" />
              </span>
            </Link>

            <Link to="/dashboard" className="logo logo-light">
              <span className="logo-sm">
                {/* <img src= alt="" height="22" /> */}
                {logoSvg}
              </span>
              <span className="logo-lg">
                <img src={logolightImg} alt="" height="18" />
              </span>
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleLeftmenu(!leftMenu);
            }}
            className="btn btn-sm me-2 font-size-24 d-lg-none header-item waves-effect waves-light"
            id="vertical-menu-btn"
          >
            <i className="mdi mdi-menu"></i>
          </button>
        </div>
        <div className="d-flex">
          <NotificationDropdown />
          {/* <ProfileMenu /> */}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  leftMenu: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(Header);
