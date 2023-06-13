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
import React from 'react';
import CloseButton from '../../components/Common/CloseButton';
import { successMsg } from '../../helpers/successMsg';

function UpdateOrderStatusForm({ updateStatusModal, resetUpdateStatusModal, newOrderStatus, ...props }) {
  // Update order status
  const UpdateOrderStatus = () => {
    if (newOrderStatus === '') {
      successMsg('Please select status');
      return;
    }

    if (newOrderStatus === 'accepted_delivery_boy' && !props?.currentOrderDelivery?._id) {
      successMsg('Please select butler');
      return;
    }

    if (
      (newOrderStatus === 'delivered' || newOrderStatus === 'preparing') &&
      !props?.currentOrderDelivery?._id &&
      !props?.currentOrder?.shop?.haveOwnDeliveryBoy
    ) {
      successMsg(`Assign delivery boy first`);
      return;
    }

    const data = {};
    data.orderId = props?.currentOrder?._id;
    data.orderStatus = newOrderStatus;
    data.deliveryBoy = props?.currentOrderDelivery?._id || '';
    data.shop = props?.currentOrderShop?._id || undefined;
    console.log('===>', data);
    // props?.updateStatusMutation.mutate({ service: props?.currentOrder?.isButler ? 'butler' : 'regular', data });
  };

  const updateOrderStatusOptions = (currentOrder) => {
    const list = [];

    currentOrder?.timeline?.forEach((item) => {
      if (item.status === 'placed') return;
      if (item.status === 'accepted_delivery_boy' ? false : currentOrder?.orderStatus === item?.status) return;

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
                props.setNewOrderStatus(e.target.value);
              }}
            >
              {updateOrderStatusOptions(props?.currentOrder).map((item) => (
                <MenuItem key={item.value} value={item.value} disabled={item.disabled}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* near by delivery boys */}
          {newOrderStatus === 'accepted_delivery_boy' && (
            <Autocomplete
              value={props?.currentOrderDelivery}
              disabled={props?.nearByDeliveryBoysQuery.isLoading || props?.nearByDeliveryBoysQuery?.isFetching}
              onChange={(event, newValue) => {
                props?.setCurrentOrderDelivery(newValue);
              }}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              inputValue={props?.currentButlerSearchKey}
              onInputChange={(event, newInputValue) => {
                props?.setCurrentButlerSearchKey(newInputValue);
              }}
              options={props?.nearByDeliveryBoysQuery.data?.data?.nearByDeliveryBoys || []}
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
            disabled={props?.updateStatusMutation.isLoading}
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
