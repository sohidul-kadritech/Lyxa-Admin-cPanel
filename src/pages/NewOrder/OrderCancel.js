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
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import {
  TitleWithToolTip,
  calculateTotalRefundedAmount,
  getAdminRefundedAmount,
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
      deliveryBoy: currentOrder?.deliveryBoyFee,
      admin: currentOrder?.dropCharge,
    };
  }
  return {
    shop: currentOrder?.sellerEarnings,
    deliveryBoy: currentOrder?.deliveryBoyFee,
    admin: currentOrder?.dropCharge?.totalDropAmount,
  };
};

function OrderCancel({ setOpenCancelModal, currentOrder, onSuccess, refetchApiKey = Api.ORDER_LIST }) {
  const [orderCancel, setOrderCancel] = useState(
    // eslint-disable-next-line prettier/prettier
    orderCancelDataFormation('cancel_order', currentOrder, cancelOrderInit)
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
  const getCancelReasonsQuery = useQuery([Api.ALL_ORDER_CANCEL_REASON], () => AXIOS.get(Api.ALL_ORDER_CANCEL_REASON));

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

  const cancelOrderByAdminMutation = useMutation((data) => AXIOS.post(Api.CANCEL_ORDER, data), {
    onSuccess: (data) => {
      console.log('data response: ', data);
      if (data.success) {
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
    const { admin, deliveryBoy, shop } = oldOrderPayment;
    const forShop =
      admin < 0
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          shop + orderCancel.vatAmount.vatForShop + deliveryBoy
        : shop + orderCancel.vatAmount.vatForShop;

    // const forAdmin = orderPayment?.admin < 0 ? 0 : admin + deliveryBoy;
    const forAdmin = getAdminRefundedAmount(admin, deliveryBoy, currentOrder?.orderStatus);

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

    if (name === 'admin' && Number(value) > forAdmin) {
      setOrderCancel({
        ...orderCancel,
        partialPayment: {
          ...orderCancel?.partialPayment,
          [name]: Number(forAdmin),
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

  // CANCEL ORDER
  const submitOrderCancel = (e) => {
    e.preventDefault();

    const {
      partialPayment: { deliveryBoy, admin, shop },
    } = orderCancel;

    if (currentOrder?.isButler) {
      if (orderCancel.refundType === 'partial' && !deliveryBoy && !admin) {
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
          admin: orderCancel?.partialPayment?.admin ? orderCancel?.partialPayment?.admin : 0,
          adminVat: getRefundedVatForAdmin(
            orderCancel?.vatAmount?.vatForAdmin,
            // eslint-disable-next-line no-unsafe-optional-chaining
            orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
            // eslint-disable-next-line prettier/prettier
            appVat
            // eslint-disable-next-line prettier/prettier
          ),
        },
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      delete data.deliveryBoy;

      cancelOrderForButlarMutation.mutate(data);
    } else {
      if (orderCancel.refundType === 'partial' && !shop && !deliveryBoy && !admin) {
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
                admin: orderCancel?.partialPayment?.admin ? orderCancel?.partialPayment?.admin : 0,
                adminVat: getRefundedVatForAdmin(
                  orderCancel?.vatAmount?.vatForAdmin,
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                  // eslint-disable-next-line prettier/prettier
                  appVat
                  // eslint-disable-next-line prettier/prettier
                ),
              }
            : {},
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };
      cancelOrderByAdminMutation.mutate(data);
    }
  };

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
          <Typography variant="h3">Cancel Order</Typography>
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
                label="Select a cancel reason"
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
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    title={`Lyxa Refund: ${orderPayment?.admin < 0 ? 0 : orderPayment?.admin}`}
                    tooltip="Lyxa Earning"
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
                  value: orderCancel?.partialPayment?.admin,
                  min: 0,
                  type: 'number',
                  name: 'admin',
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
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          orderPayment?.admin < 0
                            ? // eslint-disable-next-line no-unsafe-optional-chaining
                              orderPayment?.shop +
                              // eslint-disable-next-line no-unsafe-optional-chaining
                              orderCancel?.vatAmount?.vatForShop +
                              // eslint-disable-next-line no-unsafe-optional-chaining
                              orderPayment?.admin
                            : // eslint-disable-next-line no-unsafe-optional-chaining
                              orderPayment?.shop + orderCancel?.vatAmount?.vatForShop
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
            ? Number(orderCancel?.summary?.cash) +
                Number(orderCancel?.summary?.wallet) +
                Number(orderCancel?.summary?.card) || 0
            : calculateTotalRefundedAmount(
                Number(orderCancel?.partialPayment?.deliveryBoy),
                Number(orderCancel?.partialPayment?.admin),
                Number(orderCancel?.partialPayment?.shop),
                getRefundedVatForAdmin(
                  orderCancel?.vatAmount?.vatForAdmin,
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                  // eslint-disable-next-line prettier/prettier
                  appVat
                  // eslint-disable-next-line prettier/prettier
                )
              ) || 0
        }`}
              tooltip="Lyxa Earning+Lyxa Vat+Shop Earning+Shop VAT+Delivery Boy Earning"
            />
          </h5>

          {getRefundedVatForAdmin(
            orderCancel?.vatAmount?.vatForAdmin,
            // eslint-disable-next-line no-unsafe-optional-chaining
            orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
            // eslint-disable-next-line prettier/prettier
            appVat
          ) > 0 &&
            orderCancel.refundType !== 'full' &&
            orderPayment?.admin > 0 && (
              <Typography variant="body1" fontWeight={600}>
                Admin VAT Refunded:{' '}
                {getRefundedVatForAdmin(
                  orderCancel?.vatAmount?.vatForAdmin,
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                  // eslint-disable-next-line prettier/prettier
                  appVat
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
