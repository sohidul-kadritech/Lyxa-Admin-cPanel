/* eslint-disable no-unused-vars */
import { Box, Unstable_Grid2 as Grid, Modal } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MakePayment from './MakePayment';
import SearchBar from './Searchbar';
import TransactionsTable from './Table';

export const queryParamsInit = {
  page: 1,
  pageSize: 10,
  sortBy: 'DESC',
  type: 'all',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
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

export default function RiderTransactions({ riderId, showFor }) {
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit, deliveryBoyId: riderId });
  const [totalPage, setTotalPage] = useState(1);
  const [makePayment, setMakePayment] = useState(false);

  const summaryQuery = useQuery(
    [
      Api.SINGLE_DELIVERY_WALLET_SUMMARY,
      {
        deliveryBoyId: queryParams.deliveryBoyId,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      },
    ],
    () =>
      AXIOS.get(Api.SINGLE_DELIVERY_WALLET_SUMMARY, {
        params: {
          deliveryBoyId: queryParams.deliveryBoyId,
          startDate: queryParams.startDate,
          endDate: queryParams.endDate,
        },
      })
  );

  const listQuery = useQuery(
    [showForToApiMap[showFor]?.get, queryParams],
    () => AXIOS.get(showForToApiMap[showFor]?.get, { params: queryParams }),
    {
      onSuccess: (data) => {
        console.log(data);
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage || 1);
      },
    }
  );

  return (
    <Box>
      <SearchBar
        searchPlaceHolder="Search transactions by id"
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        onMakePayment={() => setMakePayment(true)}
      />
      <Grid container spacing={5} pb={7.5}>
        <InfoCard
          title="Lyxa Earning"
          value={(summaryQuery?.data?.data?.summary?.dropEarning || 0)?.toFixed(2)}
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title="Unsettled Amount"
          value={(summaryQuery?.data?.data?.summary?.totalUnSettleAmount || 0)?.toFixed(2)}
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title="Rider Earning"
          value={(summaryQuery?.data?.data?.summary?.riderEarning || 0)?.toFixed(2)}
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title="Cash in Hand"
          value={(summaryQuery?.data?.data?.summary?.totalCashInHand || 0)?.toFixed(2)}
          sm={6}
          md={4}
          lg={3}
        />
      </Grid>
      <TransactionsTable rows={listQuery?.data?.data?.[showFor]} />
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
          queryClient.invalidateQueries([Api.SINGLE_DELIVERY_WALLET_SUMMARY]);
        }}
      >
        <MakePayment
          userType="rider"
          id={riderId}
          unSettleAmount={summaryQuery?.data?.data?.summary?.totalUnSettleAmount || 0}
        />
      </Modal>
    </Box>
  );
}
