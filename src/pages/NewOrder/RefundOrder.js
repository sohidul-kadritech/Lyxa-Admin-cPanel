import { Box, Button, FormControl, FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography } from '@mui/material';
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
  calculateTotalRefund,
  generateRefundAfterDeliveredData,
  getAdminRefundedAmount,
  getRefundedVatForAdmin,
  orderCancelDataFormation,
  returnNewValue,
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
  console.log('order payment: ', {
    shop: currentOrder?.sellerEarnings,
    deliveryBoy: currentOrder?.deliveryBoyFee,
    admin: currentOrder?.dropCharge?.totalDropAmount,
  });
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

function RefundOrder({ setOpenRefundModal, onClose, currentOrder }) {
  const [appVat, setAppVat] = useState(0);
  const [orderCancel, setOrderCancel] = useState(
    // eslint-disable-next-line no-use-before-define, prettier/prettier
    orderCancelDataFormation('refund_order', currentOrder, cancelOrderInit),
  );
  // eslint-disable-next-line no-unused-vars
  const [orderPayment, setOrderPayment] = useState(getOrderPayment(currentOrder));

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

  const refundOrderMutation = useMutation((data) => AXIOS.post(Api.REFUND_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(Api.ORDER_LIST);
        setOpenRefundModal(false);
      } else {
        successMsg(data.message, 'warn');
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

  const submitOrderRefund = (e) => {
    e.preventDefault();

    const {
      partialPayment: { admin, shop },
    } = orderCancel;

    if (orderCancel.refundType === 'partial' && !shop && !admin) {
      successMsg('Enter Minimum One Partial Amount');
      return;
    }

    const data = {
      ...orderCancel,
      cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
    };

    delete data.deliveryBoy;
    // console.log('data-->', generateRefundAfterDeliveredData(orderCancel, orderPayment, props?.appVat));
    refundOrderMutation.mutate(generateRefundAfterDeliveredData(orderCancel, orderPayment, appVat));
  };

  return (
    <Paper
      sx={{
        minWidth: 'max(35vw, 450px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Box padding={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h3">Refund Order</Typography>
          <CloseButton
            onClick={() => {
              onClose();
            }}
          />
        </Stack>
        <Form onSubmit={submitOrderRefund}>
          <FormControl className="py-3">
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={orderCancel?.refundType}
              onChange={(e) => updateRefundType(e.target.value)}
              required
            >
              <>
                <FormControlLabel value="full" control={<Radio />} label="Full Refund" />
                {orderCancel?.deliveryBoy?._id && orderCancel?.cartType !== 'group' && (
                  <FormControlLabel value="partial" control={<Radio />} label="Partial Refund" />
                )}
              </>
            </RadioGroup>
          </FormControl>
          {orderCancel?.refundType === 'partial' && (
            <Box>
              <StyledFormField
                label={
                  <TitleWithToolTip
                    title={`Lyxa Refund: ${
                      orderPayment?.admin < 0
                        ? returnNewValue(orderPayment?.deliveryBoy).toFixed(2) || 0
                        : // eslint-disable-next-line no-unsafe-optional-chaining
                          (orderPayment?.admin + orderPayment?.deliveryBoy).toFixed(2)
                    }`}
                    tooltip="Lyxa Earning+Rider Earning"
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
                          orderPayment?.admin < 0
                            ? calculateTotalRefund([
                                orderPayment?.shop,
                                orderCancel?.vatAmount?.vatForShop,
                                orderPayment?.admin,
                              ]).toFixed(2)
                            : calculateTotalRefund([orderPayment?.shop, orderCancel?.vatAmount?.vatForShop]).toFixed(2)
                        }`}
                        tooltip="Shop Earning+Shop VAT"
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
            </Box>
          )}
          {orderCancel.refundType !== 'none' && (
            <>
              <h5>
                <TitleWithToolTip
                  title={`Total Refund Amount:
                ${
                  orderCancel.refundType === 'none'
                    ? calculateTotalRefund([], 'none')
                    : orderCancel.refundType === 'full'
                    ? calculateTotalRefund(
                        [
                          Number(orderCancel?.summary?.cash),
                          Number(orderCancel?.summary?.wallet),
                          Number(orderCancel?.summary?.card),
                        ],
                        // eslint-disable-next-line prettier/prettier
                        'full',
                      )
                    : calculateTotalRefund(
                        [
                          Number(orderCancel?.partialPayment?.admin),
                          Number(orderCancel?.partialPayment?.shop),
                          getRefundedVatForAdmin(
                            orderCancel?.vatAmount?.vatForAdmin,
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                            // eslint-disable-next-line prettier/prettier
                            appVat,
                          ),
                        ],
                        // eslint-disable-next-line prettier/prettier
                        'partial',
                      )
                }`}
                  tooltip="Lyxa Earning+Lyxa VAT+Shop Earning+Shop VAT+Rider Earning+Rider VAT"
                />
              </h5>
              {getRefundedVatForAdmin(
                orderCancel?.vatAmount?.vatForAdmin,
                // eslint-disable-next-line no-unsafe-optional-chaining
                orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                // eslint-disable-next-line prettier/prettier
                appVat,
              ) > 0 &&
                orderCancel.refundType !== 'full' && (
                  <Typography variant="body1" fontWeight={600}>
                    Admin VAT Refunded:{' '}
                    {getRefundedVatForAdmin(
                      orderCancel?.vatAmount?.vatForAdmin,
                      // eslint-disable-next-line no-unsafe-optional-chaining
                      orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                      // eslint-disable-next-line prettier/prettier
                      appVat,
                    ).toFixed(2)}
                  </Typography>
                )}
            </>
          )}

          <Box className="d-flex justify-content-center my-3 pt-3">
            <Button
              fullWidth
              variant="contained"
              className="px-4"
              type="submit"
              disabled={refundOrderMutation?.isLoading}
            >
              Confirm
            </Button>
          </Box>
        </Form>
      </Box>
    </Paper>
  );
}

export default RefundOrder;
