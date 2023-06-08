import { Stack, Typography } from '@mui/material';
import { useGlobalContext } from '../../../context';

export default function PriceItem({ title, amount, amountStatus, fontSize, titleSx, amountSx }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.code?.toUpperCase();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body1" fontWeight={600} fontSize={fontSize} sx={titleSx}>
        {title}
      </Typography>
      <Typography
        sx={amountSx}
        variant="body1"
        fontWeight={600}
        fontSize={fontSize}
        color={amountStatus === 'minus' ? 'error' : amountStatus === 'secondary' ? '#b9b9b9' : undefined}
      >
        {amountStatus === 'minus' ? '-' : ''} {currency} {(amount || 0).toFixed(2)}
      </Typography>
    </Stack>
  );
}
