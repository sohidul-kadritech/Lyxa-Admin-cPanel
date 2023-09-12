/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Modal } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { convertDate } from '../../../pages/LyxaFinancials/OrderFinancials';
import { getFirstMonday } from '../../Styled/StyledDateRangePicker/Presets';
import PayoutView from './PayoutView/PayoutView';
import SearchBar from './SearchBar';
import { getPayoutData } from './helpers';
import PayoutTable from './payoutTable';

const queryParamsInit = (props) => ({
  page: 1,
  pageSize: 15,
  sortBy: 'DESC',
  endDate: moment(),
  payoutStatus: '',
  startDate: getFirstMonday('week'),
  ...props,
});

function PayoutList({
  payaoutParams = { payoutAccount: 'shop' },
  showFor = 'shop',
  marginTop = '20px',
  marginBottom = '20px',
}) {
  const [open, setOpen] = useState(false);

  const [currentPayout, setCurrentPayout] = useState({});

  const [queryParams, setQueryParams] = useState({ ...queryParamsInit({ ...payaoutParams }) });

  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');

  const getPayoutsQuery = useQuery([API_URL.GET_PAYOUTS, { ...queryParams }], () =>
    AXIOS.get(API_URL.GET_PAYOUTS, {
      params: {
        ...queryParams,
        startDate: convertDate(queryParams?.startDate),
        endDate: convertDate(queryParams?.endDate),
      },
    }),
  );

  console.log('getPayoutsQuery', getPayoutsQuery?.data?.data?.payouts);

  return (
    <Box sx={{ marginTop }}>
      <Box sx={{ marginBottom }}>
        <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} searchPlaceHolder="Search payouts..." />
      </Box>

      <PayoutTable
        payoutData={getPayoutsQuery?.data?.data?.payouts}
        showFor={showFor}
        loading={getPayoutsQuery?.isLoading}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        totalPage={getPayoutsQuery?.data?.data.paginate?.metadata?.page?.totalPage}
        setCurrentPayout={setCurrentPayout}
        setOpen={setOpen}
      />

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setCurrentPayout({});
        }}
      >
        <PayoutView currentPayout={getPayoutData(currentPayout)} />
      </Modal>
    </Box>
  );
}

export default PayoutList;
