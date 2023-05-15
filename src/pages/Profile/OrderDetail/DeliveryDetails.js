import { Box, Typography } from '@mui/material';
import { ReactComponent as MapIcon } from '../../../assets/icons/map-colored.svg';
import OrderTrackingMap from '../../../components/OrderTrackingMap';
import { StyledOrderDetailBox } from '../helper';

export default function DeliveryDetails({ deliveryDetails = {}, pickUpLocation = {} }) {
  return (
    <StyledOrderDetailBox
      isDropdown={false}
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
    </StyledOrderDetailBox>
  );
}
