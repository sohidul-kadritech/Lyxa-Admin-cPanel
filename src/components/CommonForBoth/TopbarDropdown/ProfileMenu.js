import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal } from 'reactstrap';

// i18n
// Redux
import { withRouter } from 'react-router-dom';
import getCookiesAsObject from '../../../helpers/cookies/getCookiesAsObject';
import setCookiesAsObject from '../../../helpers/cookies/setCookiesAsObject';

// users

import ChangePassword from '../ChangePassword';

function ProfileMenu() {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { loading, status } = useSelector((state) => state.Profile);
  const {
    admin: { name, account_type, shopName = '' },
  } = useSelector((state) => state.Login);

  const [isChangePass, setIsChangePass] = useState(false);
  // const history = useHistory();

  useEffect(() => {
    if (status) {
      setIsChangePass(false);
    }
  }, [status]);

  const logout = () => {
    // remove all cookies
    const authCookies = getCookiesAsObject();
    setCookiesAsObject(authCookies, 0);
    window.location.reload(true);
  };

  return (
    <>
      <div>
        <span>{account_type === 'shop' ? shopName : name}</span>

        <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block">
          <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
            <i className="fas fa-user-circle" style={{ fontSize: '24px' }} aria-hidden="true"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem tag="a" onClick={() => setIsChangePass(!isChangePass)}>
              <i className="fa fa-lock font-size-16 align-baseline me-2" />
              Change Password
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
        centered
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
    </>
  );
}

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(connect(mapStatetoProps, {})(ProfileMenu));
