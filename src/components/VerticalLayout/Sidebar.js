import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";
import {
  adminMenuItem,
  customerServiceMenuItem,
  sellerMenuItem,
  shopMenuItem,
} from "../../assets/SideMenuItem";

const Sidebar = (props) => {
  const { account_type } = JSON.parse(localStorage.getItem("admin"));

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          <SidebarContent
            list={
              account_type === "admin"
                ? adminMenuItem
                : account_type === "customer_service"
                ? customerServiceMenuItem
                : account_type === "seller"
                ? sellerMenuItem
                : shopMenuItem
            }
          />
          {/* {admin.account_type === "seller" && <SellerSidebarContent />}
          {admin.account_type === "shop" && <ShopSidebarContent />} */}
        </div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
