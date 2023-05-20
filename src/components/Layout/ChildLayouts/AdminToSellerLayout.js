import { Box } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import { seller_menu_items } from '../../../common/sidebar_menu_items';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { seller_routes } from '../../../routes/seller_routes';
import CircularLoader from '../../CircularLoader';
import ChildLayout from './ChildLayout';

export default function AdminToSellerLayout() {
  const { dispatchCurrentUser, seller } = useGlobalContext();
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const { path, url } = useMemo(() => ({ path: routeMatch?.path, url: routeMatch?.url?.replace(/\/$/, '') }), []);

  const sellerQuery = useQuery(
    [Api.SINGLE_SELLER, { id: routeMatch?.params?.sellerId }],
    () =>
      AXIOS.get(Api.SINGLE_SELLER, {
        params: {
          id: routeMatch?.params?.sellerId,
        },
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        if (data?.status && data?.data?.seller) {
          dispatchCurrentUser({ type: 'seller', payload: { seller: data?.data?.seller } });
        } else {
          history.push('/');
          successMsg('Could not find seller');
        }
      },
      onError: (error) => {
        console.log(error);
        successMsg('Could not find seller');
        history.push('/');
      },
    }
  );

  useEffect(() => {
    if (!seller?._id) sellerQuery.refetch();
  }, []);

  if (sellerQuery.isLoading) {
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
      sidebarTitle="Lyxa Seller"
      routes={seller_routes(path)}
      menuItems={seller_menu_items(url)}
      childFor="seller"
    />
  );
}
