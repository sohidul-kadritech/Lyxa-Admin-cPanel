import { AccessTime, AccessTimeFilled, Email } from '@mui/icons-material';
import { Avatar, Box, Drawer, IconButton, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as AverageIcon } from '../../assets/icons/averageIcon.svg';
import { ReactComponent as CalenderIcon } from '../../assets/icons/calender.svg';
import { ReactComponent as CameraIcon } from '../../assets/icons/camera.svg';
import { ReactComponent as CartIcon } from '../../assets/icons/cart.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon3.svg';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import { ReactComponent as RewardIcon } from '../../assets/icons/reward-icon.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import { ReactComponent as TagIcon } from '../../assets/icons/tag2.svg';
import { ReactComponent as Warning } from '../../assets/icons/warning-icon.svg';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

import { successMsg } from '../../helpers/successMsg';
import EditShop from './EditShop';
import FlaggedViews from './FlaggedViews';
import { CoverPhotoButton, createShopData } from './helper';
import PageSkeleton from './PageSkeleton';

function ShopTab({ data }) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
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
        {/* <Typography>Flagged</Typography> */}
        <FlaggedViews filteredData={data?.flags || []} currentTab={currentTab} />
      </TabPanel>
      <TabPanel
        index={1}
        value={currentTab}
        sx={{
          padding: 0,
        }}
      >
        <FlaggedViews filteredData={data?.reviews || []} currentTab={currentTab} />
      </TabPanel>
    </Box>
  );
}

function ShopProfileBasicInfo({ title, Icon, desc }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyItems: 'center', alignContent: 'center', alignItems: 'center', gap: '11px' }}>
        <Icon />
        <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>{title}</Typography>
      </Box>
      <Box sx={{ marginTop: '18px', fontSize: '14px', fontWeight: '500' }}>
        {' '}
        <Typography sx={{ textTransform: 'capitalize' }}>{desc}</Typography>
      </Box>
    </Box>
  );
}

function AverageOrderValue(totalProductsAmount, totalOrder) {
  return totalProductsAmount / totalOrder;
}

function TagsAndCuisines(tags, cuisines) {
  return `${cuisines?.map((cuisines) => cuisines.name).join(', ')}, ${tags?.map((tags) => tags.name).join(', ')}`;
}

function openingHours(normalHours) {
  const openingHoursSx = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#363636',
  };
  const dayStructure = (day) => {
    if (day.toLowerCase() === 'saturday') return 'Sat.';
    if (day.toLowerCase() === 'sunday') return 'Sun.';
    if (day.toLowerCase() === 'monday') return 'Mon.';
    if (day.toLowerCase() === 'tuesday') return 'Tue.';
    if (day.toLowerCase() === 'wednesday') return 'Wed.';
    if (day.toLowerCase() === 'thursday') return 'Thu.';
    if (day.toLowerCase() === 'friday') return 'Fri.';

    return '';
  };

  function convertTimeToAmPm(time) {
    const date = new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(hours, minutes, 0, 0);
    const suffix = hours >= 12 ? 'P.M' : 'A.M';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${suffix}`;
  }

  return (
    <Stack flexDirection="column" gap="10px">
      {normalHours?.map((week, i) => (
        <Box key={i}>
          <Stack flexDirection="row">
            <Typography sx={openingHoursSx} flex={2} variant="span">
              {dayStructure(week.day)}
            </Typography>
            {week.isActive ? (
              <>
                {' '}
                <Typography sx={openingHoursSx} flex={8} variant="span">
                  {convertTimeToAmPm(week.open)} - {convertTimeToAmPm(week.close)}
                </Typography>
              </>
            ) : (
              <Typography sx={openingHoursSx} variant="span">
                Closed
              </Typography>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export default function ShopProfile() {
  const shop = useSelector((store) => store.Login.admin);
  // const queryClient = useQueryClient();

  const queryClient = useQueryClient();

  const getShopData = useQuery('get-single-shop-data', () => AXIOS.get(`${API_URL.SINGLE_SHOP}?id=${shop?._id}`));

  const options = ['Edit Shop', 'Access as Shop'];

  // eslint-disable-next-line no-unused-vars
  const [sideBar, setSidebar] = useState('');

  const [open, setOpen] = useState(false);

  const editShopData = useMutation((data) => AXIOS.post(API_URL.EDIT_SHOP, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Successfully Updated', 'success');
        shop.address = data?.data?.shop?.address || shop?.address;
        shop.shopName = data?.data?.shop?.shopName || shop?.address;
        shop.email = data?.data?.shop?.email || shop?.email;
        shop.password = data?.data?.shop?.password || shop?.password;
        shop.phone_number = data?.data?.shop?.phone_number || shop?.phone_number;
        shop.shopLogo = data?.data?.shop?.shopLogo || shop?.shopLogo;
        shop.shopBanner = data?.data?.shop?.shopBanner || shop?.shopBanner;
        shop.status = data?.data?.shop?.status || shop?.status;
        shop.bank_name = data?.data?.shop?.bank_name || shop?.bank_name;
        shop.account_number = data?.data?.shop?.account_number || shop?.account_number;
        shop.bank_postal_code = data?.data?.shop?.bank_postal_code || shop?.bank_postal_code;
        shop.bank_address = data?.data?.shop?.bank_address || shop?.bank_address;
        shop.account_swift = data?.data?.shop?.account_swift || shop?.account_swift;
        queryClient.invalidateQueries('get-single-shop-data');
        setOpen(false);
      } else {
        successMsg(data?.message);
      }
    },
  });

  const theme = useTheme();

  const onDrop = async (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
			})
    );
    successMsg('Please wait It may take time !');
    const shopData = await createShopData({
      ...getShopData?.data?.data?.shop,
      password: '',
      shopBanner: newFiles,
      shopLogo: [{ preview: getShopData?.data?.data?.shop?.shopLogo }],
    });

    if (shopData?.status === false) {
      successMsg(shopData?.msg);
    }

    editShopData.mutate({ ...shopData });
  };

  const onDrop2 = async (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
			})
    );
    successMsg('Please wait It may take time !');
    const shopData = await createShopData({
      ...getShopData?.data?.data?.shop,
      password: '',
      shopLogo: newFiles,
      shopBanner: [{ preview: getShopData?.data?.data?.shop?.shopBanner }],
    });

    if (shopData?.status === false) {
      successMsg(shopData?.msg);
    }

    editShopData.mutate({ ...shopData });
  };
  return (
    <>
      {getShopData?.isLoading && <PageSkeleton />}
      {!getShopData?.isLoading && (
        <Box>
          <PageTop title="Profie" />
          {/* main container */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              paddingTop: '45px',
            }}
          >
            {/* left */}
            <Box
              sx={{
                paddingRight: '50px',
                borderRight: '1px solid #EEEEEE',
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
                  src={getShopData?.data?.data?.shop?.shopBanner}
                  alt="Banner"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <CoverPhotoButton onDrop={onDrop} label="Add Cover Photo" />
              </Box>
              {/* logo */}
              <Stack direction="row" gap="21px" pt={4.5}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={getShopData?.data?.data?.shop.shopLogo}
                    alt="Shop"
                    variant="circular"
                    sx={{ width: 175, height: 175 }}
                  >
                    {getShopData?.data?.data?.shop?.shopName
                      ?.split(' ')
                      .reduce((prev, cur) => prev + cur.charAt(0), '')
                      .slice(0, 3)}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '129px',
                      left: '129px',
                      backgroundColor: '#E4E6EB',
                      width: '38px',
                      height: '38px',
                      padding: '9px 9px 11px 9px',
                      '&:hover': {
                        backgroundColor: theme.palette.background.secondaryHover,
                      },
                    }}
                    color={theme.palette.text.primary}
                    aria-label="upload picture"
                    component="label"
                  >
                    <input hidden accept="image/*" type="file" onChange={(e) => onDrop2([e.target.files[0]])} />
                    <CameraIcon />
                  </IconButton>
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
                          {getShopData?.data?.data?.shop?.shopName}
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
                        {' '}
                        <ThreeDotsMenu
                          menuItems={options}
                          handleMenuClick={(value) => {
                            setSidebar(value);
                            setOpen(true);
                          }}
                        />
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
                        <StarIcon />{' '}
                        <Typography variant="span" sx={{ fontWeight: 600 }}>
                          4.2
                        </Typography>{' '}
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
                          <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                            {getShopData?.data?.data?.shop?.avgOrderDeliveryTime < 30
                              ? '30-40'
                              : `${Math.ceil(getShopData?.data?.data?.shop?.avgOrderDeliveryTime)}-${
                                  Math.ceil(getShopData?.data?.data?.shop?.avgOrderDeliveryTime) + 10
                                }`}
                            min
                          </Typography>
                        </Box>
                        {getShopData?.data?.data?.shop?.rewardSystem !== 'off' && (
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
                        {getShopData?.data?.data?.shop?.freeDelivery && (
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
                          <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                            Min. ${getShopData?.data?.data?.shop?.minOrderAmount}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </Stack>

              {/* Profile tab here */}
              <Box sx={{ marginTop: '53px' }}>
                {' '}
                <ShopTab data={getShopData?.data?.data?.shop} />
              </Box>
            </Box>
            {/* right */}
            <Box
              sx={{
                paddingLeft: '50px',
              }}
            >
              <Stack gap="40px">
                <ShopProfileBasicInfo
                  title="Seller"
                  desc={getShopData?.data?.data?.shop?.shopName}
                  Icon={CalenderIcon}
                />
                <ShopProfileBasicInfo
                  title="Shop Type"
                  desc={getShopData?.data?.data?.shop?.shopType}
                  Icon={CalenderIcon}
                />
                <ShopProfileBasicInfo
                  title="Location"
                  desc={getShopData?.data?.data?.shop?.address?.address}
                  Icon={Loacation}
                />
                <ShopProfileBasicInfo
                  title="Delivery by"
                  desc={getShopData?.data?.data?.shop?.haveOwnDeliveryBoy ? 'Store' : 'Lyxa'}
                  Icon={DeliveryIcon}
                />
                <ShopProfileBasicInfo
                  title="Phone number"
                  desc={getShopData?.data?.data?.shop?.phone_number}
                  Icon={Phone}
                />
                <ShopProfileBasicInfo title="Email" desc={getShopData?.data?.data?.shop?.email} Icon={Email} />
                <ShopProfileBasicInfo
                  title="Payment Options"
                  desc={getShopData?.data?.data?.shop?.paymentOption.join(', ')}
                  Icon={InfoIcon}
                />
                <ShopProfileBasicInfo
                  title="Tags & cuisines"
                  desc={TagsAndCuisines(
                    getShopData?.data?.data?.shop?.tagsId,
                    // eslint-disable-next-line prettier/prettier
										getShopData?.data?.data?.shop?.cuisineType
                  )}
                  Icon={TagIcon}
                />
                <ShopProfileBasicInfo
                  title="Average Ord. Value"
                  desc={AverageOrderValue(
                    getShopData?.data?.data?.shop?.orderValue?.productAmount,
                    // eslint-disable-next-line prettier/prettier
										getShopData?.data?.data?.shop?.orderValue?.count
                  )}
                  Icon={AverageIcon}
                />
                <ShopProfileBasicInfo title="Status" desc={getShopData?.data?.data?.shop?.shopStatus} Icon={Warning} />
                <Box sx={{ paddingBottom: '40px' }}>
                  <ShopProfileBasicInfo
                    title="Opening Hours"
                    desc={openingHours(getShopData?.data?.data?.shop?.normalHours)}
                    Icon={AccessTimeFilled}
                  />
                </Box>
              </Stack>
            </Box>
          </Box>

          <Drawer open={open} anchor="right">
            <EditShop
              editShopData={editShopData}
              loading={getShopData?.isLoading}
              shopData={{
                ...getShopData?.data?.data?.shop,
                shopLogo: [{ preview: getShopData?.data?.data?.shop.shopLogo }],
                shopBanner: [{ preview: getShopData?.data?.data?.shop.shopBanner }],
              }}
              onClose={() => setOpen(false)}
            />
          </Drawer>
        </Box>
      )}
    </>
  );
}
