import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { shop_menu_items } from '../../../common/sidebar_menu_items';
import { useGlobalContext } from '../../../context/GlobalContext';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { shop_routes } from '../../../routes/shop_routes';
import CircularLoader from '../../CircularLoader';
import { replacePathValues } from '../helper';
import ChildLayout from './ChildLayout';

export default function SellerToShopLayout({ routePrefix }) {
  const { currentUser, dispatchCurrentUser, dispatchTabs } = useGlobalContext();
  const params = useParams();
  const location = useLocation();
  const history = useHistory();

  const shopQuery = useQuery(
    [Api.SINGLE_SHOP, { id: params?.shopId }],
    () =>
      AXIOS.get(Api.SINGLE_SHOP, {
        params: {
          id: params?.shopId,
        },
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        if (data?.status) {
          console.log('=========apiData=======>', data?.data?.shop);
          console.log(data?.data);
          dispatchCurrentUser({ type: 'shop', payload: { shop: data?.data?.shop } });
          dispatchTabs({ type: 'add-tab', payload: { shop: data?.data?.shop || {}, location: location.pathname } });
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
    }
  );

  useState(() => {
    if (!currentUser?.shop?._id) {
      shopQuery.refetch();
    }
  }, []);

  useEffect(() => {
    dispatchTabs({ type: 'change-current-tab-location', payload: { location: location.pathname } });
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
      routes={shop_routes(routePrefix)}
      menuItems={shop_menu_items(replacePathValues(routePrefix, params))}
    />
  );
}
