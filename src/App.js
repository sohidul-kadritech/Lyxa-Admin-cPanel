import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Switch, BrowserRouter as Router, useHistory, Route, Redirect } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";

// Import Routes all
import { userRoutes, sellerRoutes, customerServiceRoutes, shopRoutes } from "./routes/allRoutes";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";
import { socketConnect } from "./store/socket/socketAction";
import { getAllChat, incrementOpenChats } from "./store/chat/chatAction";
import { setAdmin } from "./store/actions";

import { SINGLE_SHOP, SINGLE_ADMIN, SINGLE_SELLER, SOCKET_CONNECTION } from "./network/Api";
import Login from "./pages/Authentication/Login";
import { successMsg } from "./helpers/successMsg";
import requestApi from "./network/httpRequest";

const App = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [routeList, setRouteList] = useState([]);
  const { socket } = useSelector((state) => state.socketReducer);

  const {
    admin: { account_type, adminType },
  } = useSelector((state) => state.Login);

  // set admin
  const setAdminToLocal = (oldAdmin, newAdmin) => {
    dispatch(setAdmin({...oldAdmin, ...newAdmin}));
    localStorage.setItem('admin', JSON.stringify({...oldAdmin, ...newAdmin}));
  }

  // get admin
  const getAdmin = async () => { 
    try{
      const admin = JSON.parse(localStorage.getItem('admin'));

      // shop
      if(admin.account_type === 'shop'){
        const {data: resData} = await requestApi().request(SINGLE_SHOP, {
          params: {
            id: admin._id
          }
        })

        const {data: {shop}} = resData;
        setAdminToLocal(admin, shop);

        // admin
      }else if (admin.account_type === 'admin'){
        const {data: resData} = await requestApi().request(SINGLE_ADMIN, {
          params: {
            id: admin._id
          }
        })

        const {data: {admin: newAdmin}} = resData;
        setAdminToLocal(admin, newAdmin);

        // seller
      } else if(admin.account_type === 'seller'){
        const {data: resData} = await requestApi().request(SINGLE_SELLER, {
          params: {
            id: admin._id
          }
        })

        const {data: {seller}} = resData;
        setAdminToLocal(admin, seller)
      }

    }catch(error){
      console.log(error);
    }
    
  }

  useEffect(() => {
    // refresh localstorage data
    getAdmin();

    if (account_type === "admin" && adminType !== "customerService") {
      setRouteList(userRoutes);
    } else if (account_type === "admin" && adminType === "customerService") {
      setRouteList(customerServiceRoutes);
    } else if (account_type === "seller") {
      setRouteList(sellerRoutes);
    } else {
      setRouteList(shopRoutes);
    }
  }, [account_type]);

  useEffect(() => {
    if (account_type === "admin") {
      // fetch chat list data
      dispatch(getAllChat());
    }
  }, [account_type]);

  useEffect(() => {
    if (!socket) {
      dispatch(socketConnect());
    }
  }, [socket]);

  useEffect(() => {
    let listenerID;

    if (socket) {
      listenerID = socket.on("user_send_chat_request", (data) => {
        dispatch(incrementOpenChats());
        return successMsg(`New chat request from ${data?.user?.name}`, "success");
      });
    }
    return () => {
      if (socket) {
        socket.off("user_send_chat_request", listenerID);
      }
    };
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

          <Authmiddleware path={"/login"} layout={NonAuthLayout} component={Login} isAuthProtected={false} />

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
