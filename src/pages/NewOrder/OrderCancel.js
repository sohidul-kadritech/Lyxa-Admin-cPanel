/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Form } from 'reactstrap';
import CloseButton from '../../components/Common/CloseButton';
import StyledFormField from '../../components/Form/StyledFormField';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import {
  TitleWithToolTip,
  calculateTotalRefundedAmount,
  getRefundedVatForAdmin,
  orderCancelDataFormation,
} from './helpers';

const cancelOrderInit = {
  cancelReasonId: '',
  orderId: null,
  otherReason: '',
  refundType: 'none',
  deliveryBoy: {},
  partialPayment: {
    deliveryBoy: '',
    admin: '',
  },
};

const getOrderPayment = (currentOrder) => {
  if (currentOrder?.isButler) {
    return {
      deliveryBoy: currentOrder?.baseCurrency_riderFee,
      adminOrderProfit: currentOrder?.adminCharge?.baseCurrency_adminChargeFromOrder,
      adminRiderProfit: currentOrder?.adminCharge?.baseCurrency_adminChargeFromDelivery,
    };
  }

  return {
    shop: currentOrder?.baseCurrency_shopEarnings,
    deliveryBoy: currentOrder?.baseCurrency_riderFee,
    adminOrderProfit: currentOrder?.adminCharge?.baseCurrency_adminChargeFromOrder,
    adminRiderProfit: currentOrder?.adminCharge?.baseCurrency_adminChargeFromDelivery,
  };
};

function OrderCancel({ setOpenCancelModal, currentOrder, onSuccess, refetchApiKey = Api.ORDER_LIST }) {
  const { currentUser } = useGlobalContext();
  const { userType } = currentUser;

  const [orderCancel, setOrderCancel] = useState(
    orderCancelDataFormation('cancel_order', currentOrder, cancelOrderInit),
  );
  const [deliverySearchKey, setDeliverySearchKey] = useState(null);

  const [appVat, setAppVat] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [orderPayment, setOrderPayment] = useState(getOrderPayment(currentOrder));

  const [isOtherReason, setIsOtherReason] = useState(false);

  const queryClient = useQueryClient();

  // eslint-disable-next-line no-unused-vars
  const getAppSettingsData = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        console.log('app setttings; ', data?.data?.appSetting);
        setAppVat(data?.data?.appSetting?.vat);
      }
    },
  });

  const getCancelReasonsQuery = useQuery([Api.ALL_ORDER_CANCEL_REASON], () =>
    AXIOS.get(Api.ALL_ORDER_CANCEL_REASON, {
      params: {
        type: userType === 'shop' ? 'shopCancel' : '',
      },
    }),
  );

  const cancelOrderForButlarMutation = useMutation((data) => AXIOS.post(Api.BUTLER_CANCEL_ORDER, data), {
    onSuccess: (data) => {
      console.log('data response: ', data);
      if (data.status) {
        if (onSuccess) onSuccess(data);
        successMsg(data.message, 'success');
        console.log('data status true');
        setOpenCancelModal(false);
        queryClient.invalidateQueries(refetchApiKey);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const cancelOrderByAdminMutation = useMutation(
    (data) =>
      AXIOS.post(Api.CANCEL_ORDER, data, {
        params: {
          userType: userType === 'shop' ? 'shop' : 'admin',
        },
      }),
    {
      onSuccess: (data) => {
        console.log('data response: ', data);
        if (data.status) {
          if (onSuccess) onSuccess(data);
          successMsg(data.message, 'success');
          console.log('data status true');
          setOpenCancelModal(false);
          queryClient.invalidateQueries(refetchApiKey);
        } else {
          successMsg(data.message, 'error');
        }
      },
    },
  );

  const updateRefundType = (type) => {
    setOrderCancel({
      ...orderCancel,
      refundType: type,
      partialPayment:
        type === 'full'
          ? orderPayment
          : {
              shop: '',
              deliveryBoy: '',
              admin: '',
            },
    });
  };

  const updateRefundAmount = (e) => {
    const { name, value } = e.target;
    const oldOrderPayment = orderPayment;
    const { adminOrderProfit, adminRiderProfit, deliveryBoy, shop } = oldOrderPayment;
    const forShop =
      adminOrderProfit < 0
        ? shop + orderCancel.vatAmount.baseCurrency_vatForShop + deliveryBoy
        : shop + orderCancel.vatAmount.baseCurrency_vatForShop;

    // const forAdmin = orderPayment?.admin < 0 ? 0 : admin + deliveryBoy;
    // const forAdmin = getAdminRefundedAmount(adminOrderProfit, deliveryBoy, currentOrder?.orderStatus);

    if (Number(value) <= 0) {
      setOrderCancel({
        ...orderCancel,
        partialPayment: {
          ...orderCancel?.partialPayment,
          [name]: 0,
        },
      });

      return;
    }

    console.log({ adminRiderProfit });

    if (name === 'adminOrderProfit' && Number(value) > adminOrderProfit) {
      setOrderCancel({
        ...orderCancel,
        partialPayment: {
          ...orderCancel?.partialPayment,
          [name]: Number(adminOrderProfit),
        },
      });
      return;
    }

    if (name === 'adminRiderProfit' && Number(value) > adminRiderProfit) {
      setOrderCancel({
        ...orderCancel,
        partialPayment: {
          ...orderCancel?.partialPayment,
          [name]: Number(adminRiderProfit),
        },
      });
      return;
    }

    if (shop && name === 'shop' && Number(value) > forShop) {
      setOrderCancel({
        ...orderCancel,
        partialPayment: {
          ...orderCancel?.partialPayment,
          [name]: Number(forShop),
        },
      });

      return;
    }

    setOrderCancel({
      ...orderCancel,
      partialPayment: {
        ...orderCancel?.partialPayment,
        [name]: Number(value),
      },
    });
  };

  const submitOrderCancel = (e) => {
    e.preventDefault();

    const {
      partialPayment: { deliveryBoy, adminRiderProfit, adminOrderProfit, shop },
    } = orderCancel;

    if (currentOrder?.isButler) {
      if (orderCancel.refundType === 'partial' && !deliveryBoy && !adminRiderProfit) {
        successMsg('Enter Minimum One Partial Amount');
        return;
      }

      const data = {
        // ...orderCancel,
        orderId: orderCancel?.orderId,
        otherReason: orderCancel?.otherReason,
        refundType: orderCancel?.refundType,
        partialPayment: {
          shop: orderCancel?.partialPayment?.shop ? orderCancel?.partialPayment?.shop : 0,
          deliveryBoy: orderCancel?.partialPayment?.deliveryBoy ? orderCancel?.partialPayment?.deliveryBoy : 0,
          adminOrderProfit: orderCancel?.partialPayment?.adminOrderProfit
            ? orderCancel?.partialPayment?.adminOrderProfit
            : 0,
          adminRiderProfit: orderCancel?.partialPayment?.adminRiderProfit
            ? orderCancel?.partialPayment?.adminRiderProfit
            : 0,
          adminVat: getRefundedVatForAdmin(
            orderCancel?.vatAmount?.baseCurrency_vatForAdmin,
            orderCancel?.partialPayment?.adminRiderProfit +
              orderCancel?.partialPayment?.adminOrderProfit +
              orderCancel?.partialPayment?.deliveryBoy,
            appVat,
            // eslint-disable-next-line prettier/prettier
          ),
        },
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      delete data.deliveryBoy;

      cancelOrderForButlarMutation.mutate(data);
    } else {
      if (orderCancel.refundType === 'partial' && !shop && !deliveryBoy && !adminOrderProfit && !adminRiderProfit) {
        successMsg('Enter Minimum One Partial Amount');
        return;
      }
      const data = {
        // ...orderCancel,
        orderId: orderCancel?.orderId,
        otherReason: orderCancel?.otherReason,
        refundType: orderCancel?.refundType,
        partialPayment:
          orderCancel?.refundType !== 'full'
            ? {
                shop: orderCancel?.partialPayment?.shop ? orderCancel?.partialPayment?.shop : 0,
                deliveryBoy: orderCancel?.partialPayment?.deliveryBoy ? orderCancel?.partialPayment?.deliveryBoy : 0,
                adminOrderProfit: orderCancel?.partialPayment?.adminOrderProfit
                  ? orderCancel?.partialPayment?.adminOrderProfit
                  : 0,
                adminRiderProfit: orderCancel?.partialPayment?.adminRiderProfit
                  ? orderCancel?.partialPayment?.adminRiderProfit
                  : 0,
                adminVat: getRefundedVatForAdmin(
                  orderCancel?.vatAmount?.baseCurrency_vatForAdmin,
                  orderCancel?.partialPayment?.adminRiderProfit +
                    orderCancel?.partialPayment?.adminOrderProfit +
                    orderCancel?.partialPayment?.deliveryBoy,
                  appVat,
                ),
              }
            : {},
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };
      /*
      @When user type is shop we only payload orderId , cancelReasonId and otherReason not sent refund type/cancelType
      */
      if (userType === 'shop') {
        cancelOrderByAdminMutation.mutate({
          refundType: 'full',
          orderId: data?.orderId,
          cancelReasonId: data?.cancelReasonId,
          otherReason: data?.otherReason,
        });
        return;
      }
      cancelOrderByAdminMutation.mutate(data);
    }
  };

  const summary = currentOrder?.summary;

  const total_base =
    summary?.baseCurrency_totalAmount +
    summary?.baseCurrency_vat +
    summary?.baseCurrency_riderTip -
    summary?.baseCurrency_discount -
    summary?.reward?.baseCurrency_amount -
    summary?.baseCurrency_couponDiscountAmount;

  return (
    <Paper
      sx={{
        minWidth: 'max(35vw, 550px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Box padding={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={8}>
          <Typography variant="h3">Reject Order</Typography>
          <CloseButton
            onClick={() => {
              setOpenCancelModal(false);
            }}
          />
        </Stack>
        <Form onSubmit={submitOrderCancel}>
          <Autocomplete
            className="cursor-pointer mt-3"
            disabled={isOtherReason}
            value={orderCancel.cancelReasonId}
            onChange={(event, newValue) => {
              setOrderCancel({
                ...orderCancel,
                cancelReasonId: newValue,
                otherReason: '',
              });
            }}
            getOptionLabel={(option) => (option.name ? option.name : '')}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            inputValue={deliverySearchKey}
            onInputChange={(event, newInputValue) => {
              setDeliverySearchKey(newInputValue);
            }}
            id="controllable-states-demo"
            options={getCancelReasonsQuery?.data?.data?.cancelReason || []}
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a reject reason"
                value={orderCancel.cancelReasonId}
                required={!isOtherReason}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option?._id}>
                {option?.name}
              </Box>
            )}
          />

          <Box className="mt-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOtherReason}
                  onChange={(e) => setIsOtherReason(e.target.checked)}
                  name="otherReason"
                />
              }
              label="Send other reason"
            />
          </Box>
          {isOtherReason && (
            <Box className="mt-2">
              <TextField
                type="text"
                multiline
                className="form-control"
                placeholder="Type other reason"
                maxRows={4}
                required={isOtherReason}
                label="Other reason"
                value={orderCancel.otherReason}
                onChange={(e) =>
                  setOrderCancel({
                    ...orderCancel,
                    otherReason: e.target.value,
                    cancelReason: null,
                  })
                }
              />
            </Box>
          )}
          <FormControl className="py-3">
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={orderCancel?.refundType}
              onChange={(e) => {
                updateRefundType(e.target.value);
              }}
              required
            >
              {orderCancel?.paymentMethod !== 'cash' && (
                <>
                  <FormControlLabel value="full" control={<Radio />} label="Full Refund" />
                  {((orderCancel?.orderFor === 'specific' &&
                    orderCancel?.orderActivity?.length > 1 &&
                    orderCancel?.cartType !== 'group') ||
                    (orderCancel?.orderFor === 'global' && orderCancel?.orderActivity?.length > 2)) &&
                    orderCancel?.cartType !== 'group' && (
                      <FormControlLabel value="partial" control={<Radio />} label="Partial Refund" />
                    )}
                  <FormControlLabel value="none" control={<Radio />} label="No Refund" />
                </>
              )}
            </RadioGroup>
          </FormControl>

          {orderCancel?.refundType === 'partial' && (
            <Box>
              <StyledFormField
                label={
                  <TitleWithToolTip
                    title={`Lyxa Order Refund : ${
                      orderPayment?.adminOrderProfit < 0 ? 0 : orderPayment?.adminOrderProfit
                    }`}
                    tooltip="Lyxa Order Earning"
                  />
                }
                intputType="text"
                containerProps={{
                  sx: {
                    padding: '14px 0px 23px 0',
                    flex: '1',
                  },
                }}
                inputProps={{
                  value: orderCancel?.partialPayment?.adminOrderProfit,
                  min: 0,
                  type: 'number',
                  name: 'adminOrderProfit',
                  placeholder: 'Enter Admin Amount',
                  onChange: updateRefundAmount,
                }}
              />
              <StyledFormField
                label={
                  <TitleWithToolTip
                    title={`Lyxa Delivery Refund : ${
                      orderPayment?.adminRiderProfit < 0 ? 0 : orderPayment?.adminRiderProfit
                    }`}
                    tooltip="Lyxa Order Earning"
                  />
                }
                intputType="text"
                containerProps={{
                  sx: {
                    padding: '14px 0px 23px 0',
                    flex: '1',
                  },
                }}
                inputProps={{
                  value: orderCancel?.partialPayment?.adminRiderProfit,
                  min: 0,
                  type: 'number',
                  name: 'adminRiderProfit',
                  placeholder: 'Enter Admin Amount',
                  onChange: updateRefundAmount,
                }}
              />

              {orderCancel?.shop?._id && (
                <Box className="refund_item_wrapper">
                  <StyledFormField
                    label={
                      <TitleWithToolTip
                        title={`Shop Refund: ${
                          orderPayment?.adminOrderProfit < 0
                            ? orderPayment?.shop +
                              orderCancel?.vatAmount?.baseCurrency_vatForShop +
                              orderPayment?.adminOrderProfit
                            : orderPayment?.shop + orderCancel?.vatAmount?.baseCurrency_vatForShop
                        }`}
                        tooltip="Shop Earning+VAT"
                      />
                    }
                    intputType="text"
                    containerProps={{
                      sx: {
                        padding: '14px 0px 23px 0',
                        flex: '1',
                      },
                    }}
                    inputProps={{
                      value: orderCancel?.partialPayment?.shop,
                      type: 'number',
                      min: 0,
                      name: 'shop',
                      placeholder: 'Enter Shop Amount',
                      onChange: updateRefundAmount,
                    }}
                  />
                </Box>
              )}

              {orderCancel?.orderFor === 'global' && (
                <Box className="refund_item_wrapper">
                  <StyledFormField
                    label={<span>Delivery boy Earning: {orderPayment?.deliveryBoy}</span>}
                    intputType="text"
                    containerProps={{
                      sx: {
                        padding: '14px 0px 23px 0',
                        flex: '1',
                      },
                    }}
                    inputProps={{
                      value: orderCancel?.partialPayment?.deliveryBoy,
                      type: 'number',
                      min: 0,
                      max: orderPayment?.deliveryBoy,
                      name: 'deliveryBoy',
                      placeholder: 'Enter Delivery Amount',
                      onChange: updateRefundAmount,
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          <h5>
            <TitleWithToolTip
              title={`Total Refund Amount:
        ${
          orderCancel.refundType === 'full'
            ? total_base || 0
            : calculateTotalRefundedAmount(
                Number(orderCancel?.partialPayment?.deliveryBoy),
                Number(orderCancel?.partialPayment?.adminOrderProfit) +
                  Number(orderCancel?.partialPayment?.adminRiderProfit),
                Number(orderCancel?.partialPayment?.shop),
                getRefundedVatForAdmin(
                  orderCancel?.vatAmount?.baseCurrency_vatForAdmin,
                  orderCancel?.partialPayment?.adminOrderProfit +
                    orderCancel?.partialPayment?.adminRiderProfit +
                    orderCancel?.partialPayment?.deliveryBoy,
                  appVat,
                ),
              ) || 0
        }`}
              tooltip="Lyxa Earning+Lyxa Vat+Shop Earning+Shop VAT+Delivery Boy Earning"
            />
          </h5>

          {getRefundedVatForAdmin(
            orderCancel?.vatAmount?.baseCurrency_vatForAdmin,
            orderCancel?.partialPayment?.adminOrderProfit +
              orderCancel?.partialPayment?.adminRiderProfit +
              orderCancel?.partialPayment?.deliveryBoy,
            appVat,
          ) > 0 &&
            orderCancel.refundType !== 'full' &&
            orderPayment?.adminRiderProfit + orderPayment?.adminOrderProfit > 0 && (
              <Typography variant="body1" fontWeight={600}>
                Admin VAT Refunded:{' '}
                {getRefundedVatForAdmin(
                  orderCancel?.vatAmount?.baseCurrency_vatForAdmin,
                  orderCancel?.partialPayment?.adminOrderProfit +
                    orderCancel?.partialPayment?.adminRiderProfit +
                    orderCancel?.partialPayment?.deliveryBoy,
                  appVat,
                )}
              </Typography>
            )}

          <Box className="d-flex justify-content-center my-3 pt-3">
            <Button
              fullWidth
              variant="contained"
              className="px-4"
              type="submit"
              disabled={cancelOrderByAdminMutation?.isLoading || cancelOrderForButlarMutation?.isLoading}
            >
              Confirm
            </Button>
          </Box>
        </Form>
      </Box>
    </Paper>
  );
}

export default OrderCancel;
