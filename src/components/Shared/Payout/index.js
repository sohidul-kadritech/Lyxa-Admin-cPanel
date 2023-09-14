/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Modal } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { convertDate } from '../../../pages/LyxaFinancials/OrderFinancials';
import ConfirmModal from '../../Common/ConfirmModal';
import { getFirstMonday } from '../../Styled/StyledDateRangePicker/Presets';
import PayoutView from './PayoutView';
import SearchBar from './SearchBar';
import { getPayoutData, validatePaidPayout } from './helpers';
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

  const [isConfirm, setIsConfirm] = useState(false);

  const [queryParams, setQueryParams] = useState({ ...queryParamsInit({ ...payaoutParams }) });

  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');

  const queryClient = useQueryClient();

  const getPayoutsQuery = useQuery([API_URL.GET_PAYOUTS, { ...queryParams }], () =>
    AXIOS.get(API_URL.GET_PAYOUTS, {
      params: {
        ...queryParams,
        startDate: convertDate(queryParams?.startDate),
        endDate: convertDate(queryParams?.endDate),
      },
    }),
  );

  const paidPayoutMutation = useMutation((data) => AXIOS.post(API_URL.PAID_PAYOUTS, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries(API_URL.GET_PAYOUTS);
        setIsConfirm(false);
      }
    },
  });
  console.log('getPayoutsQuery', getPayoutsQuery?.data?.data?.payouts);

  const payoutPaidHandler = () => {
    const validated = validatePaidPayout(currentPayout);

    if (!validated?.status) {
      successMsg('Payout data is not valid');

      return;
    }
    paidPayoutMutation.mutate(validated?.data);
  };

  return (
    <Box sx={{ marginTop }}>
      <Box sx={{ marginBottom }}>
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          searchPlaceHolder="Search payouts by Id..."
        />
      </Box>

      <PayoutTable
        payoutData={getPayoutsQuery?.data?.data?.payouts}
        showFor={showFor}
        loading={getPayoutsQuery?.isLoading}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        totalPage={getPayoutsQuery?.data?.data.paginate?.metadata?.page?.totalPage}
        setCurrentPayout={setCurrentPayout}
        setIsConfirm={setIsConfirm}
        setOpen={setOpen}
      />

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setCurrentPayout({});
        }}
      >
        <PayoutView
          currentPayout={getPayoutData(currentPayout)}
          onClose={() => {
            setOpen(false);
            setCurrentPayout({});
          }}
          setIsConfirm={setIsConfirm}
        />
      </Modal>

      <ConfirmModal
        message="Do you want to mark this payout as paid?"
        isOpen={isConfirm}
        loading={paidPayoutMutation?.isLoading}
        onCancel={() => {
          setIsConfirm(false);
        }}
        onConfirm={() => {
          payoutPaidHandler();
        }}
      />
    </Box>
  );
}

export default PayoutList;
