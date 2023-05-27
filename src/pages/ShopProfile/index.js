import { AccessTime } from '@mui/icons-material';
import { Avatar, Box, Drawer, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as CartIcon } from '../../assets/icons/cart.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon3.svg';
import { ReactComponent as RewardIcon } from '../../assets/icons/reward-icon.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import CameraIconButton from '../../components/Common/CameraIconButton';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import AddShop from '../../components/Shared/AddShop';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import FlaggedViews from './FlaggedViews';
import ShopDetails from './ShopDetails';
import { CoverPhotoButton, createShopData, menuOtions } from './helper';

export default function ShopProfile({ setLoading = () => {}, loading }) {
  const theme = useTheme();
  const routeMatch = useRouteMatch();
  const history = useHistory();

  const { currentUser, dispatchCurrentUser, dispatchShopTabs } = useGlobalContext();
  const { shop } = currentUser;

  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

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
      dispatchShopTabs({ type: 'add-tab', payload: { shop, location: routePath } });
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
      {/* main container */}
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
          {/* banner */}
          <Box
            sx={{
              borderRadius: '7px',
              overflow: 'hidden',
              height: '350px',
              width: '100%',
              position: 'relative',
            }}
          >
            <img
              src={shop?.shopBanner}
              alt="Banner"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <CoverPhotoButton
              loading={shopMutation.isLoading || loading}
              onDrop={(acceptedFiles) => {
                onDrop(acceptedFiles, 'banner');
              }}
              label="Add Cover Photo"
            />
          </Box>
          {/* logo */}
          <Stack direction="row" gap="21px" pt={4.5}>
            <Box sx={{ position: 'relative' }}>
              <Avatar src={shop?.shopLogo} alt="Shop" variant="circular" sx={{ width: 175, height: 175 }}>
                {shop?.shopName
                  ?.split(' ')
                  .reduce((prev, cur) => prev + cur.charAt(0), '')
                  .slice(0, 3)}
              </Avatar>
              <CameraIconButton
                sx={{
                  position: 'absolute',
                  top: '129px',
                  left: '129px',
                }}
                onFileSelect={(e) => {
                  onDrop([e.target.files[0]], 'logo');
                }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '9px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {/* Active Badges */}
                <Box sx={{ background: '#417C45', width: '11px', height: '11px', borderRadius: '50%' }}></Box>
                <Box>
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: { xs: '14px', sm: '16px', md: '20px', lg: '30px' }, fontWeight: 500 }}
                    >
                      {shop?.shopName}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: '5', alignItems: 'center' }}>
                  <Typography
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: '15px',
                      fontWeight: '600',
                      marginLeft: '8px',
                    }}
                  >
                    @account manager
                  </Typography>
                  <Box>
                    <ThreeDotsMenu menuItems={menuOtions(currentUser?.userType)} handleMenuClick={menuHandler} />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ marginLeft: '20px', marginTop: '9px' }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary2,
                    fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px' },
                    fontWeight: 500,
                  }}
                >
                  Lunch, Dinner, Cafes, Breakfast . $$
                </Typography>
                <Box>
                  <Box
                    sx={{
                      color: '#417C45',
                      marginTop: '14px',
                      fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '16px' },
                    }}
                  >
                    {' '}
                    <StarIcon /> {/* this review data are dummy */}
                    <Typography variant="span" sx={{ fontWeight: 600 }}>
                      4.2
                    </Typography>{' '}
                    {/* this review data are dummy */}
                    <Typography variant="span" sx={{ fontWeight: 400, color: theme.palette.text.secondary2 }}>
                      (100+ Reviews)
                    </Typography>
                  </Box>
                  <Stack flexDirection="row" gap="16px" sx={{ marginTop: '20px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        alignContents: 'center',
                        gap: '6px',
                        backgroundColor: '#F7F9FA',
                        color: '#3F3D56',
                        padding: '10px 16px',
                        borderRadius: '7px',
                      }}
                    >
                      <AccessTime sx={{ width: '17px', height: '17px' }} />
                      <Typography sx={{ fontSize: '16px', fontWeight: 500 }} console={console.log(shop)}>
                        {shop?.avgOrderDeliveryTime < 30
                          ? '30-40'
                          : `${Math.ceil(shop?.avgOrderDeliveryTime)}-${Math.ceil(shop?.avgOrderDeliveryTime) + 10}`}
                        min
                      </Typography>
                    </Box>
                    {shop?.rewardSystem !== 'off' && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          alignContents: 'center',
                          gap: '6px',
                          backgroundColor: '#EFF8FA',
                          color: '#15BFCA',
                          padding: '10px 16px',
                          borderRadius: '7px',
                        }}
                      >
                        <RewardIcon style={{ width: '17px', height: '17px' }} />{' '}
                        <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>Rewards</Typography>
                      </Box>
                    )}
                    {shop?.freeDelivery && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          alignContents: 'center',
                          gap: '6px',
                          backgroundColor: '#5BBD4E12',
                          color: '#5BBD4E',
                          padding: '10px 16px',
                          borderRadius: '7px',
                        }}
                      >
                        <DeliveryIcon style={{ width: '17px', height: '17px' }} />
                        <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>Free</Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        alignContents: 'center',
                        gap: '6px',
                        backgroundColor: '#FCF9F0',
                        color: '#F78C3F',
                        padding: '10px 16px',
                        borderRadius: '7px',
                      }}
                    >
                      <CartIcon style={{ width: '17px', height: '17px' }} />
                      <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>Min. ${shop?.minOrderAmount}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Stack>
          {/*  tab  */}
          <Box sx={{ marginTop: '53px' }}>
            <Box sx={{ paddingBottom: '40px' }}>
              <Tabs
                value={currentTab}
                onChange={(event, newValue) => {
                  setCurrentTab(newValue);
                }}
              >
                <Tab label="Flagged" />
                <Tab label="Reviews" />
              </Tabs>
              <TabPanel
                index={0}
                value={currentTab}
                sx={{
                  padding: 0,
                }}
              >
                <FlaggedViews filteredData={shop?.flags || []} currentTab={currentTab} />
              </TabPanel>
              <TabPanel
                index={1}
                value={currentTab}
                sx={{
                  padding: 0,
                }}
              >
                <FlaggedViews filteredData={shop?.reviews || []} currentTab={currentTab} />
              </TabPanel>
            </Box>
          </Box>
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
