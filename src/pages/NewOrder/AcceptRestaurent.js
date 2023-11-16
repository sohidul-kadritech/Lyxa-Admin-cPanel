/* eslint-disable no-unused-vars */
import { Box, Button, Paper, SliderThumb, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import CloseButton from '../../components/Common/CloseButton';
import { getNextStatus } from '../../components/Shared/UpdateOrderStatus/helpers';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import TimeRangeSlider from './TimeRangeSlider';

function AirbnbThumbComponent(props) {
  const { children, value, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <Typography
        sx={{
          fontSize: '12px !important',
          fontWeight: 400,
        }}
      >
        {value || 0}
      </Typography>
    </SliderThumb>
  );
}
function AcceptRestaurent({ onClose, currentOrder, updateStatusMutation }) {
  const { currentUser } = useGlobalContext();

  const { shop } = currentUser;

  console.log({ shop });

  const [time, setTime] = useState(shop?.defaultPreparationTime || 0);

  const acceptOrder = () => {
    const currentStatus = getNextStatus(currentOrder);
    const data = {};
    data.orderId = currentOrder?._id;
    data.orderStatus = 'preparing';
    data.shop = currentOrder?.shop?._id;
    data.time = time;

    if (!currentOrder?._id) {
      successMsg('Order not found');
      return;
    }

    if (!currentOrder?.shop?._id) {
      successMsg('Shop not found');
      return;
    }

    if (!currentStatus) {
      successMsg('Order status missing');
      return;
    }

    updateStatusMutation.mutate({ data });
  };
  return (
    <Paper
      sx={{
        minWidth: 'max(40vw, 400px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
        background: '#fff',
      }}
    >
      <Box sx={{ padding: 5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h3">Confirm Preparation Time</Typography>

          <CloseButton
            onClick={() => {
              onClose();
            }}
          />
        </Stack>
        <Stack>
          <Typography>What is the estimated preparation time for the order?</Typography>
          <Box flex={1} mt={20 / 4}>
            <TimeRangeSlider
              sx={{
                width: '100%',
                padding: '0px !important',
              }}
              value={time}
              slots={{
                thumb: (props) => <AirbnbThumbComponent {...props} value={time} />,
              }}
              valueLabelDisplay="mins"
              valueLabelFormat="mins"
              onChange={(event) => {
                setTime(event.target.value);
              }}
            />
          </Box>
          <Stack direction="row" gap={2.5} justifyContent="flex-end" mt={5}>
            <Button variant="outlined" color="primary" size="small">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={updateStatusMutation?.isLoading}
              onClick={acceptOrder}
            >
              Confirm & Accept Order
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

export default AcceptRestaurent;
