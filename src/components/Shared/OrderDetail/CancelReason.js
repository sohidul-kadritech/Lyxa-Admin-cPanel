import { Typography } from '@mui/material';
import { StyledOrderDetailBox } from './helpers';

export default function CancelReason({ cancelReason }) {
  return (
    <StyledOrderDetailBox title="Cancel Reason">
      <Typography variant="body2" color="textPrimary" lineHeight="22px" textTransform="capitalize">
        By - <span>{cancelReason?.canceledBy}</span>
      </Typography>
      <Typography variant="body2" color="textPrimary" lineHeight="22px" textTransform="capitalize">
        <span>Reason - </span>
        {cancelReason?.cancelReason?.name || cancelReason?.otherReason}
      </Typography>
    </StyledOrderDetailBox>
  );
}
