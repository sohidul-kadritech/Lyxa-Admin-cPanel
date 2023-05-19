import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { seller_menu_items } from '../../../common/sidebar_menu_items';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { seller_routes } from '../../../routes/seller_routes';
import CircularLoader from '../../CircularLoader';
import { replacePathValues } from '../helper';
import ChildLayout from './ChildLayout';

export default function AdminToSellerLayout({ routePrefix = '' }) {
  const { dispatchCurrentUser, seller } = useGlobalContext();
  const params = useParams();
  const history = useHistory();

  const sellerQuery = useQuery(
    [Api.SINGLE_SELLER, { id: params?.sellerId }],
    () =>
      AXIOS.get(Api.SINGLE_SELLER, {
        params: {
          id: params?.sellerId,
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
    dispatchCurrentUser({ type: 'routeDepth', payload: { routeDepth: 1 } });
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
      routes={seller_routes(routePrefix)}
      menuItems={seller_menu_items(replacePathValues(routePrefix, params))}
      childFor="seller"
    />
  );
}
