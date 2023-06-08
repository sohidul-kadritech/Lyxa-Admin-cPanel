import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SearchBar from '../Flags/Searchbar';
import ShopRatingTable from './ShopRating';

// const getMockRating = (length) => {
//   const items = [];

//   for (let i = 0; i < length; i++) {
//     items?.push({
//       _id: i,
//       status: Math.random() < 0.5,
//       orderId: '#455167',
//       account: 'Karina Clark',
//       type: 'Cash',
//       amount: '$40',
//       shop: {
//         shopName: 'Shop 1',
//       },
//     });
//   }

//   return items;
// };

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  deliveryBoyId: '',
};

const tabsOptions = [
  { value: 'customer', label: 'Customer Rating' },
  { value: 'shop', label: 'Shop Rating' },
];

export default function RiderRating({ rider }) {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit, deliveryBoyId: rider._id });
  const [currentTab, setCurrentTab] = useState('shop');

  const shopRatingsQuery = useQuery([Api.DELIVERY_BOY_SHOP_RATING, queryParams], () =>
    AXIOS.get(Api.DELIVERY_BOY_SHOP_RATING, {
      params: queryParams,
    })
  );

  console.log(shopRatingsQuery.data);

  return (
    <Box>
      <Box pb="30px">
        <StyledTabs2 options={tabsOptions} value={currentTab} onChange={setCurrentTab} se />
      </Box>
      <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} searchPlaceHolder="Search Ratings" />
      <Grid container spacing={5} pb={7.5}>
        <InfoCard title="Positive" value={shopRatingsQuery.data?.data?.positive || 0} sm={6} md={4} lg={3} />
        <InfoCard title="Negative" value={shopRatingsQuery.data?.data?.negative || 0} sm={6} md={4} lg={3} />
        <InfoCard title="Average Rating" value="75%" sm={6} md={4} lg={3} />
      </Grid>
      <ShopRatingTable rows={shopRatingsQuery?.data?.data?.orders} />
    </Box>
  );
}
