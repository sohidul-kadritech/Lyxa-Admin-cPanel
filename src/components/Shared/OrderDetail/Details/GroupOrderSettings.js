import { Stack, Typography } from '@mui/material';
import { StyledOrderDetailBox } from '../helpers';

const paymentPreferenceToLabelMap = {
  pay_for_everyone: 'Pay for everyone',
  pay_for_themselves: 'Pay for themselves',
};

function StyledItem({ label, value, ...props }) {
  return (
    <Stack direction="row" alignItems="center" pb={2} justifyContent="space-between" {...props}>
      <Typography variant="inherit" fontSize={15} fontWeight={500}>
        {label}
      </Typography>
      <Typography variant="inherit" fontSize={15}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function GroupOrderSettings({ order }) {
  return (
    <StyledOrderDetailBox title="Group Order Settings">
      <Stack>
        <StyledItem label="Creator" value={order?.cart?.creator?.name} />
        <StyledItem label="Payment Preference" value={paymentPreferenceToLabelMap[order?.cart?.paymentPreferences]} />
        {order?.cart?.paymentPreferences === 'pay_for_everyone' && (
          <StyledItem
            label="Max Amount Per Guest"
            value={order?.cart?.maxAmountPerGuest < 1 ? 'Unlimited' : order?.cart?.maxAmountPerGuest}
            pb={0}
          />
        )}
      </Stack>
    </StyledOrderDetailBox>
  );
}
