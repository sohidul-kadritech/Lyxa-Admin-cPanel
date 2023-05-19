import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// i18n
import { adminMenuItem, customerServiceMenuItem, sellerMenuItem, shopMenuItem } from '../../assets/SideMenuItem';
import { useGlobalContext } from '../../context';
import SidebarContent from './SidebarContent';

function Sidebar() {
  // const { userType, adminType } = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { userType, adminType } = currentUser;

  return (
    <div className="vertical-menu">
      <div data-simplebar className="h-100">
        <SidebarContent
          list={
            userType === 'admin' && adminType === 'admin'
              ? adminMenuItem
              : userType === 'admin' && adminType === 'customerService'
              ? customerServiceMenuItem
              : userType === 'seller'
              ? sellerMenuItem
              : shopMenuItem
          }
        />
      </div>
    </div>
  );
}

const mapStatetoProps = (state) => ({
  layout: state.Layout,
});
export default connect(mapStatetoProps, {})(withRouter(Sidebar));
