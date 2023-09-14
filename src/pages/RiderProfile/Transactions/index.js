/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Modal, Stack, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import PayoutList from '../../../components/Shared/Payout';
import RiderPayoutBreakDown from '../../../components/Shared/RiderFinancials/RiderPayoutBreakDown';
import TransactionsTable from '../../../components/Shared/TransactionsTable';
import StyledDateRangePicker from '../../../components/Styled/StyledDateRangePicker';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MakePayment from './MakePayment';
import RiderOrderTable from './RiderOrderTable';
import SearchBar from './Searchbar';

export const queryParamsInit = {
  page: 1,
  pageSize: 10,
  sortBy: 'DESC',
  type: 'all',
  startDate: getFirstMonday('week'),
  endDate: moment(),
  searchKey: '',
};

const showForToApiMap = {
  cashOrderList: {
    get: Api.SINGLE_DELIVERY_WALLET_CASH_ORDER_LIST,
  },

  transactions: {
    get: Api.SINGLE_DELIVERY_WALLET_TRANSACTIONS,
  },
};

const amountSx = {
  fontSize: '30px!important',
};

export default function RiderTransactions({ riderId, showFor }) {
  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useState({ ...queryParamsInit, deliveryBoyId: riderId });
  const [totalPage, setTotalPage] = useState(1);
  const [makePayment, setMakePayment] = useState(false);
  const [currencyType, setCurrencyType] = useState('secondaryCurrency');
  const [summary, setSummary] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  const query = useQuery(
    [showForToApiMap[showFor]?.get, { ...queryParams, deliveryBoyId: queryParams?.deliveryBoyId || riderId }],
    () =>
      AXIOS.get(showForToApiMap[showFor]?.get, {
        params: { ...queryParams, deliveryBoyId: queryParams?.deliveryBoyId || riderId },
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage || 1);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  // on receive cash
  const receiveCashMutation = useMutation((data) => AXIOS.post(Api.RIDER_RECEIVED_PAYMENT, data), {
    onSuccess: () => {
      queryClient.invalidateQueries([Api.SINGLE_DELIVERY_WALLET_CASH_ORDER_LIST]);
      queryClient.invalidateQueries([Api.SINGLE_DELIVERY_WALLET_TRANSACTIONS]);
    },
  });

  const onReceiveCash = () => {
    const items = [];

    query?.data?.data?.cashOrderList?.forEach((trx) => {
      if (trx.selected) {
        items.push(trx?._id);
      }
    });

    if (items?.length < 1) {
      successMsg('Please select atleast one item to receive cash');
      return;
    }

    receiveCashMutation.mutate({
      deliveryBoyId: riderId,
      idList: items,
    });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end">
        <StyledDateRangePicker
          startDate={queryParams.startDate}
          endDate={queryParams.endDate}
          onChange={({ startDate, endDate }) => {
            setQueryParams((prev) => ({
              ...prev,
              startDate,
              endDate,
              page: 1,
            }));
          }}
        />
      </Stack>

      {showFor !== 'cashOrderList' && (
        <RiderPayoutBreakDown
          getCurrencyType={(data) => {
            console.log('currencyType', data);
            setCurrencyType(data?.currency);
          }}
          showFor="specific"
          riderParams={{
            riderId: queryParams?.deliveryBoyId || riderId,
            start: queryParams?.startDate,
            end: queryParams.endDate,
          }}
        />
      )}

      <Box mb={7.5}>
        <Tabs value={currentTab}>
          <Tab onClick={() => setCurrentTab(0)} label="Transaction" />
          <Tab onClick={() => setCurrentTab(1)} label="Order" />
          <Tab onClick={() => setCurrentTab(2)} label="Payouts" />
        </Tabs>
      </Box>

      {/* transaction tab */}
      {currentTab === 0 && (
        <Box>
          <SearchBar
            searchPlaceHolder="Search transactions by id"
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            onMakePayment={() => setMakePayment(true)}
            onReceiveCash={onReceiveCash}
            showFor={showFor}
            loading={receiveCashMutation.isLoading}
          />
          <TransactionsTable
            refetching={receiveCashMutation.isLoading}
            loading={query.isLoading}
            rows={query?.data?.data?.[showFor]}
            type={showFor}
            queryParams={queryParams}
          />
          <TablePagination
            currentPage={queryParams?.page}
            lisener={(page) => {
              setQueryParams((prev) => ({ ...prev, page }));
            }}
            totalPage={totalPage}
          />
        </Box>
      )}

      {/* Order Tab */}
      {currentTab === 1 && (
        <RiderOrderTable
          currencyType={currencyType}
          riderParams={{
            riderId: queryParams.deliveryBoyId || riderId,
            startDate: queryParams?.startDate,
            endDate: queryParams.endDate,
          }}
        />
      )}

      {/* Payout tab */}
      {currentTab === 2 && (
        <Box>
          <PayoutList
            showFor="specific"
            payaoutParams={{ deliveryBoyId: queryParams.deliveryBoyId || riderId, payoutAccount: 'deliveryBoy' }}
          />
        </Box>
      )}
      <Modal
        open={makePayment}
        onClose={() => {
          setMakePayment(false);
          queryClient.invalidateQueries([showForToApiMap?.cashOrderList?.get]);
          queryClient.invalidateQueries([showForToApiMap?.transactions?.get]);
        }}
      >
        <Box>
          <MakePayment
            type="rider"
            id={riderId}
            amount={summary?.totalUnSettleAmount || 0}
            onClose={() => {
              setMakePayment(false);
              queryClient.invalidateQueries([showForToApiMap?.cashOrderList?.get]);
              queryClient.invalidateQueries([showForToApiMap?.transactions?.get]);
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
