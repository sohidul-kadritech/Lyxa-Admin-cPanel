import { Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

const orderSortOptions = [
  {
    label: 'Most Orders',
    value: 'desc',
  },
  {
    label: 'Least Orders',
    value: 'asc',
  },
  {
    label: 'All',
    value: '',
  },
];

const deliverySortOptions = [
  {
    label: 'Highest Delivery Time',
    value: 'desc',
  },
  {
    label: 'Least Delivery Time',
    value: 'asc',
  },
  {
    label: 'All',
    value: '',
  },
];

const ratingSortOptions = [
  {
    label: 'Highest Rating',
    value: 'desc',
  },
  {
    label: 'Lowest Rating',
    value: 'asc',
  },
  {
    label: 'All',
    value: '',
  },
];

const profitSortOptions = [
  {
    label: 'Highest Proft',
    value: 'desc',
  },
  {
    label: 'Lowest Proft',
    value: 'asc',
  },
  {
    label: 'All',
    value: '',
  },
];

// eslint-disable-next-line no-unused-vars
const zoneOptions = [
  {
    label: 'All',
    value: 'all',
  },
];

const props = ['sortByOrders', 'sortByAvgTime', 'sortByRating', 'sortByProfit'];

export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams }) {
  const [zoneItems, setZoneItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const zonesQuery = useQuery([Api.GET_ALL_ZONE], () => AXIOS.get(Api.GET_ALL_ZONE), {
    onSuccess: (data) => {
      if (data.status) {
        const zones = data?.data?.zones;
        console.log('zones', zones);
        setZoneItems([{ zoneName: 'All', _id: 'all' }, ...zones]);
      }
    },
  });
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
      }, 300),
    // eslint-disable-next-line prettier/prettier
    [],
  );

  const commonChangeHandler = (prop, value) => {
    props?.forEach((p) => {
      queryParams[p] = '';
    });

    setQueryParams((prev) => ({ ...prev, [prop]: value, page: 1 }));
  };

  return (
    <Stack direction="row" alignItems="center" gap="20px">
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        onChange={(e) => {
          updateSearch(e);
        }}
      />

      {/* orders */}
      <FilterSelect
        items={orderSortOptions}
        value={queryParams.sortByOrders}
        placeholder="Sort by Orders"
        tooltip="Sort by Orders"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          commonChangeHandler('sortByOrders', e.target.value);
        }}
      />

      {/* delivery time */}
      <FilterSelect
        items={deliverySortOptions}
        value={queryParams.sortByAvgTime}
        placeholder="Sort by Delivery Time"
        tooltip="Sort by Delivery Time"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          commonChangeHandler('sortByAvgTime', e.target.value);
        }}
      />

      {/* rating */}
      <FilterSelect
        items={ratingSortOptions}
        value={queryParams.sortByRating}
        placeholder="Sort by Rating"
        tooltip="Sort by Rating"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          commonChangeHandler('sortByRating', e.target.value);
        }}
      />

      {/* profit */}
      <FilterSelect
        items={profitSortOptions}
        value={queryParams.sortByProfit}
        placeholder="Sort by Profit"
        tooltip="Sort by Profit"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          commonChangeHandler('sortByProfit', e.target.value);
        }}
      />
      {/* zone */}

      <StyledFormField
        intputType="select"
        inputProps={{
          name: 'zoneId',
          size: 'sm',
          placeholder: 'Select Zone',
          value: queryParams.zoneId,
          items: zoneItems || [],
          getLabel: (option) => option?.zoneName,
          getValue: (option) => option?._id,
          getDisplayValue: (currentValue) => zoneItems?.find((zone) => zone?._id === currentValue)?.zoneName,
          onChange: (e) => commonChangeHandler('zoneId', e.target.value),
        }}
      />
    </Stack>
  );
}
