import { Stack, Typography } from '@mui/material';
import { useGlobalContext } from '../../../context';

export default function PriceItem({ title, amount, amountStatus }) {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const { general } = useGlobalContext();
  const currency = general?.currency?.code?.toUpperCase();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body1" fontWeight={600} color={amountStatus === 'minus' ? 'error' : undefined}>
        {amountStatus === 'minus' ? '-' : ''} {currency} {(amount || 0).toFixed(2)}
      </Typography>
    </Stack>
  );
}
