import { Box, useTheme } from '@mui/material';
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
        width: 'calc(100vw - 40px)',
        height: 'calc(100vh - 40px)',
        padding: '24px',
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { md: '1fr', lg: '1fr 400px' },
          height: { lg: '100%', md: 'auto' },
          gap: '20px',
        }}
      >
        <Box
          sx={{
            minHeight: '500px',
          }}
        >
          <OrderTrackingMap
            pickup={currentOrder.pickUpLocation}
            dropoff={currentOrder.dropOffLocation}
            order={currentOrder}
            orderType={currentOrder?.isButler ? 'butler' : currentOrder.orderType}
          />
        </Box>
        <Box
          sx={{
            overflow: 'auto',
          }}
        >
          <OrderContextProvider value={value}>
            <Detail order={currentOrder} />
          </OrderContextProvider>
        </Box>
      </Box>
    </ModalContainer>
  );
}

export default OrderTrackingModal;
