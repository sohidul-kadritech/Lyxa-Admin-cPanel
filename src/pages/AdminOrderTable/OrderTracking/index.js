import { Box, Grid, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import Detail from '../../../components/Shared/OrderDetail/Details';
import OrderContextProvider from '../../../components/Shared/OrderDetail/OrderContext';
import ModalContainer from '../../ServiceZone/ModalContainer';
import OrderTrackingMap from './OrderTrackingMap';

function OrderTrackingModal({ onClose, currentOrder }) {
  const theme = useTheme();
  console.log('currentOrder', currentOrder);

  const value = useMemo(
    () => ({
      baseCurrency: currentOrder?.baseCurrency?.symbol,
      secondaryCurrency: currentOrder?.secondaryCurrency?.code,
      shopExchangeRate: currentOrder?.shopExchangeRate,
      adminExchangeRate: currentOrder?.adminExchangeRate,
    }),
    []
  );

  return (
    <ModalContainer
      title={`Track Order #${currentOrder?.orderId}`}
      onClose={onClose}
      sx={{
        width: 'calc(100vw - 30px)',
        height: 'calc(100vh - 30px)',
        margin: '30px',
        padding: '36px',
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: '10px',
      }}
    >
      <Grid container rowSpacing={{ xs: 4, lg: 1 }} columnSpacing={{ xs: 2.5, sm: 5 }} height="100%">
        <Grid item xs={12} md={12} lg={9}>
          <Box
            sx={{
              width: '100%',
              height: { lg: '100%', xs: '350px', sm: '450px' },
              overflow: { lg: 'auto', xs: 'hidden' },
            }}
          >
            <OrderTrackingMap
              pickup={currentOrder.pickUpLocation}
              dropoff={currentOrder.dropOffLocation}
              order={currentOrder}
              orderType={currentOrder?.isButler ? 'butler' : currentOrder.orderType}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={3}
          sx={{
            width: '100%',
            overflow: { lg: 'auto', xs: 'hidden' },
            height: { lg: '100%', md: 'auto' },
          }}
        >
          <Box>
            <OrderContextProvider value={value}>
              <Detail order={currentOrder} />
            </OrderContextProvider>
          </Box>
        </Grid>
      </Grid>
    </ModalContainer>
  );
}

export default OrderTrackingModal;
