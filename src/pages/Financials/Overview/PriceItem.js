import { Stack, Typography } from '@mui/material';

export default function PriceItem({ title, amount, amountStatus }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body1" fontWeight={600} color={amountStatus === 'minus' ? 'error' : undefined}>
        {amount}
      </Typography>
    </Stack>
  );
}
