/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import OrderDetail from '../OrderDetail';
import OrderContextProvider from '../OrderDetail/OrderContext';
import ModalContainer from './ModalContainer';

import socketServices from '../../../common/socketService';
import ConfirmModal from '../../Common/ConfirmModal';
import CancelOrder from './CancelOrder';
import { validateCancelData } from './CancelOrder/helpers';
import RefundOrder from './Refund';
import { validateFlagData } from './helpers';

export const initialDataForFlagg = (order) => {
  const flaggData = {
    orderId: order?._id,
    comment: '',
    user: order?.user?._id,
    shop: '',
    delivery: '',
    deliveryType: '',
    flaggedReason: '', // "missing-item" || "wrong-item" || "others"
    otherReason: '',
    replacement: '', // "with" || "without"
    refund: '', // "with" || "without"
    logUser: '',
    refundType: '',
    refundPercentage: '',
    partialPayment: {
      shop: '',
      adminOrderRefund: '',
      adminDeliveryRefund: '',
      adminVat: '',
    },
    selectedItems: [],
    totalSelectedAmount: 0,
    deliveryfee: 0,
    replacementOrderCut: {
      baseCurrency_shopCutForReplacement: '',
      secondaryCurrency_shopCutForReplacement: '',
      baseCurrency_adminCutForReplacement: '',
      secondaryCurrency_adminCutForReplacement: '',
    },
    byPercentage: {},
  };

  return flaggData;
};

export const initialDataForCancelOrder = (order) => {
  const cancelData = {
    orderId: order?._id,
    logUser: '', // all, rider, shop
    cancelReason: '',
    otherReason: '',
    isEndorseLoss: '', // true, false
    endorseLoss: {
      baseCurrency_shopLoss: 0,
      secondaryCurrency_shopLoss: 0,
      baseCurrency_adminLoss: 0,
      secondaryCurrency_adminLoss: 0,
    },
    selectedItems: [],
    totalSelectedAmount: 0,
    byPercentage: {},
  };

  return cancelData;
};

export const getApi = (flagData) => {
  const api = {
    flagApi: API_URL.SEND_ORDER_FLAG,
    refundApi: API_URL.REFUND_ORDER,
    placeOrderApi: API_URL.ADMIN_PLACE_ORDER,
  };

  if (flagData?.replacement === 'without' && flagData?.refund === 'without') {
    return api?.flagApi;
  }

  if (flagData?.replacement === 'without' && flagData?.refund === 'with') {
    return api?.refundApi;
  }

  return api?.placeOrderApi;
};

function FlaggedModal({ onClose, order, showFor = 'flagged', refetchApiKey, onSuccess }) {
  const theme = useTheme();
  const [flaggData, setFlaggData] = useState(initialDataForFlagg(order));
  const [cancelOrderData, setCancelOrderData] = useState(initialDataForCancelOrder(order));
  const { general } = useGlobalContext();
  const [open, setOpen] = useState(false);

  const { appSetting } = general;

  const queryClient = useQueryClient();

  const flaggedQueryMutation = useMutation((data) => AXIOS.post(data?.api, data?.payload), {
    onSuccess: (data) => {
      if (data.status) {
        if (onSuccess) onSuccess(data);
        successMsg(data?.message, 'success');
        queryClient.invalidateQueries(API_URL.ORDER_LIST);
        queryClient.invalidateQueries(API_URL.URGENT_ORDER_COUNT);
        queryClient.invalidateQueries(API_URL.LATE_ORDER_COUNT);
        queryClient.invalidateQueries(refetchApiKey);
        onClose();
        setOpen(false);
      } else {
        successMsg(data?.message, 'error');
      }
    },
  });

  const cancelOrderQueryMutation = useMutation(
    (data) =>
      AXIOS.post(data?.api, data?.payload, {
        params: {
          ...data?.params,
        },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          successMsg(data?.message, 'success');

          if (onSuccess) onSuccess(data);

          const order = data?.data?.order;

          queryClient.invalidateQueries(API_URL.ORDER_LIST);

          queryClient.invalidateQueries(API_URL.URGENT_ORDER_COUNT);

          queryClient.invalidateQueries(API_URL.LATE_ORDER_COUNT);

          queryClient.invalidateQueries(refetchApiKey);

          socketServices?.emit('updateOrder', {
            orderId: order?._id,
          });

          onClose();
          setOpen(false);
        } else {
          successMsg(data?.message, 'error');
        }
      },
    },
  );

  const onSubmitFlag = (openConfirm) => {
    const validatedData = validateFlagData(order, flaggData, appSetting?.vat);

    console.log('validation', validatedData, getApi(flaggData));

    if (validatedData?.status === true) {
      if (openConfirm) {
        setOpen(true);
      } else
        flaggedQueryMutation.mutate({
          api: getApi(flaggData),
          payload: validatedData?.data,
        });
    }
  };

  const onSubmitCancelOrder = (openConfirm) => {
    const validatedData = validateCancelData(order, cancelOrderData);
    const api = order?.isButler ? API_URL.BUTLER_CANCEL_ORDER : API_URL.CANCEL_ORDER;
    const params = order?.isButler ? {} : { userType: 'admin' };

    if (validatedData?.status === true) {
      if (openConfirm) {
        setOpen(true);
      } else cancelOrderQueryMutation.mutate({ api, payload: validatedData?.data, params });
    }
  };

  const value = useMemo(
    () => ({
      baseCurrency: order?.baseCurrency?.symbol,
      secondaryCurrency: order?.secondaryCurrency?.code,
      shopExchangeRate: order?.shopExchangeRate,
      adminExchangeRate: order?.adminExchangeRate,
    }),
    [],
  );

  const onSubmitHandler = (openConfirm) => {
    if (showFor === 'flagged') {
      onSubmitFlag(openConfirm);
      return;
    }
    onSubmitCancelOrder(openConfirm);
  };

  return (
    <OrderContextProvider value={value}>
      <ModalContainer onClose={onClose}>
        <Stack flexDirection="row" justifyContent="space-between" alignContent="center">
          {/* Left side here */}
          <Box
            sx={{
              width: '65.83%',
              paddingRight: '10px',
              maxHeight: '80vh',
              borderRight: `1px solid ${theme.palette.custom.border}`,
              overflow: 'auto',
            }}
          >
            <Box sx={{ padding: '20px 0px 20px 20px' }}>
              <Stack>
                <Typography
                  sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '24px', color: theme.palette.text.primary }}
                >
                  {showFor === 'flagged' ? 'Flagged' : 'Cancel Order'}
                </Typography>
                <Stack>
                  {showFor === 'flagged' ? (
                    <RefundOrder flaggData={flaggData} setFlaggData={setFlaggData} order={order} />
                  ) : (
                    <CancelOrder
                      setCancelOrderData={setCancelOrderData}
                      cancelOrderData={cancelOrderData}
                      order={order}
                    />
                  )}
                </Stack>

                <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={10 / 4} py={5}>
                  <Button variant="outlined" color="primary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={flaggedQueryMutation?.isLoading || cancelOrderQueryMutation?.isLoading}
                    onClick={() => {
                      // setOpen(true);
                      onSubmitHandler(true);
                    }}
                  >
                    {flaggData?.replacement === 'with' ? 'Place Order' : 'Done'}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
          {/* Right side here */}
          <OrderDetail
            order={order}
            onClose={onClose}
            stickySx={{
              padding: '20px 0px 25px 0px',
            }}
            sx={{ padding: '0px 20px 25px 5px', width: '33.33%', maxHeight: `80vh`, overflow: 'auto' }}
          />
        </Stack>

        <ConfirmModal
          message="Proceed with this operation?"
          isOpen={open}
          loading={flaggedQueryMutation?.isLoading || cancelOrderQueryMutation?.isLoading}
          onCancel={() => {
            setOpen(false);
          }}
          onConfirm={() => {
            onSubmitHandler(false);
          }}
        />
      </ModalContainer>
    </OrderContextProvider>
  );
}

export default FlaggedModal;
