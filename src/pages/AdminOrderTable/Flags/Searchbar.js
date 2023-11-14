/* eslint-disable prettier/prettier */
import { Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import moment from 'moment';
import { useMemo } from 'react';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledDateRangePicker from '../../../components/Styled/StyledDateRangePicker';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';

const sortOptions = [
  {
    label: 'Desc',
    value: 'DESC',
  },
  {
    label: 'Asc',
    value: 'ASC',
  },
];

const categoryOptions = [
  {
    label: 'Resturant',
    value: 'food',
  },
  {
    label: 'Grocery',
    value: 'grocery',
  },
  {
    label: 'Pharmacy',
    value: 'pharmacy',
  },
  {
    label: 'Butler',
    value: 'butler',
  },
];

const typeOptions = [
  {
    label: 'User',
    value: 'user',
  },
  {
    label: 'Shop',
    value: 'shop',
  },
  {
    label: 'Delivery',
    value: 'delivery',
  },
  {
    label: 'Refused',
    value: 'refused',
  },
  {
    label: 'Auto',
    value: 'auto',
  },
  {
    label: 'Delay',
    value: 'delay',
  },
];

const statusOptions = [
  {
    label: 'Schedule',
    value: 'schedule',
  },
  {
    label: 'Placed',
    value: 'placed',
  },
  {
    label: 'Accepted by rider',
    value: 'accepted_delivery_boy',
  },
  {
    label: 'Preparing',
    value: 'preparing',
  },
  {
    label: 'Ready to pickup',
    value: 'ready_to_pickup',
  },
  {
    label: 'Order on the way',
    value: 'order_on_the_way',
  },
  {
    label: 'Delivered',
    value: 'delivered',
  },
  {
    label: 'Refused',
    value: 'refused',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
];

export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams }) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
      }, 300),
    [],
  );

  return (
    <Stack direction="row" alignItems="center" gap="20px">
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        onChange={(e) => {
          updateSearch(e);
        }}
      />
      <StyledDateRangePicker
        startDate={queryParams?.startDate === 'null' ? null : moment(queryParams?.startDate)}
        endDate={queryParams?.endDate === 'null' ? null : moment(queryParams?.endDate)}
        onChange={({ startDate, endDate }) => {
          setQueryParams((prev) => ({
            ...prev,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
            page: 1,
          }));
        }}
      />
      {/* sort */}
      <FilterSelect
        items={sortOptions}
        value={queryParams.sortBy}
        placeholder="Sort"
        tooltip="Sort"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }));
        }}
      />
      {/* category */}
      <FilterSelect
        items={categoryOptions}
        value={queryParams.category}
        placeholder="Cateogory"
        tooltip="Category"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, category: e.target.value, page: 1 }));
        }}
      />
      {/* type */}
      <FilterSelect
        items={typeOptions}
        value={queryParams.type}
        placeholder="Type"
        tooltip="Type"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, type: e.target.value, page: 1 }));
        }}
      />
      {/* status  */}
      <FilterSelect
        items={statusOptions}
        value={queryParams.status}
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, status: e.target.value, page: 1 }));
        }}
      />
    </Stack>
  );
}
