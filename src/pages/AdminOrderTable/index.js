/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
// third party
import { Box, Tab, Tabs } from '@mui/material';

// project import
import moment from 'moment';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';
import useQueryParams from '../../helpers/useQueryParams';
import Flags from './Flags';
import Orders from './Orders';

// also keeping reverse for searchParams
const orderFilterToTabValueMap = {
  0: 'ongoing',
  1: 'delivered',
  2: 'cancelled',
  3: 'flags',
  4: 'low-rating',
  5: 'scheduled',
  6: 'test',
  ongoing: 0,
  delivered: 1,
  cancelled: 2,
  flags: 3,
  'low-rating': 4,
  scheduled: 5,
};

const defaultSearchParams = {
  page: 1,
  pageSize: 20,
  sortBy: 'DESC',
  startDate: getFirstMonday('week').format('YYYY/MM/DD'),
  endDate: moment().format('YYYY/MM/DD'),
  searchKey: '',
  orderType: 'all',
  model: '',
  type: 'ongoing',
};

export default function AdminOrders() {
  const [queryParams, setQueryParams] = useQueryParams(defaultSearchParams);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (queryParams?.type !== 'ongoing') {
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete('errorOrderType');
      history.replace({ search: searchParams.toString() });
    }
  }, [queryParams]);

  return (
    <Box pb={9}>
      <PageTop title="Orders" />
      <Tabs
        value={orderFilterToTabValueMap[queryParams?.type]}
        onChange={(event, newValue) => {
          setQueryParams({ type: orderFilterToTabValueMap[newValue], page: 1 });
        }}
        sx={{
          '& .MuiTab-root': {
            padding: '8px 12px',
            textTransform: 'none',
          },
        }}
      >
        <Tab label="Ongoing" />
        <Tab label="Delivered" />
        <Tab label="Incomplete" />
        <Tab label="Flags" />
        <Tab label="Low Rating" />
        <Tab label="Scheduled" />
      </Tabs>
      <Box>
        <TabPanel panelKey="ongoing" value={queryParams?.type} noPadding>
          <Orders type="ongoing" queryParams={queryParams} setQueryParams={setQueryParams} />
        </TabPanel>
        <TabPanel panelKey="delivered" value={queryParams?.type} noPadding>
          <Orders paddingTop={4} type="delivered" queryParams={queryParams} setQueryParams={setQueryParams} />
        </TabPanel>
        <TabPanel panelKey="cancelled" value={queryParams?.type} noPadding>
          <Orders paddingTop={4} type="cancelled" queryParams={queryParams} setQueryParams={setQueryParams} />
        </TabPanel>
        <TabPanel index="flags" value={queryParams?.type} noPadding>
          <Flags />
        </TabPanel>
        <TabPanel index="low-rating" value={queryParams?.type} noPadding>
          <Orders paddingTop={4} type="low-rating" queryParams={queryParams} setQueryParams={setQueryParams} />
        </TabPanel>
        <TabPanel index="scheduled" value={queryParams?.type} noPadding>
          <Orders paddingTop={4} type="scheduled" queryParams={queryParams} setQueryParams={setQueryParams} />
        </TabPanel>
      </Box>
    </Box>
  );
}
