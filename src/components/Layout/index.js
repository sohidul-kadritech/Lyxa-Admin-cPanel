/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { Box, Modal } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Route, Switch, useHistory } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import {
  account_manager_menu_items,
  admin_menu_items,
  customer_service_menu_items,
  sales_manager_menu_items,
  seller_menu_items,
  shop_manager_menu_items,
  shop_menu_items,
} from '../../common/sidebar_menu_items';
import socketServices from '../../common/socketService';
import { useGlobalContext } from '../../context';
import * as API_URL from '../../network/Api';
import { sales_manager_routes } from '../../routes/Sales_manager_routes';
import { account_manager_routes } from '../../routes/account_manager_routes';
import { admin_routes } from '../../routes/admin_routes';
import { customer_service_routes } from '../../routes/customer_service_routes';
import { seller_routes } from '../../routes/seller_routes';
import { shop_order_manager_routes, shop_routes } from '../../routes/shop_routes';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import UrgentOrderRecieved from './UrgentOrderReceivedNotification';

const getRouteAndSidebarItems = (userType, adminType, shopDeliveryType, shopType, shopOrderManager, prefix = '') => {
  let routes = [];
  let menuItems = [];

  if (userType === 'shop') {
    console.log(shopOrderManager, typeof shopOrderManager);
    routes =
      shopOrderManager && shopOrderManager !== 'null'
        ? shop_order_manager_routes()
        : shop_routes(prefix, shopDeliveryType);
    menuItems =
      shopOrderManager && shopOrderManager !== 'null'
        ? shop_manager_menu_items(prefix, shopDeliveryType, shopType)
        : shop_menu_items(prefix, shopDeliveryType, shopType);
  }

  if (userType === 'seller') {
    routes = seller_routes(prefix);
    menuItems = seller_menu_items(prefix);
  }

  if (userType === 'admin' && adminType === 'admin') {
    routes = admin_routes;
    menuItems = admin_menu_items;
  }
  if (userType === 'admin' && adminType === 'accountManager') {
    routes = account_manager_routes;
    menuItems = account_manager_menu_items;
  }
  if (userType === 'admin' && adminType === 'sales') {
    routes = sales_manager_routes;
    menuItems = sales_manager_menu_items;
  }

  if (userType === 'admin' && adminType === 'customerService') {
    routes = customer_service_routes;
    menuItems = customer_service_menu_items;
  }

  return { routes, menuItems };
};

export default function Layout() {
  const { currentUser } = useGlobalContext();
  const { userType, adminType } = currentUser;
  const [sidebar, setSidebar] = useState(false);
  const [openUrgentOrder, setOpenUrgentOrder] = useState(false);
  const history = useHistory();

  const [order, setOrder] = useState({});

  const queryClient = useQueryClient();

  console.log('currentUser', { currentUser });

  const { routes, menuItems } = useMemo(
    () =>
      getRouteAndSidebarItems(
        currentUser?.userType,
        currentUser?.adminType,
        currentUser?.shop?.haveOwnDeliveryBoy ? 'self' : 'drop',
        currentUser?.shop?.shopType,
        currentUser?.shopOrderManager,
      ),
    [currentUser?.userType, currentUser?.shopOrderManager],
  );

  useEffect(() => {
    if (userType === 'admin' || adminType === 'customerService') {
      socketServices?.on(`urgent-notification-${currentUser?.admin?._id}`, (data) => {
        console.log('urgent order socketData', data?.order);
        setOpenUrgentOrder(true);
        queryClient.invalidateQueries(API_URL.URGENT_ORDER_LIST);
        queryClient.invalidateQueries(API_URL.URGENT_ORDER_COUNT);
        queryClient.invalidateQueries(API_URL.LATE_ORDER_COUNT);
        setOrder(data?.order);
      });
      socketServices?.on(`urgent-notification-remove-${currentUser?.admin?._id}`, () => {
        console.log('urgent order socketData removed');
        setOpenUrgentOrder(false);
        queryClient.invalidateQueries(API_URL.URGENT_ORDER_LIST);
        queryClient.invalidateQueries(API_URL.URGENT_ORDER_COUNT);
        queryClient.invalidateQueries(API_URL.LATE_ORDER_COUNT);
        setOrder({});
      });
    }

    socketServices?.on(`notify-urgent-order`, () => {
      console.log('urgent order count');
      queryClient.invalidateQueries(API_URL.URGENT_ORDER_COUNT);
    });

    socketServices?.on(`notify-late-order`, () => {
      console.log('urgent order count late');
      queryClient.invalidateQueries(API_URL.LATE_ORDER_COUNT);
    });

    return () => {
      socketServices?.removeListener(`notify-late-order`);
      socketServices?.removeListener(`notify-urgent-order`);
      socketServices?.removeListener(`urgent-notification`);
      socketServices?.removeListener(`urgent-notification-remove`);
    };
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        overflowY: 'hidden',
      }}
    >
      <Topbar sidebar={sidebar} setSidebar={setSidebar} />
      <Box position="relative">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} menuItems={menuItems} variant="parent" />
        <Box
          sx={{
            paddingLeft: '50px',
            paddingRight: '50px',
            height: 'calc(100vh - 67px)',
            overflowY: 'scroll',
            backgroundColor: '#fbfbfb',
          }}
        >
          <Switch>
            {routes.map(({ component: Component, componentProps, path, ...props }) => (
              <Route
                exact
                path={path}
                key={path}
                render={(routeProps) => <Component {...routeProps} {...componentProps} />}
                {...props}
              />
            ))}
          </Switch>
          <Modal open={openUrgentOrder}>
            <Box>
              <UrgentOrderRecieved
                order={order}
                onClose={() => {
                  setOpenUrgentOrder(false);
                }}
              />
            </Box>
          </Modal>
        </Box>

        <ToastContainer />
      </Box>
    </Box>
  );
}
