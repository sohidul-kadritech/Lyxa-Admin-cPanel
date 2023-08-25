/* eslint-disable consistent-return */
import { Box, Drawer } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import localDatePagination from '../../../helpers/localDataPaginations';
import SearchBar from '../../Common/CommonSearchbar';
import TablePagination from '../../Common/TablePagination';
import { getFirstMonday } from '../../Styled/StyledDateRangePicker/Presets';
import OrderDetail from '../OrderDetail';
import FlagsTable from './Table';

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  startDate: getFirstMonday('week'),
  endDate: moment(),
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

export default function FlaggedOrders({ flags = [] }) {
  const [flagList, setFlagList] = useState(flags);
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  useEffect(() => {
    setFlagList(filterFlags(queryParams, flags));
  }, [queryParams]);

  return (
    <Box>
      <Box pb={7.5}>
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          searchPlaceHolder="Search Ratings"
          showFilters={{
            search: true,
            date: true,
            sort: true,
          }}
        />
      </Box>
      <FlagsTable
        rows={localDatePagination(flagList, queryParams?.page, 10)}
        onViewDetails={(order) => {
          setCurrentOrder(order);
          setSidebarOpen(true);
        }}
      />
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams({ ...queryParams, page });
        }}
        totalPage={Math.ceil(flagList.length / 10)}
      />
      <Drawer open={sidebarOpen} anchor="right">
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setCurrentOrder({});
            setSidebarOpen(false);
          }}
        />
      </Drawer>
    </Box>
  );
}
