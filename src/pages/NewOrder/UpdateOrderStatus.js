import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, ListItemText, MenuItem, Stack, Typography, useTheme } from '@mui/material';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import CloseButton from '../../components/Common/CloseButton';
import LoadingOverlay from '../../components/Common/LoadingOverlay';
import { StyledSelect } from '../../components/Filter/FilterSelect';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

const options = {
  placed: {
    label: 'Placed',
    position: 1,
  },
  accepted_delivery_boy: {
    label: 'Accepted by rider',
    position: 2,
    isChangeDelivery: true,
  },
  preparing: {
    label: 'Preparing',
    position: 3,
  },
  ready_to_pickup: {
    label: 'Ready to pickup',
    position: 4,
  },
  order_on_the_way: {
    label: 'On the way',
    position: 5,
  },
  delivered: {
    label: 'Delivered',
    position: 6,
  },
};

const validate = (newOrderStatus, currentOrderDelivery, currentOrder) => {
  if (newOrderStatus === '') {
    successMsg('Please select status');
    return false;
  }

  if (newOrderStatus === 'accepted_delivery_boy' && !currentOrderDelivery?._id) {
    successMsg('Please select rider');
    return false;
  }

  if (
    (newOrderStatus === 'delivered' || newOrderStatus === 'preparing') &&
    !currentOrderDelivery?._id &&
    !currentOrder?.shop?.haveOwnDeliveryBoy
  ) {
    successMsg(`Assign rider first`);
    return false;
  }

  return true;
};

const updateOrderStatusOptions = (currentOrder) => {
  let list = [];
  const currentStatus = options[currentOrder?.orderStatus];

  Object.entries(options)?.forEach((opt) => {
    list.push({
      label: opt[1]?.label,
      value: opt[0],
      isDisabled: opt[1]?.position <= currentStatus?.position && opt[0] !== 'accepted_delivery_boy',
      isCurrentStatus: currentStatus?.position === opt[1]?.position,
    });
  });

  if (currentOrder?.shop?.haveOwnDeliveryBoy) {
    list = list.filter((opt) => opt.value !== 'accepted_delivery_boy');
  }

  return list;
};

export default function UpdateOrderStatus({ onClose, currentOrder, refetchApiKey = Api.ORDER_LIST }) {
  const theme = useTheme();

  const { socket } = useSelector((state) => state.socketReducer);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [currentOrderDelivery, setCurrentOrderDelivery] = useState(currentOrder?.deliveryBoy || {});
  const queryClient = useQueryClient();

  const getNearByDeliveryBoys = () => {
    const API = currentOrder?.isButler ? Api.NEAR_BY_BUTLERS_FOR_ORDER : Api.ACTIVE_DEIVERY_BOYS;
    return AXIOS.get(API, {
      params: {
        orderId: currentOrder?._id,
      },
    });
  };

  const nearByDeliveryBoysQuery = useQuery(
    ['single-order-nearby-delivery-boys', { orderId: currentOrder?._id }],
    getNearByDeliveryBoys,
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: newOrderStatus === 'accepted_delivery_boy',
      onSuccess: (data) => {
        if (!data?.status) {
          successMsg(data?.message || 'Could not get delivery boys');
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
        successMsg(error?.message || 'Could not get delivery boys', 'error');
      },
    }
  );

  const updateStatusMutation = useMutation(
    (payload) => {
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_UPDATE_STATUS : Api.ORDRE_UPDATE_STATUS;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess: (data, config) => {
        successMsg(data?.message, data?.status ? 'success' : undefined);

        if (data.status) {
          queryClient.invalidateQueries(refetchApiKey);

          // emit socket
          if (config.service === 'regular') {
            if (config?.data?.orderStatus === 'accepted_delivery_boy')
              socket.emit('adminAcceptedOrder', { orderId: config.data?.orderId });
            else
              socket.emit('updateOrder', {
                orderId: config.data?.orderId,
              });
          }

          onClose();
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
      },
    }
  );

  const updateStatus = () => {
    if (!validate(newOrderStatus, currentOrderDelivery, currentOrder)) {
      return;
    }

    const data = {};
    data.orderId = currentOrder?._id;
    data.orderStatus = newOrderStatus;
    data.deliveryBoy = currentOrderDelivery?._id;
    data.shop = currentOrder?.shop?._id;

    updateStatusMutation.mutate({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
  };

  return (
    <Box
      sx={{
        padding: '15px 20px 20px',
        minWidth: 'max(38vw, 600px)',
        background: '#fff',
        position: 'relative',
      }}
    >
      {updateStatusMutation?.isLoading && <LoadingOverlay spinner />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
        <Typography fontSize="18px" variant="h4">
          Update Status
        </Typography>
        <CloseButton onClick={onClose} size="sm" />
      </Stack>
      <Stack>
        <Box flex={1} pb={3}>
          <Typography
            pb={2}
            variant="h5"
            sx={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '18px',
            }}
          >
            Select Status *
          </Typography>
          <StyledSelect
            sx={{
              '& .MuiListItemText-root': {
                margin: 0,
              },
            }}
            fullWidth
            IconComponent={KeyboardArrowDownIcon}
            value={newOrderStatus}
            onChange={(e) => {
              setNewOrderStatus(e.target.value);
            }}
            MenuProps={{
              sx: {
                marginTop: '4px',
                '& .MuiPaper-root': {
                  background: '#F6F8FA',
                  boxShadow: 'initial!important',
                  borderRadius: '7px',
                  border: '1px solid #EEEEEE',
                },

                '& .MuiMenuItem-root.active-status': {
                  background: 'rgba(94, 151, 169, 0.3)',
                },
              },
            }}
          >
            {updateOrderStatusOptions(currentOrder).map((item, index) => (
              <MenuItem
                disabled={item?.isDisabled}
                console={console.log('active', item?.isCurrentStatus)}
                className={item?.isCurrentStatus ? 'active-status' : ''}
                key={index}
                value={item?.value}
                sx={{
                  '&:hover': {
                    background: '#ecf0f5',
                  },
                  '&.Mui-selected': {
                    background: '#ecf0f5!important',
                  },
                  [theme.breakpoints.up('lg')]: {
                    fontSize: '12px',
                  },
                  [theme.breakpoints.up('xl')]: {
                    fontSize: '14px',
                  },
                }}
              >
                <ListItemText disableTypography>
                  {index + 1}. {item?.label}
                </ListItemText>
              </MenuItem>
            ))}
          </StyledSelect>
        </Box>
        {newOrderStatus === 'accepted_delivery_boy' && (
          <Box flex={1}>
            <StyledFormField
              label="Select Rider *"
              intputType="autocomplete"
              inputProps={{
                fullWidth: true,
                getOptionLabel: (option) => option?.name || 'Choose',
                sx: {
                  '&:has(.MuiInputBase-input:focus)': {
                    width: '100% !important',
                  },
                  flex: 1,
                },
                maxHeight: '300px',
                options: nearByDeliveryBoysQuery.data?.data?.nearByDeliveryBoys || [],
                value: currentOrderDelivery,
                isOptionEqualToValue: (option, value) => option?._id === value?._id,
                onChange: (e, v) => {
                  setCurrentOrderDelivery(v);
                },
                renderOption: (props, option) => (
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between !important',
                    }}
                    width="100%"
                    component="li"
                    {...props}
                    key={option._id}
                  >
                    <span> {option.name}</span>
                    <span>{(option.shopDistance || 0).toFixed(3)} km</span>
                  </Stack>
                ),
              }}
            />
          </Box>
        )}
        <Box pt={5} textAlign="right">
          <Button
            color="primary"
            variant="contained"
            sx={{ width: '200px' }}
            onClick={() => {
              updateStatus();
            }}
            disabled={updateStatusMutation?.isLoading}
          >
            Update
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
