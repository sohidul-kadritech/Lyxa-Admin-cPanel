/* eslint-disable prettier/prettier */
import { Box } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import { shop_menu_items } from '../../../common/sidebar_menu_items';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { shop_routes } from '../../../routes/shop_routes';
import CircularLoader from '../../CircularLoader';
import ChildLayout from './ChildLayout';

export default function SellerToShopLayout() {
  const { currentUser, dispatchCurrentUser, dispatchShopTabs } = useGlobalContext();
  const { seller } = currentUser;
  const location = useLocation();
  const history = useHistory();

  const routeMatch = useRouteMatch();
  const hideSidebar = location?.pathname?.search('/seller/dashboard/') > -1;

  const { path, url } = useMemo(
    () => ({ path: routeMatch?.path, url: routeMatch?.url?.replace(/\/$/, '') }),
    [routeMatch?.params?.shopId],
  );

  const shopQuery = useQuery(
    [Api.GET_SINGLE_SHOP, { shopId: routeMatch?.params?.shopId }],
    () =>
      AXIOS.get(Api.GET_SINGLE_SHOP, {
        params: {
          shopId: routeMatch?.params?.shopId,
        },
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        if (data?.status) {
          console.log(data?.data);
          dispatchCurrentUser({ type: 'shop', payload: { shop: data?.data?.shop } });
          dispatchShopTabs({
            type: 'add-tab',
            payload: { shop: data?.data?.shop || {}, location: location.pathname, seller, from: '/' },
          });
        } else {
          history.push('/');
          successMsg('Could not find shop');
        }
      },
      onError: (error) => {
        console.log(error);
        successMsg('Could not find shop');
        history.push('/');
      },
    },
  );

  useState(() => {
    if (!currentUser?.shop?._id) shopQuery.refetch();
  }, []);

  useEffect(() => {
    dispatchShopTabs({ type: 'change-current-tab-location', payload: { location: location.pathname } });
    // dispatchShopTabs({ type: 'route', payload: { location: location.pathname } });
  }, [location]);

  if (shopQuery.isLoading) {
    return (
      <Box
        sx={{
          height: '100vh',
        }}
      >
        <CircularLoader />
      </Box>
    );
  }

  return (
    <ChildLayout
      hideSidebar={hideSidebar}
      sidebarTitle="Lyxa Shop"
      routes={shop_routes(path, currentUser?.shop?.haveOwnDeliveryBoy ? 'self' : 'drop')}
      menuItems={shop_menu_items(
        url,
        currentUser?.shop?.haveOwnDeliveryBoy ? 'self' : 'drop',
        currentUser?.shop?.shopType,
      )}
      childFor="shop"
    />
  );
}
