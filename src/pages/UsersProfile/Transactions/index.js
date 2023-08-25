/* eslint-disable no-unsafe-optional-chaining */
import { Box, Modal } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import TablePagination from '../../../components/Common/TablePagination';
import TransactionsTable from '../../../components/Shared/TransactionsTable';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import AddRemoveCredit from './AddRemoveCredit';

const queryParamsInit = (userId) => ({
  page: 1,
  pageSize: 10,
  sortBy: 'DESC',
  type: 'all',
  startDate: getFirstMonday('week'),
  endDate: moment(),
  searchKey: '',
  userId,
});

export default function UserTransactions({ user }) {
  console.log(user);
  const [queryParams, setQueryParams] = useState(queryParamsInit(user?._id));
  const [modalOpen, setModalOpen] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const query = useQuery(
    [Api.DROP_PAY_LIST, queryParams],
    () =>
      AXIOS.get(Api.DROP_PAY_LIST, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  return (
    <Box>
      <Box pb={7.5}>
        <SearchBar
          searchPlaceHolder="Search trasactions"
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          showFilters={{
            search: true,
            sort: true,
            date: true,
            button: true,
          }}
          buttonLabel="Add / Remove Credit"
          onButtonClick={() => {
            setModalOpen(true);
          }}
        />
      </Box>
      <TransactionsTable
        rows={query?.data?.data?.transactionList}
        type="user-transactions"
        loading={query?.isLoading}
      />
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <AddRemoveCredit
          userId={user?._id}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </Modal>
    </Box>
  );
}
