/* eslint-disable consistent-return */
import { Box } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import TablePagination from '../../../components/Common/TablePagination';
import localDatePagination from '../../../helpers/localDataPaginations';
import SearchBar from './Searchbar';
import FlagsTable from './Table';

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
};

const filterFlags = (filters, flags) => {
  const temp = [];
  console.log('triggereeed');

  flags?.forEach((flag) => {
    const key = filters.searchKey.toLowerCase();

    if (key && !flag?.orderId?.orderId?.toLowerCase()?.includes(key) && !flag?.comment?.toLowerCase()?.includes(key)) {
      console.log('remove by search key');
      return;
    }
    if (moment(flag?.createdAt).isBefore(filters.startDate)) {
      console.log('remove by start date');
      return;
    }

    if (moment(flag?.createdAt).startOf('day').isAfter(filters.endDate)) {
      console.log('remove by end date');
      return;
    }

    temp.push(flag);
  });

  if (filters.sortBy === 'ASC') {
    temp.sort((a, b) => new Date(b.createdAt).getSeconds() - new Date(a.createdAt).getSeconds());
  } else {
    temp.sort((a, b) => new Date(a.createdAt).getSeconds() - new Date(b.createdAt).getSeconds());
  }

  return temp;
};

export default function RiderFlags({ flags = [] }) {
  const [flagList, setFlagList] = useState(flags);
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  useEffect(() => {
    setFlagList(filterFlags(queryParams, flags));
  }, [queryParams]);

  return (
    <Box>
      <SearchBar searchPlaceHolder="Search Flags" queryParams={queryParams} setQueryParams={setQueryParams} />
      <FlagsTable rows={localDatePagination(flagList, queryParams?.page, 10)} />
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams({ ...queryParams, page });
        }}
        totalPage={Math.ceil(flagList.length / 10)}
      />
    </Box>
  );
}
