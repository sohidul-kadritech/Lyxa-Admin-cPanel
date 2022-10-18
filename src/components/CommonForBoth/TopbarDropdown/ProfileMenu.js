import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal
} from "reactstrap";


//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { withRouter, Link, useHistory } from "react-router-dom";

// users
import user1 from "../../../assets/images/users/user-4.jpg";

import ChangePassword from './../ChangePassword';

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("Admin");
  // const { accessToken } = useSelector(state => state.login);
  const { loading, status } = useSelector((state) => state.Profile);
  const { admin: { name } } = useSelector((state) => state.Login);


  const [isChangePass, setIsChangePass] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (status) {
      setIsChangePass(false);
    }
  }, [status])


  useEffect(
    () => {
      if (localStorage.getItem("authUser")) {
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
          const obj = JSON.parse(localStorage.getItem("authUser"));
          setusername(obj.displayName);
        } else if (
          process.env.REACT_APP_DEFAULTAUTH === "fake" ||
          process.env.REACT_APP_DEFAULTAUTH === "jwt"
        ) {
          const obj = JSON.parse(localStorage.getItem("authUser"));
          setusername(obj.username);
        }
      }
    },
    [props.success]
  );

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("admin");
    window.location.reload(true);
    // history.push("/login", { replace: true })
    // <Redirect to="/dashboard" />
  };

  return (
    <React.Fragment>

      <div>

        <span>{name}</span>

        <Dropdown
          isOpen={menu}
          toggle={() => setMenu(!menu)}
          className="d-inline-block"
        >
          <DropdownToggle
            className="btn header-item waves-effect"
            id="page-header-user-dropdown"
            tag="button"
          >
            {/* <img
      className="rounded-circle header-profile-user"
      src={user1}
      alt="Header Avatar"
    /> */}
            <i className="fas fa-user-circle" style={{ fontSize: '24px' }} aria-hidden="true"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            {/* <DropdownItem tag="a" href="/profile">
      <i className="fa fa-user font-size-16 align-baseline me-2" />
      {props.t("Profile")}
    </DropdownItem> */}
            <DropdownItem tag="a" onClick={() => setIsChangePass(!isChangePass)}>
              <i className="fa fa-lock font-size-16 align-baseline me-2" />
              {props.t("Change Password")}
            </DropdownItem>
            <div className="dropdown-divider" />
            <p className="dropdown-item cursor-pointer" onClick={logout}>
              <i className="fa fa-power-off font-size-16 align-baseline me-2 text-danger" />
              <span>Logout</span>
            </p>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* CHANGE PASSWORD */}

      <Modal
        isOpen={isChangePass}
        toggle={() => {
          setIsChangePass(!isChangePass);
        }}
        centered={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Change Password</h5>
          <button
            type="button"
            onClick={() => {
              setIsChangePass(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <ChangePassword />
        </div>
      </Modal>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
