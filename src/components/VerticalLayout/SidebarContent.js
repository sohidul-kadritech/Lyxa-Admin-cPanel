import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
  const ref = useRef();
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title">{props.t("Main")} </li> */}
            <li>
              <Link to="/dashboard" className="waves-effect">
                <i className="ti-home" />
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            {/* ORDERS */}

            <li>
              <Link to="/orders/list" className="waves-effect">
                <i className="fas fa-cart-plus" />
                <span>{props.t("Orders")}</span>
              </Link>
            </li>

            {/* <li>
              <Link to="/calendar" className=" waves-effect">
                <i className="ti-calendar"></i>
                <span>{props.t("Calendar")}</span>
              </Link>
            </li> */}

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-image" />
                <span>{props.t("Banner")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/banner">
                    <i className="fas fa-clipboard-list" />
                    <span>{props.t("List")} </span>
                  </Link>
                </li>
                <li>
                  <Link to="/banner-add">
                    <i className="fas fa-plus-circle" />
                    <span>{props.t("Add")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-gallery" />
                <span>{props.t("Gallery")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/image-gallery">
                    <i className="fas fa-photo-video" />
                    <span>{props.t("Image Gallery")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/image-folder">
                    <i className="fas fa-folder" />
                    <span>{props.t("Image Folder")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/image-upload">
                    <i className="fas fa-image" />
                    <span>{props.t("Image Upload")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* USERS MENU */}

            <li>
              <Link to="/users/list" className="waves-effect">
                <i className="fas fa-user-friends" />
                <span>{props.t("User")}</span>
              </Link>
            </li>

            {/* SELLER */}

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="fas fa-user-friends" />
                <span>{props.t("Seller")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/seller/list">
                    <i className="fas fa-clipboard-list" />
                    <span>{props.t("List")} </span>
                  </Link>
                </li>
                <li>
                  <Link to="/seller/add">
                    <i className="fas fa-plus-circle" />
                    <span>{props.t("Add")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* SHOPS */}

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="fas fa-home" />
                <span>{props.t("Shops")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/shops/list">
                    <i className="fas fa-clipboard-list" />
                    <span>{props.t("List")} </span>
                  </Link>
                </li>
                <li>
                  <Link to="/shops/add">
                    <i className="fas fa-plus-circle" />
                    <span>{props.t("Add")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* DELIVERY MANS */}

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="fas fa-user-friends" />
                <span>{props.t("Delivery Man")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/deliveryman/list">
                    <i className="fas fa-clipboard-list" />
                    <span>{props.t("List")} </span>
                  </Link>
                </li>
                <li>
                  <Link to="/deliveryman/add">
                    <i className="fas fa-plus-circle" />
                    <span>{props.t("Add")}</span>
                  </Link>
                </li>
                {/* <li>
                  <Link to="/email-compose">{props.t("Email Compose")} </Link>
                </li> */}
              </ul>
            </li>

            {/* DEALS */}

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="fas fa-handshake" />
                <span>{props.t("Deals")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/deals/list">
                    <i className="fas fa-clipboard-list" />
                    <span>{props.t("List")} </span>
                  </Link>
                </li>
                <li>
                  <Link to="/deals/add">
                    <i className="fas fa-plus-circle" />
                    <span>{props.t("Add")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* DROP PAY */}

            <li>
              <Link to="/drop-pay" className="waves-effect">
                <i className="fas fa-comment-dollar" />
                <span>{props.t("Drop Pay")}</span>
              </Link>
            </li>

            {/* TRANSACTIONS */}

            <li>
              <Link to="/transactions" className="waves-effect">
                <i className="fas fa-exchange-alt" />
                <span>{props.t("Transactions")}</span>
              </Link>
            </li>

            {/* APP WALLET */}
              
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="fas fa-wallet" />
                <span>{props.t("App Wallet")}</span>
              </Link>
              <ul className="sub-menu " aria-expanded="false">
                <li>
                  <Link to="/add-wallet/percentage-setting">
                    <i className="ti-settings" />
                    <span>{props.t("Percentage Setting")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/add-wallet/admin-log-history">
                    <i className="fas fa-history" />
                    <span>{props.t("Admin Log History")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/add-wallet/seller-transactions">
                    <i className="fas fa-exchange-alt" />
                    <span>{props.t("Seller TRX")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/add-wallet/delivery-transactions">
                    <i className="fas fa-exchange-alt" />
                    <span>{props.t("Delivery TRX")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/add-wallet/payments-history">
                    <i className="ti-money" />
                    <span>{props.t("Payments History")}</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* CHAT */}

            <li>
              <Link to="/chats" className="waves-effect">
                <i className="fab fa-rocketchat" />
                <span>{props.t("Chat")}</span>
              </Link>
            </li>

            
            {/* Admin Controls */}

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-user" />
                <span>{props.t("Admin Control")}</span>
              </Link>
              <ul className="sub-menu " aria-expanded="false">
                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                  <i className="fas fa-user-friends" />
                    <span>{props.t("Admins")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="true">
                    <li>
                      <Link to="/admin/list">
                        <i className="fas fa-clipboard-list" />
                        <span>{props.t("List")} </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/create">
                        <i className="fas fa-plus-circle" />
                        <span>{props.t("Create")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/admin/role">
                    <i className="fas fa-user-tie" />
                    <span>{props.t("Role")}</span>
                  </Link>
                </li>
              </ul>
            </li>


            {/* CATEGORIES AND TAGS */}

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="fas fa-list" />
                <span>{props.t("Categories & Tags")}</span>
              </Link>
              <ul className="sub-menu " aria-expanded="false">
                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                  <i className="fas fa-list" />
                    <span>{props.t("Categories")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="true">
                    <li>
                      <Link to="/categories/list">
                        <i className="fas fa-clipboard-list" />
                        <span>{props.t("List")} </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/categories/add">
                        <i className="fas fa-plus-circle" />
                        <span>{props.t("Add")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="fas fa-tags" />
                    <span>{props.t("Tags")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="true">
                    <li>
                      <Link to="/tags/list">
                        <i className="fas fa-clipboard-list" />
                        <span>{props.t("List")} </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/tags/add">
                        <i className="fas fa-plus-circle" />
                        <span>{props.t("Add")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>

              </ul>
            </li>

            <li className="menu-title">{props.t("Components")}</li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-package" />
                <span>{props.t("UI Elements")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/ui-alerts">{props.t("Alerts")}</Link>
                </li>
                <li>
                  <Link to="/ui-buttons">{props.t("Buttons")}</Link>
                </li>
                <li>
                  <Link to="/ui-cards">{props.t("Cards")}</Link>
                </li>
                <li>
                  <Link to="/ui-carousel">{props.t("Carousel")}</Link>
                </li>
                <li>
                  <Link to="/ui-dropdowns">{props.t("Dropdowns")}</Link>
                </li>
                <li>
                  <Link to="/ui-grid">{props.t("Grid")}</Link>
                </li>
                <li>
                  <Link to="/ui-images">{props.t("Images")}</Link>
                </li>
                <li>
                  <Link to="/ui-lightbox">{props.t("Lightbox")}</Link>
                </li>
                <li>
                  <Link to="/ui-modals">{props.t("Modals")}</Link>
                </li>
                <li>
                  <Link to="/ui-rangeslider">{props.t("Range Slider")}</Link>
                </li>
                <li>
                  <Link to="/ui-session-timeout">
                    {props.t("Session Timeout")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-progressbars">{props.t("Progress Bars")}</Link>
                </li>
                <li>
                  <Link to="/ui-sweet-alert">{props.t("Sweet-Alert")}</Link>
                </li>
                <li>
                  <Link to="/ui-tabs-accordions">
                    {props.t("Tabs & Accordions")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-typography">{props.t("Typography")}</Link>
                </li>
                <li>
                  <Link to="/ui-video">{props.t("Video")}</Link>
                </li>
                <li>
                  <Link to="/ui-general">{props.t("General")}</Link>
                </li>
                <li>
                  <Link to="/ui-colors">{props.t("Colors")}</Link>
                </li>
                <li>
                  <Link to="/ui-rating">{props.t("Rating")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="waves-effect">
                <i className="ti-receipt" />
                <span className="badge rounded-pill bg-success float-end">
                  6
                </span>
                <span>{props.t("Forms")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/form-elements">{props.t("Form Elements")}</Link>
                </li>
                <li>
                  <Link to="/form-validation">
                    {props.t("Form Validation")}
                  </Link>
                </li>
                <li>
                  <Link to="/form-advanced">{props.t("Form Advanced")}</Link>
                </li>
                <li>
                  <Link to="/form-editors">{props.t("Form Editors")}</Link>
                </li>
                <li>
                  <Link to="/form-uploads">{props.t("Form File Upload")} </Link>
                </li>
                <li>
                  <Link to="/form-xeditable">{props.t("Form Xeditable")}</Link>
                </li>
                <li>
                  <Link to="/form-repeater">{props.t("Form Repeater")}</Link>
                </li>
                <li>
                  <Link to="/form-wizard">{props.t("Form Wizard")}</Link>
                </li>
                <li>
                  <Link to="/form-mask">{props.t("Form Mask")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-pie-chart" />
                <span>{props.t("Charts")}</span>
              </Link>

              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/chartist-charts">{props.t("Chartist Chart")}</Link>
                </li>
                <li>
                  <Link to="/e-charts">{props.t("E Chart")}</Link>
                </li>
                <li>
                  <Link to="/chartjs-charts">{props.t("Chartjs Chart")}</Link>
                </li>
                <li>
                  <Link to="apex-charts">{props.t("Apex charts")}</Link>
                </li>
                <li>
                  <Link to="sparkline-charts">
                    {props.t("Sparkline Chart")}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-view-grid" />
                <span>{props.t("Tables")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/tables-basic">{props.t("Basic Tables")}</Link>
                </li>
                <li>
                  <Link to="/tables-datatable">{props.t("Data Tables")}</Link>
                </li>
                <li>
                  <Link to="/tables-responsive">
                    {props.t("Responsive Table")}
                  </Link>
                </li>
                <li>
                  <Link to="/tables-editable">{props.t("Editable Table")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-face-smile" />
                <span>{props.t("Icons")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/icons-materialdesign">
                    {props.t("Material Design")}
                  </Link>
                </li>
                <li>
                  <Link to="/icons-fontawesome">{props.t("Font awesome")}</Link>
                </li>
                <li>
                  <Link to="/icons-ion">{props.t("Ion Icons")}</Link>
                </li>
                <li>
                  <Link to="/icons-themify">{props.t("Themify Icons")}</Link>
                </li>
                <li>
                  <Link to="/icons-dripicons">{props.t("Dripicons")}</Link>
                </li>
                <li>
                  <Link to="/icons-typicons">{props.t("Typicons Icons")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#">
                <i className="ti-location-pin" />
                <span className="badge rounded-pill bg-danger float-end">
                  2
                </span>
                <span>{props.t("Maps")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/maps-google">{props.t("Google Maps")}</Link>
                </li>
                <li>
                  <Link to="/maps-vector">{props.t("Vector Maps")}</Link>
                </li>
                <li>
                  <Link to="/maps-leaflet">{props.t("Leaflet Maps")}</Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">Extras</li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-archive" />
                <span>{props.t("Authentication")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/pages-login">{props.t("Login")}</Link>
                </li>
                <li>
                  <Link to="/pages-login-2">{props.t("Login")} 2</Link>
                </li>
                <li>
                  <Link to="/pages-register">{props.t("Register")}</Link>
                </li>
                <li>
                  <Link to="/pages-register-2">{props.t("Register")} 2</Link>
                </li>
                <li>
                  <Link to="/page-recoverpw">
                    {props.t("Recover Password")}
                  </Link>
                </li>
                <li>
                  <Link to="/page-recoverpw-2">
                    {props.t("Recover Password")} 2
                  </Link>
                </li>
                <li>
                  <Link to="/auth-lock-screen">{props.t("Lock screen")}</Link>
                </li>
                <li>
                  <Link to="/auth-lock-screen-2">
                    {props.t("Lock screen")} 2
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-support" />
                <span>{props.t("Extra Pages")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="pages-timeline">{props.t("Timeline")}</Link>
                </li>
                <li>
                  <Link to="pages-invoice">{props.t("Invoice")}</Link>
                </li>
                <li>
                  <Link to="pages-directory">{props.t("Directory")}</Link>
                </li>
                <li>
                  <Link to="/pages-starter">{props.t("Starter Page")}</Link>
                </li>
                <li>
                  <Link to="pages-404">{props.t("Error 404")}</Link>
                </li>
                <li>
                  <Link to="pages-500">{props.t("Error 500")}</Link>
                </li>
                <li>
                  <Link to="pages-pricing">{props.t("Pricing")}</Link>
                </li>
                <li>
                  <Link to="pages-gallery">{props.t("Gallery")}</Link>
                </li>
                <li>
                  <Link to="pages-maintenance">{props.t("Maintenance")}</Link>
                </li>
                <li>
                  <Link to="pages-comingsoon">{props.t("Coming Soon")}</Link>
                </li>
                <li>
                  <Link to="pages-faqs">{props.t("FAQs")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-bookmark-alt" />
                <span> {props.t("Email Templates")} </span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/email-template-basic">
                    {props.t("Basic Action Email")}
                  </Link>
                </li>
                <li>
                  <Link to="/email-template-Alert">
                    {props.t("Alert Email")}
                  </Link>
                </li>
                <li>
                  <Link to="/email-template-Billing">
                    {props.t("Billing Email")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="ti-more" />
                <span>{props.t("Multi Level")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="true">
                <li>
                  <Link to="/#">{props.t("Level 1.1")}</Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Level 1.2")}
                  </Link>
                  <ul className="sub-menu" aria-expanded="true">
                    <li>
                      <Link to="/#">{props.t("Level 2.1")}</Link>
                    </li>
                    <li>
                      <Link to="/#">{props.t("Level 2.2")}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
