import { Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import TabPanel from '../../../components/Common/TabPanel';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import ShopRatingTable from './Table';

const getMockRating = (length) => {
  const items = [];

  for (let i = 0; i < length; i++) {
    items?.push({
      _id: i,
      rating: '4.5',
      reivew: 'This is dummy',
      orderId: '#455167',
      account: 'Karina Clark',
      type: 'Cash',
      amount: '$40',
      shop: {
        shopName: 'Shop 1',
      },
    });
  }

  return items;
};

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
  { value: 'shop', label: 'Shops' },
  { value: 'rider', label: 'Riders' },
];

export default function UserRatings() {
  const [currentTab, setCurrentTab] = useState('shop');

  return (
    <Box>
      <Box pb="30px">
        <StyledTabs2 options={tabsOptions} value={currentTab} onChange={setCurrentTab} se />
      </Box>
      <TabPanel index="shop" noPadding value={currentTab}>
        <ShopRatingTable rows={getMockRating(10)} type="shop" />
      </TabPanel>
      <TabPanel index="rider" noPadding value={currentTab}>
        <ShopRatingTable rows={getMockRating(10)} type="rider" />
      </TabPanel>
    </Box>
  );
}
