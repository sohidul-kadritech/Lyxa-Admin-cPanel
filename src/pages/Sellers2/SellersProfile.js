import { Avatar, Box, Drawer, Stack, Tab, Tabs, Typography, debounce, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
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
import TablePagination from '../../components/Common/TablePagination';
import AddShop from '../../components/Shared/AddShop';
import ViewShopInfo from '../../components/Shared/ViewShopInfo';
import useAccessAsUser from '../../helpers/useAccessAsUser';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { generateDataForSellerDocuments, getThreedotMenuOptions, sellerShopTabType } from './helpers';

function SellersProfileInfo({ data = {}, theme, threeDotHandler }) {
  const history = useHistory();
  const routeMatch = useRouteMatch();
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
            <Stack direction="row" flexWrap="wrap">
              <Stack flex={1} direction="row" alignItems="center" flexWrap="wrap" gap="16px">
                <Typography
                  variant="h2"
                  sx={{ textTransform: 'capitalize', fontWeight: '500 !important', fontSize: '30px !important' }}
                >
                  {data?.company_name}
                </Typography>
                {data?.accountManager?.name && (
                  <Typography
                    variant="body4"
                    onClick={() => {
                      if (data?.accountManager?._id) {
                        history.push({
                          pathname: `/accountManager/${data?.accountManager._id}`,
                          state: { from: routeMatch?.path, backToLabel: 'Back to seller list' },
                        });
                      }
                    }}
                    sx={{ fontWeight: '600 !important', cursor: 'pointer', color: theme?.palette?.primary.main }}
                  >
                    {data?.accountManager?.name ? `@${data?.accountManager?.name} (Account Manager)` : ''}
                  </Typography>
                )}
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
            <Stack direction="row" flexWrap="wrap" gap="16px">
              <Stack direction="row" alignItems="center" gap="5.4px">
                <LocationIcon />{' '}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: '500!important',
                    overflow: 'hidden',
                    maxWidth: '350px',
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
  refatch,
}) {
  console.log('shop profile: ', currentSeller);
  const theme = useTheme();

  const [queryParams, setQueryParams] = useState({
    searchKey: '',
    sortBy: 'asc',
    shopStatus: 'all',
    page: 1,
    pageSize: 10,
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [tabName, setTabName] = useState('Shop List');

  const [selectedShop, setSelectedShop] = useState({});
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const [selectedMenu, setSelectedMenu] = useState('');

  const accessAsUser = useAccessAsUser();

  const history = useHistory();

  const threeDotHandler = (menu) => {
    setSelectedMenu(menu);
    console.log('=======>', menu);

    if (menu === 'view') {
      setOpen(true);
    }
    if (menu === 'edit_seller') {
      setAddSidebarOpen(true);
      setIsEdit(true);
    }
    if (menu === 'update_lyxa_charge') {
      setOpenLyxaChargeSidebar(true);
      setIsEdit(true);
    }
    if (menu === 'access_as_seller') {
      accessAsUser('admin', 'seller', currentSeller);
    }
    if (menu === 'go_to_financials') {
      history.push(
        // eslint-disable-next-line prettier/prettier
        `/app-wallet/seller/shops-transactions?sellerId=${currentSeller._id}&companyName=${currentSeller.company_name}`,
      );
    }
    if (menu === 'add_shop') {
      setSelectedShop({});
      setOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedMenu('');
    setOpen(false);
  };

  const getSingleShop = useQuery(
    [API_URL.SELLER_DASHBOARD_SHOP_LIST, { ...queryParams, sellerId: currentSeller?._id }],
    () =>
      AXIOS.get(API_URL.SELLER_DASHBOARD_SHOP_LIST, {
        params: { ...queryParams, sellerId: currentSeller?._id },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          const totalPage = data?.data?.paginate?.metadata?.page?.totalPage;
          setQueryParams((prev) => ({ ...prev, totalPage }));
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );
  console.log('getSingleShop', getSingleShop?.data?.data?.shopList);

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
            <StyledSearchBar
              sx={{ flex: '1' }}
              placeholder="Search"
              onChange={debounce(
                (e) => {
                  setQueryParams((prev) => ({ ...prev, searchKey: e.target.value }));
                },
                // eslint-disable-next-line prettier/prettier
                300,
              )}
            />
            <StyledFormField
              intputType="select"
              containerProps={{
                sx: { padding: '0px 0px' },
              }}
              inputProps={{
                name: 'sortBy',
                placeholder: 'Sort',
                value: queryParams.sortBy,
                items: sortOptions,
                size: 'sm2',
                onChange: (e) => setQueryParams((prev) => ({ ...prev, [e.target.name]: e.target.value })),
              }}
            />
            <StyledFormField
              intputType="select"
              containerProps={{
                sx: { padding: '0px 0px' },
              }}
              inputProps={{
                name: 'shopStatus',
                placeholder: 'Status',
                value: queryParams.shopStatus,
                items: statusTypeOptions,
                size: 'sm2',
                onChange: (e) => setQueryParams((prev) => ({ ...prev, [e.target.name]: e.target.value })),
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
            loading={getSingleShop?.isLoading}
            replaceDocument={replaceDocument}
            removeDocument={removeDocument}
            data={
              tabName === 'Shop List'
                ? getSingleShop?.data?.data?.shopList || []
                : generateDataForSellerDocuments(currentSeller) || []
            }
          />
          <TablePagination
            totalPage={queryParams?.totalPage}
            currentPage={queryParams?.page}
            lisener={(value) => {
              setQueryParams((prev) => ({ ...prev, page: value }));
            }}
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
        {(selectedMenu === 'edit_shop' || selectedMenu === 'add_shop') && (
          <AddShop
            refetch={() => {
              refatch();
              queryClient.invalidateQueries(API_URL.SELLER_DASHBOARD_SHOP_LIST);
            }}
            editShop={selectedShop}
            seller={currentSeller}
            onClose={() => {
              setOpen(() => false);
              setSelectedShop({});
            }}
          />
        )}
      </Drawer>
    </Box>
  );
}

export default SellersProfile;
