import { Stack, Typography } from '@mui/material';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';

export default function Rating({ amount, status }) {
  return (
    <Stack direction="row" alignItems="center" gap="2px" color={status === 'positive' ? 'success.main' : 'error.main'}>
      <StarIcon style={{ color: 'inherit' }} />
      <Typography variant="body4" color="inherit">
        {amount}
      </Typography>
    </Stack>
  );
}
