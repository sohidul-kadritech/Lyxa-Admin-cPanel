/* eslint-disable no-unused-vars */
import { Box, Unstable_Grid2 as Grid, Modal, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import PriceItem from '../../../components/Shared/FinancialsOverview/PriceItem';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import AddRemoveCredit from './AddRemoveCredit';
import SearchBar from './Searchbar';
import ShopTransactionsTable from './TransactionsTable';

const amountSx = {
  fontSize: '30px!important',
};

const getTrxQueryParams = (shopId) => ({
  page: 1,
  pageSize: 10,
  shopId,
  sortBy: 'desc',
  tnxFilter: {
    startDate: moment().subtract(7, 'day'),
    endDate: moment(),
    type: ['adminAddBalanceShop', 'adminRemoveBalanceShop', 'adminSettlebalanceShop'],
    searchKey: '',
    amountBy: 'desc',
    amountRange: '',
  },
});

export default function ShopTransactions({ shop }) {
  const [queryParams, setQueryParams] = useState(getTrxQueryParams(shop?._id));
  const [modalOpen, setModalOpen] = useState(false);

  const query = useQuery([Api.SHOP_TRX, queryParams], () => AXIOS.post(Api.SHOP_TRX, queryParams));
  const summary = query?.data?.data?.summary || {};

  const creditMutation = useMutation((data) => AXIOS.post(Api.SHOP_ADD_REMOVE_CREDIT, data), {
    onSuccess: (data) => {
      if (data?.success) {
        successMsg(data?.message, 'success');
      }
    },
  });

  const addRemoveCredit = (data) => {
    if (
      (data.type === 'add' && data.amount > summary?.dropGetFromShop) ||
      (data.type === 'remove' && data.amount > summary?.totalShopEarning)
    ) {
      successMsg("You don't have enough credit", 'error');
      return;
    }

    creditMutation.mutate(data);
  };

  return (
    <Box>
      <SearchBar
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        searchPlaceHolder="Search transactions"
        onAddRemove={() => {
          setModalOpen(true);
        }}
      />
      <Grid container spacing={5} pt={7.5} pb={7.5}>
        <InfoCard
          title="Lyxa Profit"
          value={(summary?.totalDropGet || 0)?.toFixed(2)}
          s
          sm={6}
          md={4}
          lg={3}
          valueSx={amountSx}
        />
        <InfoCard
          title="Shop Profit"
          value={(summary?.toalShopProfile || 0)?.toFixed(2)}
          sm={6}
          md={4}
          lg={3}
          valueSx={amountSx}
          isDropdown
        >
          <Stack gap={3}>
            <PriceItem fontSize="14px!important" title="Paid" amount={summary?.totalShopEarning} />
            <PriceItem fontSize="14px!important" title="Unpaid" amount={summary?.totalShopUnsettle} />
          </Stack>
        </InfoCard>
        <InfoCard title="Orders No" value={'pending' || 0} sm={6} md={4} lg={3} valueSx={amountSx} />
        <InfoCard title="Order Amount" value={'pending' || 0} sm={6} md={4} lg={3} valueSx={amountSx} />
      </Grid>
      <ShopTransactionsTable rows={query?.data?.data?.transections} />
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <AddRemoveCredit
          shopId={shop?._id}
          onClose={() => {
            setModalOpen(false);
          }}
          onSubmit={addRemoveCredit}
        />
      </Modal>
    </Box>
  );
}
