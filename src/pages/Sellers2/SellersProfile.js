/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Avatar, Box, Drawer, Stack, Tab, Tabs, Tooltip, Typography, debounce, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { ReactComponent as MailIcon } from '../../assets/icons/envelope.svg';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone.svg';
import InfoListItem from '../../components/Common/InfoListItem';
import TablePagination from '../../components/Common/TablePagination';
import StyledFormField from '../../components/Form/StyledFormField';
import AddShop from '../../components/Shared/AddShop';
import ClickableAddress from '../../components/Shared/ClickableAddress';
import ViewShopInfo from '../../components/Shared/ViewShopInfo';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';
import useAccessAsUser from '../../helpers/useAccessAsUser';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { sortOptions } from '../Faq2/helpers';
import { statusTypeOptions } from '../Product1/helpers';
import AccountManagerInfo from '../ShopProfile/AccountManagerInfo';
import { statusColor } from '../ShopProfile/Info';
import ShopList from './ShopList';
import ViewSellerInfo from './ViewSellerInfo';
import { generateDataForSellerDocuments, getThreedotMenuOptions, sellerShopTabType } from './helpers';

function SellersProfileInfo({ data = {}, theme, threeDotHandler, adminType }) {
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
                <Tooltip title={data?.status === 'active' ? 'Active' : 'Inactive'}>
                  <Box
                    sx={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: data?.status === 'active' ? statusColor.green : statusColor.yellow,
                    }}
                  />
                </Tooltip>
                <Typography
                  variant="h2"
                  sx={{ textTransform: 'capitalize', fontWeight: '500 !important', fontSize: '30px !important' }}
                >
                  {data?.company_name}
                </Typography>
                {data?.accountManager?.name && <AccountManagerInfo accountManager={data?.accountManager} />}
              </Stack>
              <Box>
                <ThreeDotsMenu
                  handleMenuClick={(menu) => {
                    threeDotHandler(menu);
                  }}
                  menuItems={getThreedotMenuOptions(adminType)}
                />
              </Box>
            </Stack>
            <Stack direction="row" flexWrap="wrap">
              <ClickableAddress latitude={data?.sellerAddress?.latitude} longitude={data?.sellerAddress?.longitude}>
                <InfoListItem
                  titleSx={{
                    overflow: 'hidden',
                    maxWidth: '450px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={data?.sellerAddress?.address}
                  icon={LocationIcon}
                  isFirst
                />
              </ClickableAddress>
              <InfoListItem title={data?.phone_number} icon={PhoneIcon} link={`tel:${data?.phone_number}`} />
              <InfoListItem title={data?.email} icon={MailIcon} link={`mailto:${data?.email}`} />
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

  const queryClient = useQueryClient();

  const [selectedMenu, setSelectedMenu] = useState('');

  const accessAsUser = useAccessAsUser();

  const { currentUser } = useGlobalContext();

  const { admin } = currentUser;

  const history = useHistory();

  const threeDotHandler = (menu) => {
    setSelectedMenu(menu);

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
    },
  );

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
          <SellersProfileInfo
            threeDotHandler={threeDotHandler}
            data={currentSeller}
            adminType={admin?.adminType}
            theme={theme}
          />
          <Box marginTop="30px" marginBottom="23px">
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => {
                setTabName(sellerShopTabType[newValue]);
                setCurrentTab(newValue);
                setQueryParams((prev) => ({ ...prev, searchKey: '' }));
              }}
            >
              <Tab label="Shop List"></Tab>
              <Tab label="Documents"></Tab>
            </Tabs>
          </Box>
          {currentTab !== 1 && (
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
                tooltip="Sort by orders"
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
                tooltip="Filter by shop status"
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
          )}

          <ShopList
            adminType={admin?.adminType}
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
          {currentTab !== 1 && (
            <TablePagination
              totalPage={queryParams?.totalPage}
              currentPage={queryParams?.page}
              lisener={(value) => {
                setQueryParams((prev) => ({ ...prev, page: value }));
              }}
            />
          )}
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
