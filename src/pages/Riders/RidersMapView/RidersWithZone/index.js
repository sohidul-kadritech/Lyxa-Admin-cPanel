/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Stack, Typography, debounce } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { smoothPanTo } from '../../../../components/Shared/ChangeDeliveryAddress/helpers';
import StyledSearchBar from '../../../../components/Styled/StyledSearchBar';
import * as API_URL from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import ZoneCard from './ZoneCard';

function RidersWithZone({ mapRef }) {
  const [searchedValue, setSearchedValue] = useState('');
  const getMapoverView = useQuery([API_URL.ZONE_MAP_OVERVIEW, { searchedValue }], () =>
    AXIOS.get(API_URL.ZONE_MAP_OVERVIEW, {
      params: {
        // zoneStatus: 'active',
        page: 1,
        pageSize: 20,
        searchKey: searchedValue,
        // pageSize: selectedPageSize,
      },
    }),
  );

  const onClickZone = (value) => {
    if (value?.length > 0) {
      const { google } = window;
      const center = new google.maps.LatLng(value[0][0][1], value[0][0][0]);
      smoothPanTo(mapRef, center, 400, google);
    }
  };
  return (
    <Stack gap={2.5}>
      <Typography variant="h4">Zones</Typography>
      <StyledSearchBar placeholder="Search" onChange={debounce((e) => setSearchedValue(e.target.value), 300)} />
      {getMapoverView?.isLoading ? (
        <Stack
          sx={{
            padding: '12px 20px 10px 20px',
            borderLeft: `4px solid transparent`,
            backgroundColor: 'rgba(177, 177, 177, 0.1)',
            marginTop: '10px',
          }}
        >
          <Typography variant="h6">Loading...</Typography>
        </Stack>
      ) : (
        <Stack gap={2.5} marginTop="10px">
          {getMapoverView?.data?.data?.zones?.map((zone, i) => (
            <ZoneCard
              key={i}
              name={zone?.zoneName}
              status={zone?.zoneAvailability === 'busy' ? zone?.zoneAvailability : zone?.zoneStatus}
              number={zone?.riders?.length}
              onClick={onClickZone}
              polygon={zone?.zoneGeometry?.coordinates}
            />
          ))}
          {!getMapoverView?.data?.data?.zones?.length && (
            <Stack
              sx={{
                padding: '12px 20px 10px 20px',
                borderLeft: `4px solid transparent`,
                backgroundColor: 'rgba(177, 177, 177, 0.1)',
                marginTop: '10px',
              }}
            >
              <Typography variant="h6">No Zone found</Typography>
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default RidersWithZone;
