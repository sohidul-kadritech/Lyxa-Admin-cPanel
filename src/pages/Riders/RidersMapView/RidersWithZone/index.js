/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Stack, Typography, debounce } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import CustomerLocation from '../../../../assets/icons/customer-location.png';
import { smoothPanTo } from '../../../../components/Shared/ChangeDeliveryAddress/helpers';
import StyledSearchBar from '../../../../components/Styled/StyledSearchBar';
import * as API_URL from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import { isThisPolygonHasAnyMarker } from '../../../ServiceZone/ZoneMap';
import { convertedLatLonToLonLat } from '../../../ServiceZone/helper';
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
      const bounds = new google.maps.LatLngBounds();
      const getAllLatLngCoordinates =
        value?.length > 0 ? value[0]?.map((latLng) => new google.maps.LatLng(latLng[1], latLng[0])) : [];

      const userIcon = {
        url: CustomerLocation,
        scaledSize: new google.maps.Size(30, 60),
      };

      getAllLatLngCoordinates.forEach((coordinates) => {
        bounds.extend(coordinates);
      });

      const boundsCenter = bounds.getCenter();

      const modifiedPolygonData = convertedLatLonToLonLat(value[0]);

      const isIntersect = isThisPolygonHasAnyMarker(modifiedPolygonData, {
        lat: boundsCenter.lat(),
        lng: boundsCenter.lng(),
      });

      console.log({ isIntersect });

      mapRef.currentLocation.setMap(null);

      mapRef.currentLocation = new google.maps.Marker({
        position: isIntersect ? boundsCenter : center,
        icon: userIcon,
        map: mapRef?.map,
      });

      // mapRef?.currentLocation?.setPosition(isIntersect ? boundsCenter : center);

      smoothPanTo(mapRef?.map, center, 400, google);

      setTimeout(() => mapRef?.map.fitBounds(bounds), 1000);
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
