import { Typography } from '@mui/material';
import { ReactComponent as MapIcon } from '../../../assets/icons/map-colored.svg';
import { StyledOrderDetailBox } from '../helpers';

export default function DeliveryDetails({ deliveryDetails = {} }) {
  return (
    <StyledOrderDetailBox
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
    </StyledOrderDetailBox>
  );
}
