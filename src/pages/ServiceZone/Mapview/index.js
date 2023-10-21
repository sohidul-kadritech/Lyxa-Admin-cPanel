/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { Skeleton, Stack, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import StyledSearchAddress from '../../../components/Shared/ChangeDeliveryAddress/StyledSearchAddress';
import { smoothPanTo } from '../../../components/Shared/ChangeDeliveryAddress/helpers';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ModalContainer from '../ModalContainer';
import { getLocationFromLatLng } from '../helper';
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

  const { location: currentLocation, getCurrentLocation } = useGeoLocation();

  const { coordinates, loaded } = currentLocation;

  const getSelectedLatLng = async ({ latitude, longitude }) => {
    const { data } = await getLocationFromLatLng(latitude, longitude);
    console.log({ data });
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
  const getAllZones = useQuery([API_URL.GET_ALL_ZONE], () => AXIOS.get(API_URL.GET_ALL_ZONE, {}), {
    onSuccess: (data) => {
      if (data.status) {
        const tempZones = data?.data?.zones || [];

        const allZones = tempZones.map((item) => {
          const coordinates = item?.zoneGeometry?.coordinates[0]?.map((coord) => ({ lat: coord[1], lng: coord[0] }));

          return { ...item, zoneGeometry: { ...item?.zoneGeometry, coordinates: [...coordinates] } };
        });
        console.log({ zones: allZones, tempZones });

        setZones(allZones);
      }
    },
    // eslint-disable-next-line prettier/prettier
  });

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
              mapReference={mapReference}
              isNotMarker={false}
            />
          </Stack>
          <Stack flex={1}>
            <StyledSearchForZone
              onClick={(value) => {
                if (value?.zoneGeometry?.coordinates?.length > 0) {
                  const { google } = window;
                  // const { center } = getCenterOfTheZone(formateZoneCoordinates([value])[0].zoneGeometry?.coordinates);

                  // locaton for generating address
                  const locationOfMarker = {
                    latitude: value?.zoneGeometry?.coordinates[0][0][1],
                    longitude: value?.zoneGeometry?.coordinates[0][0][0],
                  };

                  // locaton for center position
                  const center = new google.maps.LatLng(
                    value?.zoneGeometry?.coordinates[0][0][1],
                    value?.zoneGeometry?.coordinates[0][0][0],
                  );

                  // generating address
                  getSelectedLatLng(locationOfMarker);

                  // change center position
                  mapReference?.marker.setPosition(center);
                  smoothPanTo(mapReference?.map, center, 300, google);
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
