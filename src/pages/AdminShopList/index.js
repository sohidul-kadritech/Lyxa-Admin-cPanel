import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SearchBar from './Searchbar';
import ShopListTable from './Table';
// import ShopListTable from './ShopListTable';

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

export default function ShopList() {
  const [queryParams, setQueryParams] = useState(queryParamsInit('food'));
  const [currentTab, setCurrentTab] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  const shopsQuery = useQuery([Api.ALL_SHOP, queryParams], () => AXIOS.get(Api.ALL_SHOP, { params: queryParams }), {
    onSuccess: (data) => {
      setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
    },
  });

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
      />
    </Box>
  );
}
