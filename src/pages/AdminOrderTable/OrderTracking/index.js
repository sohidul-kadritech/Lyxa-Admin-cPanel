import { Box, Grid, useTheme } from '@mui/material';
import React from 'react';
import Detail from '../../../components/Shared/OrderDetail/Details';
import ModalContainer from '../../ServiceZone/ModalContainer';
import OrderTrackingMap from './OrderTrackingMap';

function OrderTrackingModal({ onClose, currentOrder }) {
  const theme = useTheme();
  console.log('currentOrder', currentOrder);

  return (
    <ModalContainer
      title={`Track Order #${currentOrder?.autoGenId}`}
      onClose={onClose}
      sx={{
        width: '96vw',
        height: '96vh',
        margin: '2vh 2vw',
        padding: '36px',
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: '10px',
      }}
    >
      <Grid container rowSpacing={{ xs: 4, lg: 1 }} columnSpacing={{ xs: 2.5, sm: 5 }}>
        <Grid item xs={12} md={12} lg={8}>
          <Box sx={{ width: '100%', height: { lg: '100%', xs: '350px', sm: '450px' } }}>
            <OrderTrackingMap
              pickup={currentOrder.pickUpLocation}
              dropoff={currentOrder.dropOffLocation}
              order={currentOrder}
              orderType={currentOrder?.isButler ? 'butler' : currentOrder.orderType}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Detail order={currentOrder} />
          </Box>
        </Grid>
      </Grid>
    </ModalContainer>
  );
}

export default OrderTrackingModal;
