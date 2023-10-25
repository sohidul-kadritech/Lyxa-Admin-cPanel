/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import socketServices from '../../../common/socketService';
import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { getLocationFromLatLng } from '../../../pages/ServiceZone/helper';
import CloseButton from '../../Common/CloseButton';
import OptionsSelect from '../../Filter/OptionsSelect';
import StyledFormField from '../../Form/StyledFormField';
import Map from './Map';
import StyledSearchAddress from './StyledSearchAddress';
import { validateDeliveryAddress } from './helpers';

const deliveryOptions = [
  { label: 'Meet at door', value: 'Meet at door' },
  { label: 'Leave at door', value: 'Leave at door' },
  { label: 'Meet outside', value: 'Meet outside' },
];

const initialDeliveryAddress = (order) => {
  const templateOfDeliveryAddress = {
    orderId: order?._id,
    deliveryAddress: {
      address: order?.dropOffLocation?.address || '',
      nickname: order?.dropOffLocation?.nickname || '',
      apartment: order?.dropOffLocation?.apartment || '',
      latitude: order?.dropOffLocation?.latitude || '',
      longitude: order?.dropOffLocation?.longitude || '',
      country: order?.dropOffLocation?.country || '',
      state: order?.dropOffLocation?.state || '',
      city: order?.dropOffLocation?.city || '',
      pin: order?.dropOffLocation?.pin || '',
      note: order?.dropOffLocation?.note || '',
      tags: order?.dropOffLocation?.tags || '',
      placeId: order?.dropOffLocation?.placeId || '',
      buildingName: order?.dropOffLocation?.buildingName || '',
      deliveryOptions: order?.dropOffLocation?.deliveryOptions || '',
      addressLabel: order?.dropOffLocation?.addressLabel || '',
      instructions: order?.dropOffLocation?.instructions || '',
    },
  };
  return templateOfDeliveryAddress;
};

function ChangeDeliveryAddress({ order, onClose }) {
  const [deliveryAddress, setDeliveryAddress] = useState(initialDeliveryAddress(order));

  const [disableButton, setDisableButton] = useState(false);

  const [mapReference, setMapReference] = useState(null);

  const queryClient = useQueryClient();

  // get zone service availabilty in selected location
  const getZoneServiceQuery = useMutation(
    ({ latitude, longitude }) =>
      AXIOS.get(API_URL.GET_ZONE_SERVICE_AVAILABILITY, {
        params: {
          longitude,
          latitude,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setDisableButton(data?.data?.isZoneBusy ? true : !data?.data?.isUserInZone);
        } else {
          successMsg(data?.message, 'warn');
          setDisableButton(false);
        }
      },
    },
  );

  // udpate delivery boy query
  const updateDeliveryAddressQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_ORDER_DELIVERY_ADDRESS, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data?.message, 'success');
        socketServices?.emit('updateOrder', {
          orderId: order?._id,
        });
        queryClient.invalidateQueries(API_URL.ORDER_LIST);
        queryClient.invalidateQueries(API_URL.URGENT_ORDER_COUNT);
        queryClient.invalidateQueries(API_URL.LATE_ORDER_COUNT);

        onClose();
      } else {
        successMsg(data?.message, 'warn');
      }
    },
  });

  const getSelectedLatLng = async ({ latitude, longitude }) => {
    const { data } = await getLocationFromLatLng(latitude, longitude);
    console.log('test==>');
    getZoneServiceQuery.mutateAsync({ latitude, longitude });
    console.log({ data });
    setDeliveryAddress((prev) => ({
      ...prev,
      deliveryAddress: { ...prev?.deliveryAddress, address: data?.results[0]?.formatted_address, latitude, longitude },
    }));
  };

  const onChangeAddressHandler = (address) => {
    setDeliveryAddress((prev) => ({
      ...prev,
      deliveryAddress: { ...prev?.deliveryAddress, address },
    }));
  };

  const onChangeDeliveryAddressHandler = (e) => {
    setDeliveryAddress((prev) => ({
      ...prev,
      deliveryAddress: { ...prev?.deliveryAddress, [e.target.name]: e.target.value },
    }));
  };

  const submitDeliveryAddress = () => {
    const validate = validateDeliveryAddress(deliveryAddress);

    if (validate?.status === true) {
      updateDeliveryAddressQuery.mutate(deliveryAddress);
    }
  };

  useEffect(() => {
    getSelectedLatLng({ latitude: order?.dropOffLocation?.latitude, longitude: order?.dropOffLocation?.longitude });
  }, [order?.dropOffLocation?.latitude, order?.dropOffLocation?.longitude]);

  return (
    <Grid
      container
      width="100%"
      height="100%"
      sx={{
        width: 'min(90vw, 1440px)',
        height: 'min(90vh, 750px)',
        background: '#fff',
        position: 'relative',
        borderRadius: '8px',
        padding: '12px',
        overflow: 'auto',
      }}
      spacing={4}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          '&.MuiGrid-item': {
            paddingLeft: '0px !important',
            paddingTop: '0px !important',
          },
        }}
      >
        {/* map */}
        <Stack sx={{ height: { xs: '350px', md: '100%' } }}>
          <Box flex={1}>
            <Map
              setMapReference={setMapReference}
              dropoff={order?.dropOffLocation}
              deliveryAddress={deliveryAddress}
              getSelectedLatLng={getSelectedLatLng}
            />
          </Box>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          '&.MuiGrid-item': {
            paddingRight: '0px !important',
            paddingTop: '0px !important',
          },
          '@media (max-width: 900px)': {
            '&.MuiGrid-item': {
              paddingLeft: '0px !important',
              paddingTop: '5px !important',
            },
          },
        }}
      >
        {/* input feilds */}
        <Stack width="100%">
          <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
            <Typography fontSize="18px" variant="h4">
              Change Delivery Address
            </Typography>
            <CloseButton onClick={onClose} size="medium" />
          </Stack>
          <StyledSearchAddress
            setMapReference={setMapReference}
            mapReference={mapReference}
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            onChangeAddressHandler={onChangeAddressHandler}
            getZoneServiceQuery={getZoneServiceQuery}
          />
          <StyledFormField
            intputType="text"
            label="Apt/Suite/Floor *"
            inputProps={{
              name: 'apartment',
              value: deliveryAddress?.deliveryAddress?.apartment,
              onChange: onChangeDeliveryAddressHandler,
            }}
          />
          <StyledFormField
            intputType="text"
            label="Business or Building name"
            inputProps={{
              name: 'buildingName',
              value: deliveryAddress?.deliveryAddress?.buildingName,
              onChange: onChangeDeliveryAddressHandler,
            }}
          />

          <Stack py={3}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px', pb: '8px' }} variant="h4">
              Delivery option
            </Typography>
            <OptionsSelect
              intputType="text"
              label="Delivery Option"
              sx={{ padding: '8px 10px' }}
              value={deliveryAddress?.deliveryAddress?.deliveryOptions}
              items={deliveryOptions}
              onChange={(value) => {
                setDeliveryAddress((prev) => ({
                  ...prev,
                  deliveryAddress: { ...prev?.deliveryAddress, deliveryOptions: value },
                }));
              }}
            />
          </Stack>
          <StyledFormField
            intputType="text"
            label="Add Instruction"
            inputProps={{
              name: 'instructions',
              value: deliveryAddress?.deliveryAddress?.instructions,
              onChange: onChangeDeliveryAddressHandler,
            }}
          />

          <StyledFormField
            intputType="text"
            label="Address Label *"
            inputProps={{
              name: 'addressLabel',
              value: deliveryAddress?.deliveryAddress?.addressLabel,
              onChange: onChangeDeliveryAddressHandler,
            }}
          />

          <Stack direction="row" mt={4.5} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={submitDeliveryAddress}
              disabled={updateDeliveryAddressQuery?.isLoading || disableButton}
            >
              {disableButton ? 'Service Unavailable Here' : 'Confirm Location'}
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default ChangeDeliveryAddress;
