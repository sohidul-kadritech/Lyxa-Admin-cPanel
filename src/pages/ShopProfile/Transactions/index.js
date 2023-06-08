/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Box, Unstable_Grid2 as Grid, Modal, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import PriceItem from '../../../components/Shared/FinancialsOverview/PriceItem';
import InfoCard from '../../../components/StyledCharts/InfoCard';
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
  pageSize: 5,
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
  const [totalPage, setTotalPage] = useState(1);

  const query = useQuery([Api.SHOP_TRX, queryParams.tnxFilter], () => AXIOS.post(Api.SHOP_TRX, queryParams), {
    onSuccess: (data) => {
      setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
    },
  });

  const summary = query?.data?.data?.summary || {};

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
            {summary?.totalShopDeliveryFee > 0 && (
              <PriceItem
                fontSize="14px!important"
                title="Shop Delivery fee"
                amount={summary?.totalShopDeliveryFee}
                amountStatus="secondary"
              />
            )}
          </Stack>
        </InfoCard>
        <InfoCard title="Orders No" value={'pending' || 0} sm={6} md={4} lg={3} valueSx={amountSx} />
        <InfoCard title="Order Amount" value={'pending' || 0} sm={6} md={4} lg={3} valueSx={amountSx} />
      </Grid>
      <ShopTransactionsTable rows={query?.data?.data?.transections} />
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
      {/* add/remove credit */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <AddRemoveCredit
          shopId={shop?._id}
          dropAmount={summary?.totalDropGet}
          shopAmount={summary?.toalShopProfile}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </Modal>
    </Box>
  );
}
