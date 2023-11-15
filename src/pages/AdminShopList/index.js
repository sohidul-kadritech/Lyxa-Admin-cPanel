/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box, Drawer, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../components/Common/PageTop';
import AddShop from '../../components/Shared/AddShop';
import ViewShopInfo from '../../components/Shared/ViewShopInfo';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import { useGlobalContext } from '../../context';
import useQueryParams from '../../helpers/useQueryParams';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SearchBar from './Searchbar';
import ShopListTable from './Table';

const tabOptionsForSubscriptions = [
  { value: 'undefined', label: 'All' },
  { value: 'no', label: 'Normal' },
  { value: 'yes', label: 'Subscription' },
];

const queryParamsInit = (type) => ({
  page: 1,
  pageSize: 10,
  searchKey: '',
  sortBy: 'desc',
  type,
  shopStatus: 'all',
  liveStatus: 'all',
  sortByOrders: '',
  sortByAvgTime: '',
  sortByRating: '',
  sortByProfit: '',
  zoneId: '',
  shopBrand: '',
});

const tabValueToTypeMap = { 0: 'food', 1: 'grocery', 2: 'pharmacy' };

const menuItems = [
  { label: 'View Shop', value: 'view' },
  { label: 'Access as Shop', value: 'access' },
  { label: 'Go to marketing', value: 'marketing' },
  { label: 'Edit Shop', value: 'edit' },
];

export default function ShopList() {
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const { dispatchCurrentUser, dispatchShopTabs } = useGlobalContext();
  const [queryParams, setQueryParams] = useQueryParams(queryParamsInit('food'));

  const [currentTab, setCurrentTab] = useState(0);

  const [plusShop, setPlusShop] = useState(queryParams?.plusShop ? queryParams?.plusShop : 'undefined');

  const [totalPage, setTotalPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [currentShop, setCurrentShop] = useState({});

  const shopsQuery = useQuery(
    [Api.ALL_SHOP, queryParams],
    () =>
      AXIOS.get(Api.ALL_SHOP, {
        params: {
          ...queryParams,
        },
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    },
  );

  const handleMenuClick = (menu, shop) => {
    if (menu === 'edit') {
      setCurrentShop(shop);
      setOpen(menu);
    }

    if (menu === 'view') {
      setCurrentShop(shop);
      setOpen(menu);
    }

    if (menu === 'access') {
      const routePath = `/shop/dashboard/${shop._id}`;
      history.push(routePath);
      dispatchCurrentUser({ type: 'shop', payload: { shop } });
      dispatchShopTabs({ type: 'add-tab', payload: { shop, location: routePath, seller: {}, from: routeMatch?.url } });
    }

    if (menu === 'marketing') {
      console.log('payload: ', { type: 'shop', payload: { shop } });
      dispatchCurrentUser({ type: 'shop', payload: { shop } });
      history.push(`/shops/${shop?._id}/marketing`, shop);
    }
  };

  return (
    <Box>
      <PageTop title="Shop List" />
      <Box pb={12}>
        <Tabs
          value={currentTab}
          sx={{
            '& .MuiTab-root': {
              padding: '8px 12px',
              textTransform: 'none',
            },
          }}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
            setQueryParams(() => queryParamsInit(tabValueToTypeMap[newValue]));
          }}
        >
          <Tab label="Restaurant" />
          <Tab label="Grocery" />
          <Tab label="Pharmacy" />
        </Tabs>

        <Stack pt="20px" pb="20px" gap={2}>
          <StyledTabs2
            value={plusShop}
            options={tabOptionsForSubscriptions}
            onChange={(value) => {
              setPlusShop(value);
              setQueryParams((prev) => {
                let plusShop = value;

                if (value === 'undefined') {
                  plusShop = undefined;
                }

                return { ...prev, plusShop };
              });
            }}
          />
          <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} searchPlaceHolder="Search shops" />
        </Stack>
        <ShopListTable
          shops={shopsQuery?.data?.data?.shops}
          loading={shopsQuery?.isLoading}
          queryParams={queryParams}
          totalPage={totalPage}
          setQueryParams={setQueryParams}
          menuItems={menuItems}
          handleMenuClick={handleMenuClick}
          refetch={shopsQuery?.refetch}
        />
      </Box>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(null);
          setCurrentShop({});
        }}
      >
        {open === 'edit' && (
          <AddShop
            refetch={() => {
              shopsQuery.refetch();
            }}
            editShop={{
              ...currentShop,
            }}
            onClose={() => {
              setOpen(null);
              setCurrentShop({});
            }}
          />
        )}
        {open === 'view' && (
          <ViewShopInfo
            selectedShop={currentShop}
            onClose={() => {
              setOpen(null);
              setCurrentShop({});
            }}
          />
        )}
      </Drawer>
    </Box>
  );
}
