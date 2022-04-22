import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
// sdlf
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
                  <Link to="/banner/add">
                    <i className="fas fa-plus-circle" />
                    <span>{props.t("Add")}</span>
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

            {/* PRODUCT */}

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="fa fa-cube" />
                <span>{props.t("Products")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/products/list">
                    <i className="fas fa-clipboard-list" />
                    <span>{props.t("List")} </span>
                  </Link>
                </li>
                <li>
                  <Link to="/products/add">
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
                <span>{props.t("Categories")}</span>
              </Link>
              <ul className="sub-menu " aria-expanded="false">
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
                {/* 
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
                </li> */}
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
