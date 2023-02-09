import React from 'react';
import { connect, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

// Import menuDropdown
import { withTranslation } from 'react-i18next';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

// eslint-disable-next-line import/no-named-default
import { default as logodarkImg, default as logolightImg } from '../../assets/images/lyxa.svg';

import { logoSvg } from '../../assets/staticData';

// i18n

// Redux Store
import { changeSidebarType, showRightSidebarAction, toggleLeftmenu } from '../../store/actions';

function Header() {
  const { account_type } = useSelector((store) => store.Login.admin);

  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

  function tToggle() {
    const { body } = document;
    if (window.screen.width <= 992) {
      body.classList.toggle('sidebar-enable');
    } else {
      body.classList.toggle('vertical-collpsed');
      body.classList.toggle('sidebar-enable');
    }
  }

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box">
            <Link to="/" className="logo logo-dark">
              <span className="logo-sm">{logoSvg}</span>
              <span className="logo-lg">
                <span>
                  <img src={logodarkImg} alt="" height="17" />
                </span>
                <span className="header-logo-text">{account_type?.toUpperCase()}</span>
              </span>
            </Link>

            <Link to="/" className="logo logo-light">
              <span className="logo-sm">
                <span>{logoSvg}</span>
              </span>
              <span className="logo-lg ">
                <span>
                  <img src={logolightImg} alt="" height="18" />
                </span>
                <span className="header-logo-text">{account_type?.toUpperCase()}</span>
              </span>
            </Link>
          </div>
          <button
            type="button"
            className="btn btn-sm px-3 font-size-24 header-item waves-effect"
            id="vertical-menu-btn"
            onClick={() => {
              tToggle();
            }}
            data-target="#topnav-menu-content"
          >
            <i className="mdi mdi-menu"></i>
          </button>
        </div>

        <div className="d-flex">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

// Header.propTypes = {
//     changeSidebarType: PropTypes.func,
//     leftMenu: PropTypes.any,
//     leftSideBarType: PropTypes.any,
//     showRightSidebar: PropTypes.any,
//     showRightSidebarAction: PropTypes.func,
//     t: PropTypes.any,
//     toggleLeftmenu: PropTypes.func,
// };

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
