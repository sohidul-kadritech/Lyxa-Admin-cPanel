import { Stack, Typography } from '@mui/material';
import { useGlobalContext } from '../../../../context';

export function StyledListItem({ label, isCurrency, value }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.code?.toUpperCase();

  return (
    <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap="10px">
      <Typography variant="body4" color="textPrimary" fontWeight={600} textTransform="capitalize" flexShrink={0}>
        {label}
      </Typography>
      <Typography variant="body4" textTransform="capitalize">
        {isCurrency ? currency : ''} {value}
      </Typography>
    </Stack>
  );
}
