import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { riderLiveStatusOptions, riderStatusOptions } from './helper';

import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

import StyledFormField from '../../components/Form/StyledFormField';
import { useGlobalContext } from '../../context';

export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams, onAdd, onMapView }) {
  const { currentUser } = useGlobalContext();

  const { admin } = currentUser;

  const [zoneItems, setZoneItems] = useState([{ zoneName: 'All', _id: 'all' }]);
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

  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        sx={{ flex: 1 }}
        placeholder={searchPlaceHolder}
        onChange={(e) => {
          updateSearch(e);
        }}
      />
      {/* Live Status */}
      <FilterSelect
        items={riderLiveStatusOptions}
        value={queryParams.liveStatus}
        placeholder="Live Status"
        tooltip="Live Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, liveStatus: e.target.value, page: 1 }));
        }}
      />
      {/* status */}
      <FilterSelect
        items={riderStatusOptions}
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
      <StyledFormField
        intputType="select"
        tooltip="Zone"
        sx={{
          minWidth: 'auto',
        }}
        inputProps={{
          name: 'zoneId',
          size: 'sm',
          placeholder: 'Select Zone',
          value: queryParams.zoneId,
          items: zoneItems || [],
          getLabel: (option) => option?.zoneName,
          getValue: (option) => option?._id,
          getDisplayValue: (currentValue) => zoneItems?.find((zone) => zone?._id === currentValue)?.zoneName,
          onChange: (e) => setQueryParams((prev) => ({ ...prev, zoneId: e.target.value, page: 1 })),
        }}
      />
      {admin?.adminType !== 'customerService' && (
        <Button size="small" variant="contained" onClick={onAdd} startIcon={<Add />}>
          Add
        </Button>
      )}
      <Button size="small" variant="contained" onClick={onMapView} startIcon={<LocationIcon />}>
        Map View
      </Button>
    </Stack>
  );
}
