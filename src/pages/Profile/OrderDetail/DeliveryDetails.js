import { Box, Typography } from '@mui/material';
import { ReactComponent as MapIcon } from '../../../assets/icons/map-colored.svg';
// import OrderTrackingMap from '../../../components/OrderTrackingMap';
import { StyledOrderDetailBox2 } from '../helper';
import OrderTrackingMap from './OrderTrackingMap2';

export default function DeliveryDetails({ deliveryDetails = {}, pickUpLocation = {} }) {
  return (
    <StyledOrderDetailBox2
      title={
        <span
          style={{
            display: 'inline-flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          Delivery Details
          <MapIcon />
        </span>
      }
    >
      <Typography variant="body2" color="textPrimary" lineHeight="22px">
        {deliveryDetails.address}
      </Typography>
      <Typography variant="body2" color="textPrimary" lineHeight="22px">
        {deliveryDetails.instructions}
      </Typography>

      <Box sx={{ marginTop: '8px', borderRadius: '7px' }}>
        <OrderTrackingMap pickup={pickUpLocation} dropoff={deliveryDetails} />
      </Box>
    </StyledOrderDetailBox2>
  );
}
