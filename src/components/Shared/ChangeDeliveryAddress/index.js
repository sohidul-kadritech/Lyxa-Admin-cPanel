/* eslint-disable no-unused-vars */
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
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
      address: order?.deliveryAddress?.address || '',
      nickname: order?.deliveryAddress?.nickname || '',
      apartment: order?.deliveryAddress?.apartment || '',
      latitude: order?.deliveryAddress?.latitude || '',
      longitude: order?.deliveryAddress?.longitude || '',
      country: order?.deliveryAddress?.country || '',
      state: order?.deliveryAddress?.state || '',
      city: order?.deliveryAddress?.city || '',
      pin: order?.deliveryAddress?.pin || '',
      note: order?.deliveryAddress?.note || '',
      tags: order?.deliveryAddress?.tags || '',
      placeId: order?.deliveryAddress?.placeId || '',
      buildingName: order?.deliveryAddress?.buildingName || '',
      deliveryOptions: order?.deliveryAddress?.deliveryOptions || '',
      addressLabel: order?.deliveryAddress?.addressLabel || '',
      instructions: order?.deliveryAddress?.instructions || '',
    },
  };
  return templateOfDeliveryAddress;
};

function ChangeDeliveryAddress({ order, onClose }) {
  const [deliveryAddress, setDeliveryAddress] = useState(initialDeliveryAddress(order));

  const queryClient = useQueryClient();

  const getSelectedLatLng = async ({ latitude, longitude }) => {
    const { data } = await getLocationFromLatLng(latitude, longitude);
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

  const updateDeliveryAddressQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_ORDER_DELIVERY_ADDRESS, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data?.message);
        queryClient.invalidateQueries(API_URL.ORDER_LIST);
        queryClient.invalidateQueries(API_URL.URGENT_ORDER_COUNT);
        queryClient.invalidateQueries(API_URL.LATE_ORDER_COUNT);
        onClose();
      } else {
        successMsg(data?.message);
      }
    },
  });

  const submitDeliveryAddress = () => {
    const validate = validateDeliveryAddress(deliveryAddress);

    if (validate?.status === true) {
      updateDeliveryAddressQuery.mutate(deliveryAddress);
    }
  };

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
              /* Adjust styles for screens smaller than or equal to 600px */
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
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            onChangeAddressHandler={onChangeAddressHandler}
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

          <Stack>
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
              disabled={updateDeliveryAddressQuery?.isLoading}
            >
              Confirm Location
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default ChangeDeliveryAddress;
