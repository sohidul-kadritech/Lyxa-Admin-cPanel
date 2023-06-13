/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Box, Modal } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import TransactionsTable from '../../../components/Shared/TransactionsTable';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SearchBar from './Searchbar';

const amountSx = {
  fontSize: '30px!important',
};

const getTrxQueryParams = (shopId) => ({
  page: 1,
  pageSize: 5,
  shopId,
  sortBy: 'DESC',
  tnxFilter: {
    startDate: moment().subtract(7, 'day'),
    endDate: moment(),
    type: ['adminAddBalanceShop', 'adminRemoveBalanceShop', 'adminSettlebalanceShop'],
    searchKey: '',
    amountBy: 'DESC',
    amountRange: '',
  },
});

export default function UserTransactions({ shop }) {
  const [queryParams, setQueryParams] = useState(getTrxQueryParams(shop?._id));
  const [modalOpen, setModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const query = useQuery([Api.SHOP_TRX, queryParams], () => AXIOS.post(Api.SHOP_TRX, queryParams), {
    onSuccess: (data) => {
      setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
    },
  });

  const summary = query?.data?.data?.summary || {};

  useEffect(() => {
    setQueryParams(getTrxQueryParams(shop?._id));
    setTotalPage(1);
  }, [shop?._id]);

  return (
    <Box>
      <Box pb={7.5}>
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          searchPlaceHolder="Search transactions"
          onAddRemove={() => {
            setModalOpen(true);
          }}
        />
      </Box>
      <TransactionsTable rows={query?.data?.data?.transections} showFor="transactions" />
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
        {/* <AddRemoveCredit
          shopId={shop?._id}
          dropAmount={summary?.totalDropGet}
          shopAmount={summary?.toalShopProfile}
          onClose={() => {
            setModalOpen(false);
          }}
        /> */}
        <Box></Box>
      </Modal>
    </Box>
  );
}
