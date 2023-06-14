import { Box } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TabPanel from '../../../components/Common/TabPanel';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ShopRatingTable from './Table';

export const getQueryParamsInit = (userId, type) => ({
  page: 1,
  pageSize: 5,
  userId,
  type,
});

const tabsOptions = [
  { value: 'shop', label: 'Shops' },
  { value: 'deliveryBoy', label: 'Riders' },
];

export default function UserRatings({ user }) {
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(user?._id, 'shop'));

  const query = useQuery([Api.USER_REVIEWS, queryParams], () => AXIOS.get(Api.USER_REVIEWS, { params: queryParams }), {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <Box>
      <Box pb="30px">
        <StyledTabs2
          options={tabsOptions}
          value={queryParams.type}
          onChange={(value) => {
            setQueryParams((prev) => ({ ...prev, type: value }));
          }}
        />
      </Box>
      <TabPanel index="shop" noPadding value={queryParams.type}>
        <ShopRatingTable rows={query?.data?.data?.reviews} type="shop" />
      </TabPanel>
      <TabPanel index="deliveryBoy" noPadding value={queryParams.type}>
        <ShopRatingTable rows={query?.data?.data?.reviews} type="rider" />
      </TabPanel>
    </Box>
  );
}
