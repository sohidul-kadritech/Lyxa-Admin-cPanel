import React from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

// i18n
import { withTranslation } from 'react-i18next';
import { adminMenuItem, customerServiceMenuItem, sellerMenuItem, shopMenuItem } from '../../assets/SideMenuItem';
import SidebarContent from './SidebarContent';

function Sidebar() {
  const { account_type, adminType } = useSelector((store) => store.Login.admin);

  return (
    <div className="vertical-menu">
      <div data-simplebar className="h-100">
        <SidebarContent
          list={
            account_type === 'admin' && adminType === 'admin'
              ? adminMenuItem
              : account_type === 'admin' && adminType === 'customerService'
              ? customerServiceMenuItem
              : account_type === 'seller'
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
export default connect(mapStatetoProps, {})(withRouter(withTranslation()(Sidebar)));
