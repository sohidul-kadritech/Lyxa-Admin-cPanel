import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import AddShop from '../../components/Shared/AddShop';
import ViewShopInfo from '../../components/Shared/ViewShopInfo';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import ShopListTable from './Table';

const queryParamsInit = (type) => ({
  page: 1,
  pageSize: 10,
  searchKey: '',
  sortBy: 'desc',
  type,
  shopStatus: 'all',
  liveStatus: 'all',
});

const tabValueToTypeMap = { 0: 'food', 1: 'grocery', 2: 'pharmacy' };

const menuItems = [
  { label: 'View Shop', value: 'view' },
  { label: 'Access as Shop', value: 'access' },
  { label: 'Edit Shop', value: 'edit' },
];

export default function ShopList() {
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const { dispatchCurrentUser, dispatchShopTabs } = useGlobalContext();

  const [queryParams, setQueryParams] = useState(queryParamsInit('food'));
  const [currentTab, setCurrentTab] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [currentShop, setCurrentShop] = useState({});

  const shopsQuery = useQuery([Api.ALL_SHOP, queryParams], () => AXIOS.get(Api.ALL_SHOP, { params: queryParams }), {
    onSuccess: (data) => {
      setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
    },
  });

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
  };

  return (
    <Box>
      <PageTop title="Shop List" />
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
      <Box pt="30px" pb="30px">
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          searchPlaceHolder="Search shops"
          hideFilters={{
            button: true,
            status: true,
            startDate: true,
            endDate: true,
            sort: true,
          }}
        />
      </Box>
      <ShopListTable
        shops={shopsQuery?.data?.data?.shops}
        loading={shopsQuery?.isLoading}
        page={queryParams.page}
        totalPage={totalPage}
        setPage={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        menuItems={menuItems}
        handleMenuClick={handleMenuClick}
      />
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
            editShop={currentShop}
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
