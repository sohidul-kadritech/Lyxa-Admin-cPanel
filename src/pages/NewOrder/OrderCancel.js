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
import React from 'react';
import { Form } from 'reactstrap';
import CloseButton from '../../components/Common/CloseButton';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';
import {
  TitleWithToolTip,
  calculateTotalRefundedAmount,
  getAdminRefundedAmount,
  getRefundedVatForAdmin,
} from './helpers';

function OrderCancel({ setOpenCancelModal, orderCancel, setOrderCancel, isOtherReason, ...props }) {
  const updateRefundAmount = (e) => {
    const { name, value } = e.target;
    const oldOrderPayment = props?.orderPayment;
    const { admin, deliveryBoy, shop } = oldOrderPayment;
    const forShop =
      admin < 0
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          shop + orderCancel.vatAmount.vatForShop + deliveryBoy
        : shop + orderCancel.vatAmount.vatForShop;

    // const forAdmin = orderPayment?.admin < 0 ? 0 : admin + deliveryBoy;
    const forAdmin = getAdminRefundedAmount(admin, deliveryBoy, props?.newRefundType);

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

    if (props?.currentOrder?.isButler) {
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
          // eslint-disable-next-line no-unsafe-optional-chaining
          shop: orderCancel?.partialPayment?.shop ? orderCancel?.partialPayment?.shop : 0,
          deliveryBoy: orderCancel?.partialPayment?.deliveryBoy ? orderCancel?.partialPayment?.deliveryBoy : 0,
          admin: orderCancel?.partialPayment?.admin ? orderCancel?.partialPayment?.admin : 0,
          adminVat: getRefundedVatForAdmin(
            orderCancel?.vatAmount?.vatForAdmin,
            // eslint-disable-next-line no-unsafe-optional-chaining
            orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
            // eslint-disable-next-line prettier/prettier
            props?.appVat,
            // eslint-disable-next-line prettier/prettier
          ),
        },
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };

      delete data.deliveryBoy;

      props?.cancelOrderForButlarMutation.mutate(data);
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
                  props?.appVat,
                  // eslint-disable-next-line prettier/prettier
                ),
              }
            : {},
        cancelReasonId: orderCancel?.cancelReasonId?._id ?? '',
      };
      props?.cancelOrderByAdminMutation.mutate(data);
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
            inputValue={props?.deliverySearchKey}
            onInputChange={(event, newInputValue) => {
              props?.setDeliverySearchKey(newInputValue);
            }}
            id="controllable-states-demo"
            options={props?.getCancelReasonsQuery?.data?.data?.cancelReason || []}
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
                  onChange={(e) => props?.setIsOtherReason(e.target.checked)}
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
                props?.updateRefundType(e.target.value);
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
                    title={`Lyxa Refund: ${props?.orderPayment?.admin < 0 ? 0 : props?.orderPayment?.admin}`}
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
                          props?.orderPayment?.admin < 0
                            ? // eslint-disable-next-line no-unsafe-optional-chaining
                              props?.orderPayment?.shop +
                              // eslint-disable-next-line no-unsafe-optional-chaining
                              orderCancel?.vatAmount?.vatForShop +
                              // eslint-disable-next-line no-unsafe-optional-chaining
                              props?.orderPayment?.admin
                            : // eslint-disable-next-line no-unsafe-optional-chaining
                              props?.orderPayment?.shop + orderCancel?.vatAmount?.vatForShop
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
                    label={<span>Delivery boy Earning: {props?.orderPayment?.deliveryBoy}</span>}
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
                      max: props?.orderPayment?.deliveryBoy,
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
                  props?.appVat,
                  // eslint-disable-next-line prettier/prettier
                ),
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
            props?.appVat,
          ) > 0 &&
            orderCancel.refundType !== 'full' &&
            props?.orderPayment?.admin > 0 && (
              <Typography variant="body1" fontWeight={600}>
                Admin VAT Refunded:{' '}
                {getRefundedVatForAdmin(
                  orderCancel?.vatAmount?.vatForAdmin,
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  orderCancel?.partialPayment?.admin + orderCancel?.partialPayment?.deliveryBoy,
                  // eslint-disable-next-line prettier/prettier
                  props?.appVat,
                )}
              </Typography>
            )}

          <Box className="d-flex justify-content-center my-3 pt-3">
            <Button
              fullWidth
              variant="contained"
              className="px-4"
              type="submit"
              disabled={props?.cancelOrderByAdminMutation?.isLoading || props?.cancelOrderForButlarMutation?.isLoading}
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
