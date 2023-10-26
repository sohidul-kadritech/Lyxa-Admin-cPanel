/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, ListItemText, MenuItem, Stack, Typography, useTheme } from '@mui/material';

import moment from 'moment';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import socketServices from '../../../common/socketService';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CloseButton from '../../Common/CloseButton';
import LoadingOverlay from '../../Common/LoadingOverlay';
import { StyledSelect } from '../../Filter/FilterSelect';
import StyledFormField from '../../Form/StyledFormField';
import {
  getNextStatus,
  newStatusOptions,
  paidCurrencyOptions,
  statusOptions,
  updateOrderStatusOptions,
  validate,
} from './helpers';

const disableUpdateStatusButton = (order, currentStatus, deliveryBoy) => {
  const isGlobal = order?.orderFor === 'global';

  const isPreparing = order?.orderStatus === 'preparing';

  const notAssignRider = !order?.deliveryBoy;

  const shouldNotDisable = isGlobal && isPreparing && notAssignRider;

  if (shouldNotDisable && currentStatus === 'accepted_delivery_boy') {
    console.log('1', false);
    return false;
  }

  if (currentStatus === 'accepted_delivery_boy' && !notAssignRider) {
    console.log('2', true);
    return true;
  }

  if (currentStatus === 'ready_to_pickup' && !notAssignRider && getNextStatus(order, true) === 'ready_to_pickup') {
    return false;
  }

  if (getNextStatus(order, true) === currentStatus) {
    return false;
  }

  if (deliveryBoy?._id !== order?.deliveryBoy?._id) {
    return false;
  }

  return true;
};

export const getUpdateStatusValue = (currentOrder, currentStatus) => {
  const status = currentStatus;

  const isGlobal = currentOrder?.orderFor === 'global';

  const notAssignRider = !currentOrder?.deliveryBoy;

  const isPreparingFirst =
    !currentOrder?.accepted_delivery_boyAt && currentOrder?.preparingAt
      ? true
      : moment(currentOrder?.accepted_delivery_boyAt) > moment(currentOrder?.preparingAt);

  const isPreparingFirstAndShouldChangeTheCurrentValue = isGlobal && isPreparingFirst;

  if (currentStatus === 'preparing' && isPreparingFirstAndShouldChangeTheCurrentValue && notAssignRider) {
    return 'preparing';
  }

  if (currentStatus === 'preparing' && isPreparingFirstAndShouldChangeTheCurrentValue && !notAssignRider) {
    return 'accepted_delivery_boy';
  }

  if (
    currentStatus === 'replacement_item_on_the_way' &&
    currentOrder?.isReplacementItemPickFromUser &&
    currentOrder?.orderStatus === 'replacement_item_on_the_way'
  ) {
    return 'replacement_item_on_the_way';
  }

  return status;
};

const getUpdatedOrderData = (order) => {
  const orderdata = order;
  const isPreparing = orderdata?.orderStatus === 'preparing';
  const notAssignRider = !orderdata?.deliveryBoy;
  const shouldUpdate = isPreparing && !notAssignRider;
  const isPreparingFirst =
    !order?.accepted_delivery_boyAt && order?.preparingAt
      ? true
      : moment(order?.accepted_delivery_boyAt) > moment(order?.preparingAt);

  const changedLabel = isPreparingFirst ? 'accepted_delivery_boy' : 'preparing';

  const updatedData = !shouldUpdate ? { ...orderdata } : { ...orderdata, orderStatus: changedLabel };

  if (order?.isReplacementItemPickFromUser && order?.orderStatus === 'order_on_the_way') {
    return { ...orderdata, orderStatus: 'replacement_item_on_the_way' };
  }

  if (order?.isButler) {
    return { ...orderdata };
  }

  return updatedData;
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

  const { general } = useGlobalContext();

  const { appSetting } = general;

  const isSecondaryCurrencyEnabled = appSetting?.adminExchangeRate > 0;

  // when order is replacement order and isReplacementItemPickFromUser equal to true and current order status is order on the way. then it should be replace with replacement item on the way
  const [currentStatus, setCurrentStatus] = useState(
    order?.isReplacementItemPickFromUser && order?.orderStatus === 'order_on_the_way'
      ? 'replacement_item_on_the_way'
      : order.orderStatus,
  );

  // old one
  // const [currentStatus, setCurrentStatus] = useState(getNextStatus(order));
  const [currentOrderDelivery, setCurrentOrderDelivery] = useState(order?.deliveryBoy || null);

  const [currentOrder, setCurrentOrder] = useState(getUpdatedOrderData(order));

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
      queryClient.invalidateQueries(Api.URGENT_ORDER_LIST);

      if (onUpdateSuccess) onUpdateSuccess(response);

      // emit socket

      if (payload?.data?.orderStatus === 'accepted_delivery_boy') {
        // console.log('update order socket.... accepted_delivery_boy', payload?.data?.orderId);
        socketServices?.emit('adminAcceptedOrder', { orderId: payload.data?.orderId });
      } else {
        // console.log('update order socket....', payload?.data?.orderId);
        socketServices?.emit('updateOrder', {
          orderId: payload.data?.orderId,
        });
      }

      if (response?.data?.order?.orderStatus === 'delivered') {
        queryClient.invalidateQueries(Api.LATE_ORDER_COUNT);
        queryClient.invalidateQueries(Api.URGENT_ORDER_COUNT);
        onClose();
      } else {
        setCurrentOrder(() => {
          const orderdata = response?.data?.order;

          return getUpdatedOrderData(orderdata);
        });

        // when order is replacement order and isReplacementItemPickFromUser equal to true and current order status is order on the way. then it should be replace with replacement item on the way
        setCurrentStatus(
          response?.data?.order?.isReplacementItemPickFromUser &&
            response?.data?.order?.orderStatus === 'order_on_the_way'
            ? 'replacement_item_on_the_way'
            : response?.data?.order?.orderStatus,
        );
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

  const updateStatus = async () => {
    if (!validate(currentStatus, currentOrderDelivery, currentOrder, paidCurrency)) return;

    const data = {};
    data.orderId = currentOrder?._id;
    data.orderStatus = currentStatus;
    data.shop = currentOrder?.shop?._id;
    data.deliveryBoy = currentOrderDelivery?._id === 'no-rider' ? undefined : currentOrderDelivery?._id;
    // if not selected will be undefined
    data.paidCurrency = paidCurrency || undefined;

    const isChangedDelivery = currentOrder?.deliveryBoy?._id !== currentOrderDelivery?._id;

    const isSameStatus = currentOrder?.orderStatus === currentStatus;
    // deliveryBoy?._id !== order?.deliveryBoy?._id

    if (isSameStatus && isChangedDelivery && currentOrder?.deliveryBoy?._id) {
      await updateStatusMutation.mutateAsync({
        service: currentOrder?.isButler ? 'butler' : 'regular',
        data: { ...data, orderStatus: 'accepted_delivery_boy' },
      });
      return;
    }

    if (!isSameStatus && isChangedDelivery && currentOrder?.deliveryBoy?._id) {
      await updateStatusMutation.mutateAsync({
        service: currentOrder?.isButler ? 'butler' : 'regular',
        data: { ...data, orderStatus: 'accepted_delivery_boy' },
      });
      await updateStatusMutation.mutateAsync({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
      return;
    }

    if (!isSameStatus) {
      await updateStatusMutation.mutateAsync({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
      return;
    }

    successMsg('Please change the status first');
    // mutateAsync
  };

  // auto asignRider handler here

  const autoAssingRiderHandler = async () => {
    if (!isSelfShop) await globalRidersQuery?.refetch();
    else {
      await shopRiderQuery?.refetch();
    }
    setCurrentOrderDelivery((prev) => {
      // check the length of the rider list;
      if (deliveryBoyList?.length > 0) {
        // check the old rider is availble in the list or not.
        const isExistRider = deliveryBoyList?.findIndex((item) => item?._id === prev?._id);

        if (isExistRider >= 0) {
          // if exist check the the index is same or less than the delivery boy list length or not.
          if (isExistRider > 0) {
            // if the existing rider index is smaller than  deliverylist length select the next one.
            return deliveryBoyList[0];
          }

          if (isExistRider === 0 && deliveryBoyList?.length > 1) {
            return deliveryBoyList[1];
          }
          // otherwise select the last one of the list

          successMsg('There are no available riders to change');

          return deliveryBoyList[deliveryBoyList?.length - 1];
        }
        // if (isExistRider >= 0) {
        //   // if exist check the the index is same or less than the delivery boy list length or not.
        //   if (isExistRider < deliveryBoyList?.length - 1) {
        //     // if the existing rider index is smaller than  deliverylist length select the next one.
        //     return deliveryBoyList[isExistRider + 1];
        //   }
        //   // otherwise select the last one of the list

        //   return deliveryBoyList[deliveryBoyList?.length - 1];
        // }
        // select the 1st rider
        return deliveryBoyList[0];
      }

      successMsg('No riders are there!');

      return prev;
    });
  };

  console.log({ currentStatus, deliveryBoy: currentOrder?.deliveryBoy });

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
            value={getUpdateStatusValue(currentOrder, currentStatus)}
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
                disabled={item?.position <= newStatusOptions(currentOrder)[currentOrder?.orderStatus]?.position}
                // disabled={item?.position <= statusOptions[currentOrder?.orderStatus]?.position}
                className={
                  item?.position === newStatusOptions(currentOrder)[currentOrder?.orderStatus]?.position
                    ? 'active-status'
                    : ''
                }
                // className={item?.position === statusOptions[currentOrder?.orderStatus]?.position ? 'active-status' : ''}
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
                        currentStatus !== 'accepted_delivery_boy' &&
                        currentOrder?.deliveryBoy && (
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
            <Button variant="text" disableRipple onClick={autoAssingRiderHandler}>
              {order?.deliveryBoy ? 'Auto re-assign rider' : 'Auto assign rider'}
            </Button>
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
        {currentStatus === 'delivered' && currentOrder?.paymentMethod === 'cash' && !currentOrder?.isReplacementOrder && (
          <Box>
            <StyledFormField
              label="Paid Currency *"
              intputType="select"
              inputProps={{
                value: paidCurrency,
                items: paidCurrencyOptions(isSecondaryCurrencyEnabled),
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
            disabled={
              updateStatusMutation?.isLoading ||
              disableUpdateStatusButton(currentOrder, currentStatus, currentOrderDelivery)
            }
          >
            Update
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
