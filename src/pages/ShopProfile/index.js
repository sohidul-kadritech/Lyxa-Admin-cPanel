/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Drawer } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import PageTop from '../../components/Common/PageTop';
import AddShop from '../../components/Shared/AddShop';
import { useGlobalContext } from '../../context';
import replacePathValues from '../../helpers/replaceRoutePath';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import ShopBanner from './Banner';
import ShopInfo from './Info';
import ShopProfileSkeleton from './Sekleton';
import ShopDetails from './ShopDetails';
import ShopProfileTabs from './Tabs';
import { createShopData } from './helper';

export default function ShopProfile({ setLoading = () => {}, loading }) {
  const routeMatch = useRouteMatch();
  const location = useLocation();

  const history = useHistory();
  const { currentUser, dispatchCurrentUser, dispatchShopTabs } = useGlobalContext();

  const { seller } = currentUser;
  const [shop, setShop] = useState(routeMatch?.path !== '/shop/profile/:shopId' ? currentUser?.shop : {});
  const [open, setOpen] = useState(false);

  const shopMutation = useMutation((data) => AXIOS.post(API_URL.EDIT_SHOP, data), {
    onSuccess: (data) => {
      successMsg(data?.status ? 'Successfully Updated' : data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        if (routeMatch?.path !== '/shop/profile/:shopId') currentUser.shop = data?.data?.shop;
        setShop(data?.data?.shop);
        setOpen(false);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
    },
  });

  const shopQuery = useQuery(
    [API_URL.SINGLE_SHOP, { id: routeMatch?.params?.shopId }],
    () =>
      AXIOS.get(API_URL.SINGLE_SHOP, {
        params: {
          id: routeMatch?.params?.shopId || currentUser?.shop?._id,
        },
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        setShop(data?.data?.shop);
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );

  useEffect(() => {
    if (routeMatch?.path === '/shop/profile/:shopId') {
      if (shopQuery?.data?.data?.shop?._id === routeMatch?.params?.shopId) {
        setShop(shopQuery?.data?.data?.shop);
      } else {
        shopQuery.refetch();
      }
    }
  }, []);

  useEffect(() => {
    if (routeMatch?.path !== '/shop/profile/:shopId') {
      setShop(currentUser?.shop);
    }
  }, [currentUser?.shop]);

  const menuHandler = (value) => {
    if (value === 'edit') {
      setOpen(true);
    }

    if (value === 'access-shop') {
      let routePath = '';

      if (routeMatch?.path === '/seller/dashboard/:sellerId/shops/list') {
        routePath = replacePathValues('/seller/dashboard/:sellerId/shop/dashboard/:shopId', {
          ...routeMatch?.params,
          shopId: shop._id,
        });

        dispatchCurrentUser({ type: 'shop', payload: { shop } });

        dispatchShopTabs({ type: 'add-tab', payload: { shop, location: routePath, seller, from: routeMatch?.url } });
      }

      if (routeMatch?.path === '/shops/list' || routeMatch?.path === '/shop/profile/:shopId') {
        routePath = replacePathValues('/shop/dashboard/:shopId', {
          shopId: shop._id,
        });

        dispatchCurrentUser({ type: 'shop', payload: { shop } });

        dispatchShopTabs({
          type: 'add-tab',
          payload: { shop, location: routePath, seller: { ...currentUser?.seller }, from: routeMatch?.url },
        });
      }

      history.push(routePath);
    }
  };

  const onDrop = async (acceptedFiles, imageFor) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
      }),
    );

    successMsg('Uploading...');
    setLoading(true);

    const shopData = await createShopData({
      ...shop,
      password: '',
      shopBanner: imageFor === 'banner' ? newFiles : [{ preview: shop?.shopBanner }],
      shopLogo: imageFor === 'logo' ? newFiles : [{ preview: shop?.shopLogo }],
    });

    if (shopData?.status === false) {
      successMsg(shopData?.msg);
      setLoading(false);
      return;
    }

    shopMutation.mutate({ ...shopData });
  };

  console.log(shopQuery?.isLoading || !shop?._id, { shop }, shopQuery?.isLoading);

  return (
    <Box>
      <PageTop
        title="Profile"
        backButtonLabel={location?.state ? location?.state?.backToLabel : undefined}
        backTo={location?.state ? location?.state?.from : undefined}
      />
      {(shopQuery?.isLoading || !shop?._id) && <ShopProfileSkeleton />}
      {!shopQuery?.isLoading && shop?._id && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { lg: '1fr 300px', md: '1fr 1fr' },
            paddingTop: '15px',
          }}
        >
          {/* left */}
          <Box
            sx={{
              paddingRight: { md: '50px', sm: '0px' },
              borderRight: { md: '1px solid #EEEEEE', sm: 'none' },
              height: '100%',
            }}
          >
            <ShopBanner loading={shopMutation.isLoading || loading} shop={shop} onDrop={onDrop} />
            <ShopInfo menuHandler={menuHandler} onDrop={onDrop} shop={shop} />
            <ShopProfileTabs shop={shop} refetchShopData={shopQuery?.refetch} loading={shopQuery?.isLoading} />
          </Box>
          {/* right */}
          <Box
            sx={{
              paddingLeft: { sm: '0px', md: '50px' },
            }}
          >
            <ShopDetails shop={shop} />
          </Box>
        </Box>
      )}
      <Drawer open={open} anchor="right">
        <AddShop
          refetch={() => {
            shopQuery.refetch();
          }}
          editShop={{
            ...shop,
          }}
          onClose={() => setOpen(false)}
        />
      </Drawer>
    </Box>
  );
}
