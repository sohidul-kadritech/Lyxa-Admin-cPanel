/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import OrderDetail from '../OrderDetail';
import OrderContextProvider from '../OrderDetail/OrderContext';
import ModalContainer from './ModalContainer';
import RefundOrder from './Refund';
import { validateFlagData } from './helpers';

export const initialDataForFlagg = (order) => {
  const flaggData = {
    orderId: order?._id,
    comment: '',
    user: order?.user?._id,
    shop: '',
    delivery: '',
    flaggedReason: '', // "missing-item" || "wrong-item" || "others"
    otherReason: '',
    replacement: '', // "with" || "without"
    refund: '', // "with" || "without"
    logUser: '',
    refundType: '',
    refundPercentage: '',
    partialPayment: {
      shop: 0,
      adminOrderRefund: 0,
      adminDeliveryRefund: 0,
      adminVat: 0,
    },
    totalSelectedAmount: 0,
  };

  return flaggData;
};

export const getApi = (flagData) => {
  const api = {
    flagApi: API_URL.SEND_ORDER_FLAG,
    refundApi: API_URL.REFUND_ORDER,
  };

  if (flagData?.replacement === 'without' && flagData?.refund === 'without') {
    return api.flagApi;
  }

  if (flagData?.replacement === 'without' && flagData?.refund === 'with') {
    return api.refundApi;
  }

  return '';
};

function FlaggedModal({ onClose, order }) {
  const theme = useTheme();
  const [flaggData, setFlaggData] = useState(initialDataForFlagg(order));

  const queryClient = useQueryClient();

  const flaggedQueryMutation = useMutation((data) => AXIOS.post(data?.api, data?.payload), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data?.message, 'success');
        queryClient.invalidateQueries(API_URL.ORDER_LIST);
        onClose();
      } else {
        successMsg(data?.message, 'error');
      }
    },
  });

  const onSubmitFlag = () => {
    const validatedData = validateFlagData(order, flaggData);
    console.log('flag', validatedData?.data, getApi(flaggData));
    if (validatedData?.status === true) {
      flaggedQueryMutation.mutate({ api: getApi(flaggData), payload: validatedData?.data });
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
                  Flagged
                </Typography>
                <Stack>
                  <RefundOrder flaggData={flaggData} setFlaggData={setFlaggData} order={order} />
                </Stack>

                <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={10 / 4} py={5}>
                  <Button variant="outlined" color="primary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={flaggedQueryMutation?.isLoading}
                    onClick={onSubmitFlag}
                  >
                    Done
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
      </ModalContainer>
    </OrderContextProvider>
  );
}

export default FlaggedModal;
