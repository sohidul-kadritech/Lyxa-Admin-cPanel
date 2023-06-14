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
import ViewSellerInfo from './ViewSellerInfo';
// import ViewShopInfo from './ViewShopInfo';
import AddShop from '../../components/Shared/AddShop';
import ViewShopInfo from '../../components/Shared/ViewShopInfo';
import useAccessAsUser from '../../helpers/useAccessAsUser';
import { generateDataForSellerDocuments, getThreedotMenuOptions, sellerShopTabType } from './helpers';

function SellersProfileInfo({ data = {}, theme, threeDotHandler }) {
  return (
    <Box>
      <Stack direction="row" gap="25px" flexWrap="wrap">
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
                  {data?.company_name}
                </Typography>
                <Typography variant="body4" sx={{ fontWeight: '600 !important', color: theme?.palette?.primary.main }}>
                  @account manager
                </Typography>
              </Stack>
              <Box>
                <ThreeDotsMenu
                  handleMenuClick={(menu) => {
                    threeDotHandler(menu);
                  }}
                  menuItems={getThreedotMenuOptions}
                />
              </Box>
            </Stack>
            <Stack direction="row" gap="16px">
              <Stack direction="row" alignItems="center" gap="5.4px">
                <LocationIcon />{' '}
                <Typography
                  variant="h4"
                  flex={1}
                  sx={{
                    fontWeight: '500!important',
                    maxWidth: '350px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {data?.addressSeller?.address}
                </Typography>
              </Stack>

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

function SellersProfile({
  currentSeller = {},
  setAddSidebarOpen,
  setOpenLyxaChargeSidebar,
  setIsEdit,
  replaceDocument,
  removeDocument,
  isConfirmModal,
  setIsConfirmModal,
  editSellerQuery,
  editDocumentOpen,
  setEditDocumentOpen,
}) {
  console.log('shop profile: ', currentSeller);
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [tabName, setTabName] = useState('Shop List');
  const [sort, setSort] = useState('');
  const [status, setStatus] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedShop, setSelectedShop] = useState({});
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedMenu, setSelectedMenu] = useState('');

  const accessAsUser = useAccessAsUser();

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
  const sortHandler = (e) => {
    // console.log(e.target.value, 'sort');
    setSort(e.target.value);
    // const oldOrderData = currentSeller?.shops
    // // const oldOrderData = currentSeller?.shops;
    // console.log('=====>', oldOrderData);
    // if (e.target.value === 'asc') {
    //   // eslint-disable-next-line no-unsafe-optional-chaining
    //   oldOrderData.sort((a, b) => a?.shopName - b?.shopName);

    //   console.log('asc sorted data', oldOrderData);
    // } else if (e.target.value === 'dsc') {
    //   // eslint-disable-next-line no-unsafe-optional-chaining
    //   oldOrderData.sort((a, b) => b?.shopName - a?.shopName);

    //   console.log('dsc sorted data', oldOrderData);
    // }
  };

  const statusShopHandler = (e) => {
    setStatus(e.target.value);
    if (e.target.value !== 'all') {
      const filteredData = currentSeller?.shops.filter((item) => item.shopStatus === e.target.value);
      console.log(filteredData);
      setSearchResult([...filteredData]);
      return;
    }

    setSearchResult(currentSeller?.shops);
  };

  const threeDotHandler = (menu) => {
    setSelectedMenu(menu);
    console.log('menu-->', menu);
    if (menu === 'view') {
      setOpen(true);
      return;
    }
    if (menu === 'edit_seller') {
      setAddSidebarOpen(true);
      setIsEdit(true);
      return;
    }
    if (menu === 'update_lyxa_charge') {
      setOpenLyxaChargeSidebar(true);
      setIsEdit(true);
    }
    if (menu === 'access_as_seller') {
      accessAsUser('admin', 'seller', currentSeller);
    }
  };
  const closeModal = () => {
    setSelectedMenu('');
    setOpen(false);
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
          <SellersProfileInfo threeDotHandler={threeDotHandler} data={currentSeller} theme={theme} />
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
                placeholder: 'Sort',
                value: sort,
                items: sortOptions,
                size: 'sm2',
                onChange: sortHandler,
                // onChange: (e) => setSort(e.target.value),
              }}
            />

            <StyledFormField
              intputType="select"
              containerProps={{
                sx: { padding: '0px 0px' },
              }}
              inputProps={{
                name: 'status',
                placeholder: 'Status',
                value: status,
                items: statusTypeOptions,
                size: 'sm2',
                onChange: statusShopHandler,

                // onChange: (e) => setStatus(e.target.value),
              }}
            />
          </Stack>
          <ShopList
            setSelectedShop={setSelectedShop}
            currentSeller={currentSeller}
            editSellerQuery={editSellerQuery}
            isConfirmModal={isConfirmModal}
            editDocumentOpen={editDocumentOpen}
            setEditDocumentOpen={setEditDocumentOpen}
            setIsConfirmModal={setIsConfirmModal}
            setSelectedMenu={setSelectedMenu}
            setOpen={setOpen}
            tabName={tabName}
            replaceDocument={replaceDocument}
            removeDocument={removeDocument}
            data={tabName === 'Shop List' ? searchResult || [] : generateDataForSellerDocuments(currentSeller) || []}
          />
        </Stack>
      ) : (
        <Stack alignContent="center" justifyContent="center">
          <Typography flex={1} varient="h3" sx={{ fontWeight: 500 }} textAlign="center">
            No seller profile found
          </Typography>
        </Stack>
      )}

      <Drawer open={open} anchor="right">
        {selectedMenu === '' && (
          <ViewShopInfo selectedShop={{ ...selectedShop, seller: currentSeller }} onClose={closeModal} />
        )}
        {selectedMenu === 'view' && <ViewSellerInfo selectedSeller={currentSeller} onClose={closeModal} />}
        {selectedMenu === 'edit_shop' && <AddShop editShop={selectedShop} onClose={() => setOpen(false)} />}
      </Drawer>
    </Box>
  );
}

export default SellersProfile;
