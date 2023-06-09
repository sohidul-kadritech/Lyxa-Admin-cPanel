import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import AddShop from '../../components/Shared/AddShop';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SearchBar from './Searchbar';
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
  const [queryParams, setQueryParams] = useState(queryParamsInit('food'));
  const [currentTab, setCurrentTab] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState({});

  const shopsQuery = useQuery([Api.ALL_SHOP, queryParams], () => AXIOS.get(Api.ALL_SHOP, { params: queryParams }), {
    onSuccess: (data) => {
      setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
    },
  });

  const handleMenuClick = (menu, shop) => {
    if (menu === 'edit') {
      setCurrentShop(shop);
      setOpen(true);
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
        <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} searchPlaceHolder="Search shops" />
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
          setOpen(false);
          setCurrentShop({});
        }}
      >
        <AddShop
          editShop={currentShop}
          onClose={() => {
            setOpen(false);
            setCurrentShop({});
          }}
        />
      </Drawer>
    </Box>
  );
}
