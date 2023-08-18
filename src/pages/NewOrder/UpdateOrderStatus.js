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
    label: 'Assign rider',
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

const validate = (currentStatus, currentOrderDelivery, currentOrder) => {
  if (currentStatus === '') {
    successMsg('Please select status');
    return false;
  }

  if (currentStatus === 'accepted_delivery_boy' && !currentOrderDelivery?._id) {
    successMsg('Please select rider');
    return false;
  }

  if (
    (currentStatus === 'delivered' || currentStatus === 'preparing') &&
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

  Object.entries(options)?.forEach((opt) => {
    list.push({
      label: opt[1]?.label,
      value: opt[0],
      position: opt[1]?.position,
    });
  });

  if (currentOrder?.shop?.haveOwnDeliveryBoy) {
    list = list.filter((opt) => opt.value !== 'accepted_delivery_boy');
  }

  if (currentOrder?.isButler) {
    list = list.filter((opt) => opt.value !== 'preparing' && opt.value !== 'ready_to_pickup');
  }

  return list;
};

const getNextStatus = (order) => {
  const items = updateOrderStatusOptions(order);
  const currIdx = items?.findIndex((obj) => obj.value === order?.orderStatus);
  return items[currIdx + 1]?.value;
};

export default function UpdateOrderStatus({
  onClose,
  currentOrder: order,
  onSuccess: onUpdateSuccess,
  refetchApiKey = Api.ORDER_LIST,
}) {
  const theme = useTheme();
  const { socket } = useSelector((state) => state.socketReducer);
  const queryClient = useQueryClient();

  const [currentStatus, setCurrentStatus] = useState(getNextStatus(order));
  const [currentOrderDelivery, setCurrentOrderDelivery] = useState(order?.deliveryBoy || {});
  const [currentOrder, setCurrentOrder] = useState(order);
  const [open, setOpen] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

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

  const onSuccess = (response, payload) => {
    // notification
    successMsg(response?.message, response?.status ? 'success' : undefined);

    if (response.status) {
      queryClient.invalidateQueries(refetchApiKey);
      if (onUpdateSuccess) onUpdateSuccess(response);

      // emit socket
      if (payload.service === 'regular') {
        if (payload?.data?.orderStatus === 'accepted_delivery_boy') {
          socket?.emit('adminAcceptedOrder', { orderId: payload.data?.orderId });
        } else {
          console.log('socket emited');
          socket?.emit('updateOrder', {
            orderId: payload.data?.orderId,
          });
        }
      }

      if (response?.data?.order?.orderStatus === 'delivered') {
        onClose();
      } else {
        setCurrentOrder(response?.data?.order);
        setCurrentStatus(getNextStatus(response?.data?.order));
      }
    }
  };

  const updateStatusMutation = useMutation(
    (payload) => {
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_UPDATE_STATUS : Api.ORDRE_UPDATE_STATUS;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess,
      onError: (error) => {
        console.log('api error: ', error);
      },
    }
  );

  const updateStatus = () => {
    if (!validate(currentStatus, currentOrderDelivery, currentOrder)) return;
    const data = {};
    data.orderId = currentOrder?._id;
    data.orderStatus = currentStatus;
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
        borderRadius: '8px',
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
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            sx={{
              '& .MuiListItemText-root': {
                margin: 0,
              },
            }}
            fullWidth
            IconComponent={KeyboardArrowDownIcon}
            value={currentStatus}
            onChange={(e) => {
              setCurrentStatus(e.target.value);
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

                  '&.Mui-disabled': {
                    background: 'rgba(94, 151, 169, 0.1)',
                  },
                },

                '& .MuiMenuItem-root.Mui-disabled': {
                  opacity: 1,

                  '& .MuiListItemText-root': {
                    color: 'rgb(54 54 54 / 50%)',
                  },
                },
              },
            }}
          >
            {updateOrderStatusOptions(currentOrder).map((item, index) => (
              <MenuItem
                console={console.log(item?.position, options[currentOrder?.orderStatus]?.position)}
                disabled={item?.position <= options[currentOrder?.orderStatus]?.position}
                className={item?.position === options[currentOrder?.orderStatus]?.position ? 'active-status' : ''}
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
                  {item?.value !== 'accepted_delivery_boy' && `${index + 1}. ${item?.label}`}
                  {item?.value === 'accepted_delivery_boy' && (
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <span>
                        {index + 1}. {item?.label}{' '}
                        {currentOrderDelivery?._id ? `- (${currentOrderDelivery?.name})` : ''}
                      </span>
                      {item?.position <= options[currentOrder?.orderStatus]?.position &&
                        currentStatus !== 'accepted_delivery_boy' && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpen(false);
                              setShowDelivery(true);
                            }}
                            style={{
                              color: '#5E97A9',
                              textDecoration: 'underline',
                              zIndex: '999',
                              pointerEvents: 'all',
                              opacity: 1,
                              cursor: 'pointer',
                            }}
                          >
                            Change Rider
                          </span>
                        )}
                    </Stack>
                  )}
                </ListItemText>
              </MenuItem>
            ))}
          </StyledSelect>
        </Box>
        {(currentStatus === 'accepted_delivery_boy' || showDelivery) && (
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
