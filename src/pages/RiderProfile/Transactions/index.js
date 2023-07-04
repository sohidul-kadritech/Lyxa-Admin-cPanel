/* eslint-disable no-unsafe-optional-chaining */
import { Box, Unstable_Grid2 as Grid, Modal, Stack } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import PriceItem from '../../../components/Shared/FinancialsOverview/PriceItem';
import TransactionsTable from '../../../components/Shared/TransactionsTable';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { CardTitle } from '../Timestamp/helper';
import MakePayment from './MakPayment';
import SearchBar from './Searchbar';

export const queryParamsInit = {
  page: 1,
  pageSize: 10,
  sortBy: 'DESC',
  type: 'all',
  // startDate: moment().startOf('month').format('YYYY-MM-DD'),
  // endDate: moment().format('YYYY-MM-DD'),
  startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
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
  const [summary, setSummary] = useState({});

  const summaryQuery = useQuery(
    [
      Api.DELIVERY_TRX,
      {
        deliveryBoyId: queryParams.deliveryBoyId,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      },
    ],
    () =>
      AXIOS.get(Api.DELIVERY_TRX, {
        params: {
          deliveryBoyId: queryParams.deliveryBoyId,
          startDate: queryParams.startDate,
          endDate: queryParams.endDate,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status && data?.data?.deliveryBoy?.length) {
          setSummary(data?.data?.deliveryBoy[0]?.summary);
        }
      },
      // eslint-disable-next-line prettier/prettier
    }
  );

  useEffect(() => {
    if (summaryQuery?.data?.status && summaryQuery?.data?.data?.deliveryBoy?.length)
      setSummary(summaryQuery?.data?.data?.deliveryBoy[0]?.summary);
  }, []);

  const query = useQuery(
    [showForToApiMap[showFor]?.get, queryParams],
    () => AXIOS.get(showForToApiMap[showFor]?.get, { params: queryParams }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage || 1);
      },
    }
  );

  // on receive cash
  const receiveCashMutation = useMutation((data) => AXIOS.post(Api.RIDER_RECEIVED_PAYMENT, data), {
    onSuccess: () => {
      queryClient.invalidateQueries([Api.DELIVERY_TRX]);
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
      <SearchBar
        searchPlaceHolder="Search transactions by id"
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        onMakePayment={() => setMakePayment(true)}
        onReceiveCash={onReceiveCash}
        showFor={showFor}
        loading={receiveCashMutation.isLoading}
      />
      {showFor !== 'cashOrderList' && (
        <Grid container spacing={5} pb={7.5}>
          <InfoCard
            title={<CardTitle title="Lyxa Earning" tooltip="Lyxa Earning" />}
            value={(summary?.dropEarning || 0)?.toFixed(2)}
            sm={6}
            md={4}
            lg={2.37}
            valueSx={amountSx}
          />
          <InfoCard
            title={<CardTitle title="Orders No" tooltip="Orders No" />}
            value={summary?.totalOrder || 0}
            sm={6}
            md={4}
            valueSx={amountSx}
            lg={2.5}
          />
          <InfoCard
            title={<CardTitle title="Delivery Fees" tooltip="Total Delivery Fee" />}
            value={(summary?.totalDeliveyFee || 0)?.toFixed(2)}
            sm={6}
            md={4}
            valueSx={amountSx}
            lg={2.37}
          />
          <InfoCard
            title={<CardTitle title="Total Profit" tooltip="Total Profit" />}
            value={(summary?.totalProfitRider || 0)?.toFixed(2)}
            sm={6}
            md={4}
            lg={2.37}
            valueSx={amountSx}
            isDropdown
          >
            <Stack gap={3}>
              <PriceItem fontSize="14px!important" title="Paid" amount={summary?.riderEarning} />
              <PriceItem fontSize="14px!important" title="Unpaid" amount={summary?.totalUnSettleAmount} />
            </Stack>
          </InfoCard>
          {/* setttled + cash in hand */}
          <InfoCard
            title={<CardTitle title="Cash Orders" tooltip="Cash Orders" />}
            value={(summary?.totalCashInHand + summary?.totalCashReceived || 0)?.toFixed(2)}
            sm={6}
            md={4}
            valueSx={amountSx}
            lg={2.37}
            isDropdown
          >
            <Stack gap={3}>
              <PriceItem fontSize="14px!important" title="Cash In Hand" amount={summary?.totalCashInHand} />
              <PriceItem fontSize="14px!important" title="Settled Cash" amount={summary?.totalCashReceived} />
            </Stack>
          </InfoCard>
        </Grid>
      )}
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
      <Modal
        open={makePayment}
        onClose={() => {
          setMakePayment(false);
          queryClient.invalidateQueries([showForToApiMap?.cashOrderList?.get]);
          queryClient.invalidateQueries([showForToApiMap?.transactions?.get]);
          queryClient.invalidateQueries([Api.DELIVERY_TRX]);
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
              queryClient.invalidateQueries([Api.DELIVERY_TRX]);
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
