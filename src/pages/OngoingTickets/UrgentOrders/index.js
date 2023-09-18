/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import useQueryParams from '../../../helpers/useQueryParams';

import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import * as API_URL from '../../../network/Api';
import Orders from '../../AdminOrderTable/Orders';

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
  errorOrderType: 'urgent',
};

function UrgentOrderTable() {
  const [queryParams, setQueryParams] = useQueryParams(defaultSearchParams);
  const [order, setOrder] = useState({});
  // const [currentTab, setCurrentTab] = useState(getCurrentTab(queryParams));
  return (
    <Box>
      <Orders
        paddingTop={0}
        showFor="customerService"
        api={API_URL.URGENT_ORDER_LIST}
        showTabs={{
          category: true,
          errorOrderType: false,
        }}
        type="ongoing"
        queryParams={{ ...queryParams }}
        setQueryParams={setQueryParams}
      />
    </Box>
  );
}

export default UrgentOrderTable;
