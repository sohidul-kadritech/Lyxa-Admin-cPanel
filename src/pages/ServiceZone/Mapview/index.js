/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { Skeleton, Stack, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import StyledSearchAddress from '../../../components/Shared/ChangeDeliveryAddress/StyledSearchAddress';
import { smoothPanTo } from '../../../components/Shared/ChangeDeliveryAddress/helpers';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ModalContainer from '../ModalContainer';
import { isThisPolygonHasAnyMarker } from '../ZoneMap';
import { convertedLatLonToLonLat, getLocationFromLatLng } from '../helper';
import useGeoLocation from '../useGeoLocation';
import Map from './Map';
import StyledSearchForZone from './StyledSearchForZone';

// eslint-disable-next-line prettier/prettier, no-unused-vars
const fieldContainerSx = {
  padding: '14px 0px 23px 0',
  flex: '1',
};

const initialAddress = {
  deliveryAddress: {
    address: '',
  },
};

function MapView({ onClose }) {
  const theme = useTheme();
  const [zoneAddress, setZoneAddress] = useState(initialAddress);
  const [zones, setZones] = useState([]);
  const [mapReference, setMapReference] = useState(null);
  const [zoneName, setZoneName] = useState('');

  const { location: currentLocation, getCurrentLocation } = useGeoLocation();

  const { coordinates, loaded } = currentLocation;

  const getZoneFromAddress = useMutation(
    (data) =>
      AXIOS.get(API_URL.GET_ZONE_FROM_LATLNG, {
        params: {
          ...data,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          if (data?.data?.zones?.length > 0) {
            setZoneName(data?.data?.zones[0]?.zoneName);
          } else {
            setZoneName('');
          }
        }
      },
    },
  );

  const getSelectedLatLng = async ({ latitude, longitude }, ignoreZoneFind = false) => {
    const { data } = await getLocationFromLatLng(latitude, longitude);

    if (!ignoreZoneFind) await getZoneFromAddress.mutateAsync({ latitude, longitude });

    setZoneAddress((prev) => ({
      ...prev,
      deliveryAddress: { ...prev?.deliveryAddress, address: data?.results[0]?.formatted_address, latitude, longitude },
    }));
  };

  useEffect(() => {
    getSelectedLatLng({ latitude: coordinates?.lat, longitude: coordinates?.lon });

    const { google } = window;
    // locaton for center position
    const center = new google.maps.LatLng(coordinates?.lat, coordinates?.lon);
    if (mapReference?.marker && mapReference?.map) {
      // change center position
      mapReference?.marker.setPosition(center);

      smoothPanTo(mapReference?.map, center, 300, google);
    }
  }, [loaded, coordinates?.lat, coordinates?.lon]);

  // getAllZones
  const getAllZones = useQuery([API_URL.GET_ALL_ZONE], () => AXIOS.get(API_URL.GET_ALL_ZONE));

  // getAllStore
  const getAllStore = useQuery([API_URL?.ALL_SHOP], () => AXIOS.get(API_URL?.ALL_SHOP), {
    onSuccess: (data) => {
      if (data.status) {
        console.log('data', data?.data?.shops);
      }
    },
  });

  // onChange address handler
  const onChangeAddressHandler = (address) => {
    setZoneName('');
    setZoneAddress((prev) => ({
      ...prev,
      deliveryAddress: { ...prev?.deliveryAddress, address },
    }));
  };

  return (
    <ModalContainer
      onClose={onClose}
      title="Map View"
      sx={{
        width: '96vw',
        height: '96vh',
        margin: '2vh 2vw',
        padding: '36px',
        overflow: 'auto',
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: '10px',
      }}
    >
      <Stack sx={{ height: '100%' }} gap={4}>
        <Stack flexDirection="row" gap="36px">
          <Stack flex={1}>
            <StyledSearchAddress
              label="Search with address"
              deliveryAddress={zoneAddress}
              setDeliveryAddress={setZoneAddress}
              onChangeAddressHandler={onChangeAddressHandler}
              getSelectedLatLng={getSelectedLatLng}
              mapReference={mapReference}
              isNotMarker={false}
            />
          </Stack>
          <Stack flex={1}>
            <StyledSearchForZone
              zoneName={zoneName}
              setZoneName={setZoneName}
              onClick={(value) => {
                if (value?.zoneGeometry?.coordinates?.length > 0) {
                  const { google } = window;
                  const bounds = new google.maps.LatLngBounds();
                  // const { center } = getCenterOfTheZone(formateZoneCoordinates([value])[0].zoneGeometry?.coordinates);

                  // locaton for generating address
                  const locationOfMarker = {
                    latitude: value?.zoneGeometry?.coordinates[0][0][1],
                    longitude: value?.zoneGeometry?.coordinates[0][0][0],
                  };

                  // get all co-ordinates to fit in map view
                  const getAllLatLngCoordinates = value?.zoneGeometry?.coordinates[0]?.map(
                    (latLng) => new google.maps.LatLng(latLng[1], latLng[0]),
                  );

                  getAllLatLngCoordinates.forEach((coordinates) => {
                    bounds.extend(coordinates);
                  });

                  // locaton for center position
                  const center = new google.maps.LatLng(
                    value?.zoneGeometry?.coordinates[0][0][1],
                    value?.zoneGeometry?.coordinates[0][0][0],
                  );

                  // generating address
                  getSelectedLatLng(locationOfMarker, true);

                  const modifiedPolygonData = convertedLatLonToLonLat(value?.zoneGeometry?.coordinates[0]);

                  const boundsCenter = bounds.getCenter();

                  const isIntersect = isThisPolygonHasAnyMarker(modifiedPolygonData, {
                    lat: boundsCenter.lat(),
                    lng: boundsCenter.lng(),
                  });

                  // change center position
                  mapReference?.marker.setPosition(isIntersect ? boundsCenter : center);
                  smoothPanTo(mapReference?.map, center, 400, google);
                  setTimeout(() => mapReference?.map.fitBounds(bounds), 1000);
                }
              }}
            />
          </Stack>
        </Stack>
        <Stack flex={1} gap="36px">
          {getAllStore?.isLoading || getAllZones?.isLoading ? (
            <Skeleton height="100%" />
          ) : (
            <Map
              currentLocation={{ latitude: coordinates?.lat, longitude: coordinates?.lon }}
              setMapReference={setMapReference}
              zones={getAllZones?.data?.data?.zones || []}
              getSelectedLatLng={getSelectedLatLng}
              stores={getAllStore?.data?.data?.shops || []}
            />
          )}
        </Stack>
      </Stack>
    </ModalContainer>
  );
}

export default MapView;
