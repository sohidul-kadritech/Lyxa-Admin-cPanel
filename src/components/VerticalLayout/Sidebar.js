import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import AdminSidebarContent from "./AdminSidebarContent";
import SellerSidebarContent from "./SellerSidebarContent";
import ShopSidebarContent from "./ShopSidebarContent";

const Sidebar = (props) => {
  const { account_type } = JSON.parse(localStorage.getItem("admin"));

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          {account_type === "admin" && <AdminSidebarContent />}
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
