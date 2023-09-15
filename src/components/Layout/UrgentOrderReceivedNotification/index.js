/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CloseButton from '../../Common/CloseButton';
import UrgentOrderDetails from './UrgentOrderDetails';

function UrgentOrderRecieved({ order, onClose }) {
  console.log('order', order);
  const theme = useTheme();

  const [time, setTime] = useState(30);

  const queryClient = useQueryClient();

  useEffect(() => {
    const decrementTime = setInterval(() => {
      if (time > 0) {
        setTime((prev) => prev - 1);
      } else {
        clearInterval(decrementTime);
      }
    }, 1000);

    return () => clearInterval(decrementTime);
  }, [time]);

  const acceptUrgentOrderMutation = useMutation((data) => AXIOS.post(API_URL.ACCEPT_URGENT_ORDER, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data?.message, 'success');
        // queryClient.invalidateQueries(API_URL.GET_PAYOUTS);
        onClose();
      } else {
        successMsg(data?.message, 'warn');
      }
    },
  });

  const onSubmitAcceptHandler = () => {
    if (order?._id) {
      acceptUrgentOrderMutation.mutate({ orderId: order?._id });
    }
  };

  return (
    <Paper
      sx={{
        minWidth: 'max(35vw, 450px)',
        zIndex: '10 !important',
        maxHeight: '90vh',
        overflow: 'auto',
        background: '#fff',
        borderRadius: '12px',
        padding: '20px 25px',
      }}
    >
      <Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack
            direction="row"
            gap="16px"
            alignItems="center"
            sx={{
              position: 'sticky',
              top: '40px',
              background: '#fff',
              zIndex: '999',
            }}
          >
            <Typography variant="h3">Urgent Order</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  border: `1px solid ${theme?.palette?.primary?.main}`,
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6">{time}</Typography>
              </Box>
              <Typography>Sec</Typography>
            </Box>
          </Stack>
          <CloseButton
            onClick={() => {
              if (onClose) onClose();
            }}
          />
        </Stack>

        <UrgentOrderDetails order={order} />

        <Stack direction="row" justifyContent="flex-end" alignItems="center" gap="20px">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={acceptUrgentOrderMutation?.isLoading}
            variant="contained"
            color="primary"
            onClick={onSubmitAcceptHandler}
          >
            Accept
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default UrgentOrderRecieved;
