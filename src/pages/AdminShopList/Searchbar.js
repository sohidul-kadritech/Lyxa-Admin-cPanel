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

const props = ['sortByOrders', 'sortByAvgTime', 'sortByRating', 'sortByProfit'];

export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams }) {
  const [zoneItems, setZoneItems] = useState([{ zoneName: 'All', _id: '' }]);
  console.log('queryParams?.shopBrand', queryParams?.shopBrand);
  // eslint-disable-next-line no-unused-vars
  const [shopBrands, setShopBrands] = useState([{ brandName: 'All', shopBrand: '' }]);
  // eslint-disable-next-line no-unused-vars
  const zonesQuery = useQuery([Api.GET_ALL_ZONE], () => AXIOS.get(Api.GET_ALL_ZONE), {
    onSuccess: (data) => {
      if (data.status) {
        const zones = data?.data?.zones;
        console.log('zones', zones);
        setZoneItems([...zoneItems, ...zones]);
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const shopBrandsQuery = useQuery([Api.SHOP_BRANDS], () => AXIOS.get(Api.SHOP_BRANDS), {
    onSuccess: (data) => {
      if (data.status) {
        const brands = data?.data?.shopBrands.map((brand) => ({ brandName: brand, shopBrand: brand }));

        setShopBrands([{ brandName: 'All', shopBrand: '' }, ...brands]);
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
        tooltip="Filter by Zone"
        inputProps={{
          name: 'zoneId',
          size: 'sm',
          placeholder: 'Filter by Zone',
          value: queryParams.zoneId,
          items: zoneItems || [],
          getLabel: (option) => option?.zoneName,
          getValue: (option) => option?._id,
          getDisplayValue: (currentValue) => zoneItems?.find((zone) => zone?._id === currentValue)?.zoneName,
          onChange: (e) => commonChangeHandler('zoneId', e.target.value),
        }}
      />

      <StyledFormField
        intputType="select"
        tooltip="Filter by Brand"
        inputProps={{
          name: 'shopBrand',
          size: 'sm',
          placeholder: 'Filter by Brand',
          value: queryParams?.shopBrand,
          items: shopBrands || [],
          getLabel: (option) => option?.brandName,
          getValue: (option) => option?.shopBrand,
          getDisplayValue: (currentValue) => shopBrands?.find((brand) => brand?.shopBrand === currentValue)?.brandName,
          onChange: (e) => commonChangeHandler('shopBrand', e.target.value),
        }}
      />
    </Stack>
  );
}
