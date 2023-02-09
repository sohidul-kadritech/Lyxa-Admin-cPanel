/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
import { connect, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { getAllAppSettings } from './store/Settings/settingsAction';

// Import Routes all
import { customerServiceRoutes, sellerRoutes, shopRoutes, userRoutes } from './routes/allRoutes';

// Import all middleware
import Authmiddleware from './routes/middleware/Authmiddleware';

// layouts Format
import HorizontalLayout from './components/HorizontalLayout';
import NonAuthLayout from './components/NonAuthLayout';
import VerticalLayout from './components/VerticalLayout';

// Import scss
import './assets/scss/theme.scss';
import getCookiesAsObject from './helpers/cookies/getCookiesAsObject';
import { setAdmin } from './store/actions';
import { getAllChat, incrementOpenChats } from './store/chat/chatAction';
import { socketConnect } from './store/socket/socketAction';

import setCookiesAsObj from './helpers/cookies/setCookiesAsObject';
import { successMsg } from './helpers/successMsg';
import { SINGLE_ADMIN, SINGLE_SELLER, SINGLE_SHOP } from './network/Api';
import requestApi from './network/httpRequest';
import Login from './pages/Authentication/Login';

function App(props) {
  const dispatch = useDispatch();
  const [routeList, setRouteList] = useState([]);
  const { socket } = useSelector((state) => state.socketReducer);

  const {
    admin: { account_type, adminType },
  } = useSelector((state) => state.Login);
  const [adminDataIsLoading, setAdminDataIsLoading] = useState(true);

  // get admin data
  const fetchAdminData = async (accountType, id) => {
    let ADMIN_DATA;
    let ENDPOINT;

    const requestOptions = {
      method: 'GET',
      params: {
        id,
      },
    };

    if (accountType === 'shop') {
      ENDPOINT = SINGLE_SHOP;
    } else if (accountType === 'admin') {
      ENDPOINT = SINGLE_ADMIN;
    } else if (accountType === 'seller') {
      ENDPOINT = SINGLE_SELLER;
    } else {
      setAdminDataIsLoading(false);
      return;
    }

    try {
      const { data: respData } = await requestApi().request(ENDPOINT, requestOptions);
      console.log(respData);

      if (respData?.status) {
        ADMIN_DATA = respData?.data?.[accountType];
        dispatch(setAdmin({ ...ADMIN_DATA, account_type: accountType } || {}));
      }
      setAdminDataIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // remove auth cookies
  const removeAuthCookies = () => {
    const cookies = getCookiesAsObject();
    setCookiesAsObj(cookies, 0);
  };

  // read cookies and fetch admin data
  useEffect(() => {
    if (!localStorage.getItem('currency')) {
      dispatch(getAllAppSettings());
    }

    if (document.cookie.length < 1) {
      setAdminDataIsLoading(false);
    } else {
      const { account_type: cookie_account_type, account_id: cookie_account_id, access_token } = getCookiesAsObject();

      if (!cookie_account_type || !cookie_account_id || !access_token) {
        removeAuthCookies();
        setAdminDataIsLoading(false);
      } else {
        fetchAdminData(cookie_account_type, cookie_account_id);
      }
    }
  }, []);

  useEffect(() => {
    if (account_type === 'admin' && adminType !== 'customerService') {
      setRouteList(userRoutes);
    } else if (account_type === 'admin' && adminType === 'customerService') {
      setRouteList(customerServiceRoutes);
    } else if (account_type === 'seller') {
      setRouteList(sellerRoutes);
    } else {
      setRouteList(shopRoutes);
    }
  }, [account_type]);

  useEffect(() => {
    if (account_type === 'admin') {
      dispatch(getAllChat());
    }
  }, [account_type]);

  useEffect(() => {
    if (!socket && account_type) {
      dispatch(socketConnect());
    }
  }, [socket, account_type]);

  useEffect(() => {
    let listenerID;

    if (socket) {
      listenerID = socket.on('user_send_chat_request', (data) => {
        dispatch(incrementOpenChats());
        return successMsg(`New chat request from ${data?.user?.name}`, 'success');
      });
    }
    return () => {
      if (socket) {
        socket.off('user_send_chat_request', listenerID);
      }
    };
  }, [socket]);

  function getLayout() {
    // default Vertical
    let layoutCls = VerticalLayout;
    switch (props.layout.layoutType) {
      case 'horizontal':
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
    <Router>
      <Switch>
        {/* login */}
        <Authmiddleware path="/login" layout={NonAuthLayout} component={Login} isAuthProtected={false} />
        {/* admin data is loading */}
        {adminDataIsLoading && (
          <div
            style={{
              width: '100%',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner color="primary" />
          </div>
        )}
        {/* admin data not found */}
        {!adminDataIsLoading && !account_type && <Redirect to="/login" replace />}

        {/* admin data is fetched */}
        {!adminDataIsLoading &&
          account_type &&
          routeList?.map((route) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={Math.random()}
              isAuthProtected
              exact
            />
          ))}
      </Switch>
    </Router>
  );
}

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => ({
  layout: state.Layout,
});

export default connect(mapStateToProps, null)(App);
