/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import useQueryParams from '../../../helpers/useQueryParams';

import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import { useGlobalContext } from '../../../context';
import * as API_URL from '../../../network/Api';
import Orders from '../../AdminOrderTable/Orders';

const defaultSearchParams = (type = 'urgent') => ({
  page: 1,
  pageSize: 20,
  sortBy: 'DESC',
  startDate: getFirstMonday('week').format('YYYY/MM/DD'),
  endDate: moment().format('YYYY/MM/DD'),
  searchKey: '',
  orderType: 'all',
  model: '',
  type: 'ongoing',
  errorOrderType: type,
});

function UrgentOrderTable({ api = API_URL.URGENT_ORDER_LIST, type = 'urgent', showFor = 'customerService' }) {
  const [queryParams, setQueryParams] = useQueryParams(defaultSearchParams(type));

  const [order, setOrder] = useState({});

  const { currentUser } = useGlobalContext();

  return (
    <Box>
      <Orders
        paddingTop={0}
        showFor={showFor}
        urgentOrderCountParams={{
          assignedCustomerService: currentUser?.admin?.adminType === 'customerService' ? currentUser?.admin?._id : '',
        }}
        api={api}
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
