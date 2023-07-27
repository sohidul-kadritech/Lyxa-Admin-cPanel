import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TabPanel from '../../../components/Common/TabPanel';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
// import SearchBar from '../Flags/Searchbar';
import SearchBar from '../../../components/Common/CommonSearchbar';
import CustomerRatingTable from './CustomerRating';
import ShopRatingTable from './ShopRating';

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  startDate: moment().startOf('month'),
  endDate: moment(),
  searchKey: '',
  deliveryBoyId: '',
};

const tabsOptions = [
  { value: 'customer', label: 'Customer Rating' },
  { value: 'shop', label: 'Shop Rating' },
];

export default function RiderRating({ rider }) {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit, deliveryBoyId: rider._id });
  const [currentTab, setCurrentTab] = useState('customer');

  const shopRatingsQuery = useQuery([Api.DELIVERY_BOY_SHOP_RATING, queryParams], () =>
    AXIOS.get(Api.DELIVERY_BOY_SHOP_RATING, {
      params: queryParams,
    })
  );

  const customerRatingsQuery = useQuery([Api.DELIVERY_BOY_CUSTOMER_RATING, queryParams], () =>
    AXIOS.get(Api.DELIVERY_BOY_CUSTOMER_RATING, {
      params: queryParams,
    })
  );

  return (
    <Box>
      <Box pb="30px">
        <StyledTabs2 options={tabsOptions} value={currentTab} onChange={setCurrentTab} />
      </Box>
      <Box>
        <TabPanel index="customer" noPadding value={currentTab}>
          <Box pb={7.5}>
            <SearchBar
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              searchPlaceHolder="Search Ratings"
              showFilters={{
                search: true,
                date: true,
                sort: true,
              }}
            />
          </Box>
          <CustomerRatingTable
            rows={customerRatingsQuery?.data?.data?.reviews}
            loading={customerRatingsQuery.isLoading}
          />
        </TabPanel>
        <TabPanel index="shop" noPadding value={currentTab}>
          <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} searchPlaceHolder="Search Ratings" />
          <Grid container spacing={5} pb={7.5}>
            <InfoCard title="Positive" value={shopRatingsQuery.data?.data?.positive || 0} sm={6} md={4} lg={3} />
            <InfoCard title="Negative" value={shopRatingsQuery.data?.data?.negative || 0} sm={6} md={4} lg={3} />
          </Grid>
          <ShopRatingTable rows={shopRatingsQuery?.data?.data?.orders} loading={shopRatingsQuery?.isLoading} />
        </TabPanel>
      </Box>
    </Box>
  );
}
