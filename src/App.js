import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Switch,
  BrowserRouter as Router,
  useHistory,
  Route,
  Redirect,
} from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";

// Import Routes all
import {
  userRoutes,
  sellerRoutes,
  customerServiceRoutes,
  shopRoutes,
} from "./routes/allRoutes";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";
import { socketConnect } from "./store/socket/socketAction";

import { SOCKET_CONNECTION } from "./network/Api";
import Login from "./pages/Authentication/Login";
import { successMsg } from "./helpers/successMsg";

const App = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [routeList, setRouteList] = useState([]);
  const { socket } = useSelector((state) => state.socketReducer);

  const {
    admin: { account_type, adminType },
  } = useSelector((state) => state.Login);

  useEffect(() => {
    if (account_type === "admin" && adminType !== "customerService") {
      setRouteList(userRoutes);
    } else if (account_type === "admin" && adminType === "customerService") {
      setRouteList(customerServiceRoutes);
    } else if (account_type === "seller") {
      setRouteList(sellerRoutes);
    } else {
      setRouteList(shopRoutes);
    }
    // else {
    //   history.push('/login', { replace: true });
    // }
  }, [account_type]);

  useEffect(() => {
    if (!socket) {
      dispatch(socketConnect());
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("user_send_chat_request", (data) => {
        return successMsg(
          `New chat request from ${data?.user?.name}`,
          "success"
        );
      });
    }
    return;
  }, [socket]);

  function getLayout() {
    // default Vertical
    let layoutCls = VerticalLayout;
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout();

  return (
    <React.Fragment>
      <Router>
        <Switch>
          {/* {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
            />
          ))} */}

          <Authmiddleware
            path={"/login"}
            layout={NonAuthLayout}
            component={Login}
            isAuthProtected={false}
          />

          {account_type ? (
            routeList?.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                exact
              />
            ))
          ) : (
            <Redirect to={{ pathname: "/login" }} />
          )}
        </Switch>
      </Router>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
