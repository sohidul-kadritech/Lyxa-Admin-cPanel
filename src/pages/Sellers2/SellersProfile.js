import { Avatar, Box, Drawer, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ReactComponent as CircleIcon } from '../../assets/icons/circle-dot.svg';
import { ReactComponent as MailIcon } from '../../assets/icons/envelope.svg';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone.svg';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { sortOptions } from '../Faq2/helpers';
import { statusTypeOptions } from '../Product1/helpers';
import ShopList from './ShopList';
import ViewShopInfo from './ViewShopInfo';
import { getThreedotMenuOptions, sellerShopTabType } from './helpers';

function SellersProfileInfo({ data = {}, theme }) {
  return (
    <Box>
      <Stack direction="row" gap="25px">
        <Avatar src={data?.profile_photo} alt="photo" sx={{ width: 100, height: 100, textTransform: 'uppercase' }}>
          <Typography variant="h1" sx={{ color: '#ffffff !important' }}>
            {data?.name
              ?.split(' ')
              .reduce((prev, curr) => prev + curr[0], '')
              .slice(0, 2)}
          </Typography>
        </Avatar>
        <Box flex={1}>
          <Stack gap="13px">
            <Stack direction="row">
              <Stack flex={1} direction="row" alignItems="center" gap="16px">
                <Typography
                  variant="h2"
                  sx={{ textTransform: 'capitalize', fontWeight: '500 !important', fontSize: '30px !important' }}
                >
                  {data?.name}
                </Typography>
                <Typography variant="body4" sx={{ fontWeight: '600 !important', color: theme?.palette?.primary.main }}>
                  @account manager
                </Typography>
              </Stack>
              <Box>
                <ThreeDotsMenu
                  // handleMenuClick={(menu) => {
                  //   threeDotHandler(menu, params?.row);
                  // }}
                  menuItems={getThreedotMenuOptions}
                />
              </Box>
            </Stack>
            <Stack direction="row" gap="16px">
              <Typography variant="h4" sx={{ fontWeight: '500!important' }}>
                <Stack direction="row" alignItems="center" gap="5.4px">
                  <LocationIcon /> {data?.addressSeller?.address}
                </Stack>
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: '500!important' }}>
                <Stack direction="row" alignItems="center" gap="16px">
                  <CircleIcon />
                  <Stack direction="row" alignItems="center" gap="5.4px">
                    <PhoneIcon /> {data?.phone_number}
                  </Stack>
                </Stack>
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: '500!important' }}>
                <Stack direction="row" alignItems="center" gap="16px">
                  <CircleIcon />
                  <Stack direction="row" alignItems="center" gap="5.4px">
                    <MailIcon /> {data?.email}
                  </Stack>
                </Stack>
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function SellersProfile({ currentSeller = {} }) {
  console.log('shop profile: ', currentSeller);
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [tabName, setTabName] = useState('Shop List');
  const [sort, setSort] = useState('');
  const [status, setStatus] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedShop, setSelectedShop] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearchResult(currentSeller?.shops);
  }, [currentSeller]);

  const searchResultHandler = (e) => {
    if (e.target.value) {
      console.log(e.target.value);
      const matchData = currentSeller?.shops.filter((obj) =>
        // eslint-disable-next-line prettier/prettier
        obj.shopName.toString().toLowerCase().includes(e.target.value.toLowerCase()),
      );
      console.log('matchData', matchData);
      setSearchResult(() => [...matchData]);
    } else {
      setSearchResult(() => [...currentSeller.shops]);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.contrastText,
        padding: '44px 40px 38px',
        borderRadius: '7px',
        border: `1px solid ${theme.palette.custom.border}`,
      }}
    >
      {Object?.keys(currentSeller)?.length > 0 ? (
        <Stack>
          <SellersProfileInfo data={currentSeller} theme={theme} />
          <Box marginTop="30px" marginBottom="23px">
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => {
                setTabName(sellerShopTabType[newValue]);
                setCurrentTab(newValue);
              }}
            >
              <Tab label="Shop List"></Tab>
              <Tab label="Documents"></Tab>
            </Tabs>
          </Box>
          <Stack direction="row" justifyContent="start" gap="17px" marginBottom="30px">
            <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={searchResultHandler} />

            <StyledFormField
              intputType="select"
              containerProps={{
                sx: { padding: '0px 0px' },
              }}
              inputProps={{
                name: 'sort',
                placeholder: 'sort',
                value: sort,
                items: sortOptions,
                size: 'sm2',
                onChange: (e) => setSort(e.target.value),
              }}
            />

            <StyledFormField
              intputType="select"
              containerProps={{
                sx: { padding: '0px 0px' },
              }}
              inputProps={{
                name: 'status',
                placeholder: 'status',
                value: status,
                items: statusTypeOptions,
                size: 'sm2',
                onChange: (e) => setStatus(e.target.value),
              }}
            />
          </Stack>
          <ShopList setSelectedShop={setSelectedShop} setOpen={setOpen} tabName={tabName} data={searchResult || []} />
        </Stack>
      ) : (
        <Stack alignContent="center" justifyContent="center">
          <Typography flex={1} varient="h3" sx={{ fontWeight: 500 }} textAlign="center">
            No seller profile found
          </Typography>
        </Stack>
      )}

      <Drawer open={open} anchor="right">
        <ViewShopInfo selectedShop={selectedShop} onClose={() => setOpen(false)} />
      </Drawer>
    </Box>
  );
}

export default SellersProfile;
