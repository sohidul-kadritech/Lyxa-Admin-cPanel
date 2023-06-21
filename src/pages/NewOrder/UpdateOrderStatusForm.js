import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import CloseButton from '../../components/Common/CloseButton';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

function UpdateOrderStatusForm({ setCurrentOrder, onClose, currentOrder }) {
  const { socket } = useSelector((state) => state.socketReducer);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [currentOrderShop, setCurrentOrderShop] = useState(currentOrder?.shop || {});
  const [currentOrderDelivery, setCurrentOrderDelivery] = useState(currentOrder?.deliveryBoy || {});
  const queryClient = useQueryClient();
  const [currentButlerSearchKey, setCurrentButlerSearchKey] = useState('');
  // Update Status
  const resetUpdateStatusModal = () => {
    onClose();
    setNewOrderStatus('');
    setCurrentButlerSearchKey('');
    setCurrentOrderDelivery({});
    setCurrentOrder({});
    setCurrentOrderShop({});
  };

  const getNearByDeliveryBoys = () => {
    const API = currentOrder?.isButler ? Api.NEAR_BY_BUTLERS_FOR_ORDER : Api.ACTIVE_DEIVERY_BOYS;
    return AXIOS.get(API, {
      params: {
        orderId: currentOrder?._id,
      },
    });
  };

  const nearByDeliveryBoysQuery = useQuery(
    ['single-order-nearby-delivery-boys', { orderId: currentOrder?._id || '' }],
    getNearByDeliveryBoys,
    {
      enabled: newOrderStatus === 'accepted_delivery_boy',
      cacheTime: 0,
      staleTime: 0,
      onSuccess: (data) => {
        if (!data?.status) {
          successMsg(data?.message || 'Could not get delivery boys');
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
        successMsg(error?.message || 'Could not get delivery boys', 'error');
      },
      // eslint-disable-next-line prettier/prettier
    }
  );

  const updateStatusMutation = useMutation(
    (payload) => {
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_UPDATE_STATUS : Api.ORDRE_UPDATE_STATUS;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess: (data, config) => {
        console.log(data, config);
        if (data.status) {
          successMsg(data?.message, 'success');
          queryClient.invalidateQueries(Api.ORDER_LIST);
          resetUpdateStatusModal();
          // emit socket
          if (config.service === 'regular') {
            if (config?.data?.orderStatus === 'accepted_delivery_boy')
              socket.emit('adminAcceptedOrder', { orderId: config.data?.orderId });
            else
              socket.emit('updateOrder', {
                orderId: config.data?.orderId,
              });
          }
        } else {
          successMsg(data?.message);
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
      },
      // eslint-disable-next-line prettier/prettier
    }
  );

  // Update order status
  const UpdateOrderStatus = () => {
    if (newOrderStatus === '') {
      successMsg('Please select status');
      return;
    }

    if (newOrderStatus === 'accepted_delivery_boy' && !currentOrderDelivery?._id) {
      successMsg('Please select butler');
      return;
    }

    if (
      (newOrderStatus === 'delivered' || newOrderStatus === 'preparing') &&
      !currentOrderDelivery?._id &&
      !currentOrder?.shop?.haveOwnDeliveryBoy
    ) {
      successMsg(`Assign delivery boy first`);
      return;
    }

    const data = {};
    data.orderId = currentOrder?._id;
    data.orderStatus = newOrderStatus;
    data.deliveryBoy = currentOrderDelivery?._id || '';
    data.shop = currentOrderShop?._id || undefined;
    console.log('===>', data);
    updateStatusMutation.mutate({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
  };

  const updateOrderStatusOptions = (currentOrder) => {
    console.log('current order: ', currentOrder);
    const list = [];

    currentOrder?.timeline?.forEach((item) => {
      if (item.status === 'placed') return;
      if (item.status === 'accepted_delivery_boy' ? false : currentOrder?.orderStatus === item?.status) return;
      if (item?.status === 'accepted_delivery_boy' && currentOrder?.shop?.haveOwnDeliveryBoy) return;

      list.push({
        value: item?.status,
        label: item?.title,
      });
    });

    return list;
  };

  return (
    <Paper
      sx={{
        minWidth: 'max(35vw, 450px)',
      }}
    >
      <Box padding={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={8}>
          <Typography variant="h3">Update Order Status</Typography>
          <CloseButton
            onClick={() => {
              resetUpdateStatusModal();
            }}
          />
        </Stack>
        <Stack spacing={6}>
          <FormControl>
            <InputLabel>Select Status</InputLabel>
            <Select
              value={newOrderStatus}
              label="Select Status"
              onChange={(e) => {
                setNewOrderStatus(e.target.value);
              }}
            >
              {updateOrderStatusOptions(currentOrder).map((item) => (
                <MenuItem key={item.value} value={item.value} disabled={item.disabled}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* near by delivery boys */}
          {newOrderStatus === 'accepted_delivery_boy' && (
            <Autocomplete
              value={currentOrderDelivery}
              disabled={nearByDeliveryBoysQuery.isLoading || nearByDeliveryBoysQuery?.isFetching}
              onChange={(event, newValue) => {
                setCurrentOrderDelivery(newValue);
              }}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              inputValue={currentButlerSearchKey}
              onInputChange={(event, newInputValue) => {
                setCurrentButlerSearchKey(newInputValue);
              }}
              options={nearByDeliveryBoysQuery.data?.data?.nearByDeliveryBoys || []}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Select " />}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option._id}>
                  {option.name}
                </Box>
              )}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            disabled={updateStatusMutation?.isLoading}
            onClick={() => {
              UpdateOrderStatus();
            }}
          >
            Update
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default UpdateOrderStatusForm;
