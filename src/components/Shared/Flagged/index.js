/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import OrderDetail from '../OrderDetail';
import OrderContextProvider from '../OrderDetail/OrderContext';
import ModalContainer from './ModalContainer';
import RefundOrder from './Refund';

function FlaggedModal({ onClose, order }) {
  const theme = useTheme();
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
                  Flaged
                </Typography>
                <Stack>
                  <RefundOrder />
                </Stack>

                <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={10 / 4} py={5}>
                  <Button variant="outlined" color="primary">
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary">
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
