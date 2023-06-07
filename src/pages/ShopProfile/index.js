import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../components/Common/PageTop';
import AddShop from '../../components/Shared/AddShop';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import ShopBanner from './Banner';
import ShopInfo from './Info';
import ShopDetails from './ShopDetails';
import ShopProfileTabs from './Tabs';
import { createShopData } from './helper';

export default function ShopProfile({ setLoading = () => {}, loading }) {
  const routeMatch = useRouteMatch();
  const history = useHistory();
  const { currentUser, dispatchCurrentUser, dispatchShopTabs } = useGlobalContext();
  const { shop, seller } = currentUser;
  const [open, setOpen] = useState(false);

  const menuHandler = (value) => {
    if (value === 'edit') {
      setOpen(true);
    }

    if (value === 'access-shop') {
      let routePath = '';

      if (currentUser?.userType === 'seller') {
        routePath = `/shop/dashboard/${shop._id}`;
      } else {
        const pathArr = routeMatch?.url?.split('/');
        pathArr?.pop();
        pathArr?.pop();
        routePath = `${pathArr?.join('/')}/shop/dashboard/${shop._id}`;
      }

      history.push(routePath);
      dispatchCurrentUser({ type: 'shop', payload: { shop } });
      dispatchShopTabs({ type: 'add-tab', payload: { shop, location: routePath, seller } });
    }
  };

  const shopMutation = useMutation((data) => AXIOS.post(API_URL.EDIT_SHOP, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Successfully Updated', 'success');
        currentUser.shop = data?.data?.shop;
        setOpen(false);
      } else {
        successMsg(data?.message);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
    },
  });

  const onDrop = async (acceptedFiles, imageFor) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
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

  return (
    <Box>
      <PageTop title="Profie" />
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
            overflow: 'auto',
          }}
        >
          <ShopBanner loading={shopMutation.isLoading || loading} shop={shop} onDrop={onDrop} />
          <ShopInfo menuHandler={menuHandler} onDrop={onDrop} shop={shop} />
          <ShopProfileTabs shop={shop} />
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
      <Drawer open={open} anchor="right">
        <AddShop editShop={shop} onClose={() => setOpen(false)} />
      </Drawer>
    </Box>
  );
}
