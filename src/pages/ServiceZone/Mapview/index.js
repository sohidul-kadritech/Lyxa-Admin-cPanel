/* eslint-disable no-unused-vars */
import { Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import StyledSearchAddress from '../../../components/Shared/ChangeDeliveryAddress/StyledSearchAddress';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ModalContainer from '../ModalContainer';
import { getLocationFromLatLng } from '../helper';
import useGeoLocation from '../useGeoLocation';
import Map from './Map';

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

  const { coordinates } = currentLocation;

  const getSelectedLatLng = async ({ latitude, longitude }) => {
    const { data } = await getLocationFromLatLng(latitude, longitude);
    console.log({ data });
    setZoneAddress((prev) => ({
      ...prev,
      deliveryAddress: { ...prev?.deliveryAddress, address: data?.results[0]?.formatted_address, latitude, longitude },
    }));
  };

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
              deliveryAddress={zoneAddress}
              setDeliveryAddress={setZoneAddress}
              onChangeAddressHandler={onChangeAddressHandler}
              mapReference={mapReference}
              isNotMarker={false}
            />
          </Stack>
        </Stack>
        <Stack flex={1} gap="36px">
          {getAllStore?.isLoading || getAllZones?.isLoading ? (
            <Typography>Loading</Typography>
          ) : (
            <Map
              currentLocation={{ latitude: coordinates?.lat, longitude: coordinates?.lon }}
              setMapReference={setMapReference}
              zones={zones}
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
