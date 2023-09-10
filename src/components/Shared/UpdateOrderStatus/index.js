/* eslint-disable prettier/prettier */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, ListItemText, MenuItem, Stack, Typography, useTheme } from '@mui/material';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import socketServices from '../../../common/socketService';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CloseButton from '../../Common/CloseButton';
import LoadingOverlay from '../../Common/LoadingOverlay';
import { StyledSelect } from '../../Filter/FilterSelect';
import StyledFormField from '../../Form/StyledFormField';
import { paidCurrencyOptions, statusOptions, updateOrderStatusOptions, validate } from './helpers';

export default function UpdateOrderStatus({
  onClose,
  currentOrder: order,
  onSuccess: onUpdateSuccess,
  refetchApiKey = Api.ORDER_LIST,
}) {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const { socket } = useSelector((state) => state.socketReducer);
  const queryClient = useQueryClient();

  // new one
  const [currentStatus, setCurrentStatus] = useState(order.orderStatus);

  // old one
  // const [currentStatus, setCurrentStatus] = useState(getNextStatus(order));
  const [currentOrderDelivery, setCurrentOrderDelivery] = useState(order?.deliveryBoy || null);

  const [currentOrder, setCurrentOrder] = useState(order);
  const [paidCurrency, setPaidCurrency] = useState('');
  const [deliveryBoyList, setDeliveryBoyList] = useState([]);

  const [open, setOpen] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  const isSelfShop = currentOrder?.shop?.haveOwnDeliveryBoy;

  // global riders
  const getNearByDeliveryBoys = () => {
    const API = currentOrder?.isButler ? Api.NEAR_BY_BUTLERS_FOR_ORDER : Api.ACTIVE_DEIVERY_BOYS;
    return AXIOS.get(API, {
      params: {
        orderId: currentOrder?._id,
      },
    });
  };

  const globalRidersQuery = useQuery(
    ['single-order-nearby-delivery-boys', { orderId: currentOrder?._id }],
    getNearByDeliveryBoys,
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: !isSelfShop,
      onSuccess: (data) => {
        if (!data?.status) {
          successMsg(data?.message || 'Could not get delivery boys');
        } else {
          setDeliveryBoyList(data?.data?.nearByDeliveryBoys);
        }
      },
      onError: (error) => {
        console.log('api error: ', error);
        successMsg(error?.message || 'Could not get delivery boys', 'error');
      },
    },
  );

  // shop riders
  const shopRiderQuery = useQuery(
    [Api.SHOP_ACTIVE_DELIVERY_BOYS],
    () =>
      AXIOS.get(Api.SHOP_ACTIVE_DELIVERY_BOYS, {
        params: {
          shopId: currentOrder?.shop?._id,
          liveStatus: 'online',
        },
      }),
    {
      enabled: isSelfShop,
      onSuccess: (data) => {
        if (data?.status) {
          const riders = data?.data?.deliveryBoys;

          if (riders.length > 0) {
            setDeliveryBoyList([...(data?.data?.deliveryBoys || [])]);
          } else {
            setDeliveryBoyList([{ _id: 'no-rider', name: 'No Rider' }]);
          }
        }
      },
    },
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
          console.log('update order socket.... accepted_delivery_boy', payload?.data?.orderId);
          socketServices?.emit('adminAcceptedOrder', { orderId: payload.data?.orderId });
        } else {
          console.log('update order socket....', payload?.data?.orderId);
          socketServices?.emit('updateOrder', {
            orderId: payload.data?.orderId,
          });
        }
      }

      if (response?.data?.order?.orderStatus === 'delivered') {
        onClose();
      } else {
        setCurrentOrder(response?.data?.order);
        setCurrentStatus(response?.data?.order?.orderStatus);
        // setCurrentStatus(getNextStatus(response?.data?.order));
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
    },
  );

  const updateStatus = () => {
    if (!validate(currentStatus, currentOrderDelivery, currentOrder, paidCurrency)) return;

    const data = {};
    data.orderId = currentOrder?._id;
    data.orderStatus = currentStatus;
    data.shop = currentOrder?.shop?._id;
    data.deliveryBoy = currentOrderDelivery?._id === 'no-rider' ? undefined : currentOrderDelivery?._id;
    // if not selected will be undefined
    data.paidCurrency = paidCurrency || undefined;

    updateStatusMutation.mutate({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
  };

  console.log({ currentStatus });
  console.log({ isSelfShop });

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
          Update
        </Typography>
        <CloseButton onClick={onClose} size="sm" />
      </Stack>
      <Stack gap={5}>
        <Box flex={1}>
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
                disabled={item?.position <= statusOptions[currentOrder?.orderStatus]?.position}
                className={item?.position === statusOptions[currentOrder?.orderStatus]?.position ? 'active-status' : ''}
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

                      {item?.position <= statusOptions[currentOrder?.orderStatus]?.position &&
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
        {/* delivery boy */}
        {(((currentStatus === 'accepted_delivery_boy' || showDelivery) && !isSelfShop) ||
          (currentStatus === 'preparing' && isSelfShop)) && (
          <Box flex={1}>
            <StyledFormField
              disabled={globalRidersQuery?.isLoading || shopRiderQuery?.isLoading}
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
                options: deliveryBoyList,
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
                    {/* not for self riders */}
                    {!isSelfShop && <span>{(option.shopDistance || 0).toFixed(3)} km</span>}
                  </Stack>
                ),
              }}
            />
          </Box>
        )}

        {/* paid currency */}
        {currentStatus === 'delivered' && currentOrder?.paymentMethod === 'cash' && (
          <Box>
            <StyledFormField
              label="Paid Currency *"
              intputType="select"
              inputProps={{
                value: paidCurrency,
                items: paidCurrencyOptions,
                onChange: (e) => setPaidCurrency(e.target.value),
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
