import { Stack, Typography } from '@mui/material';
import { ReactComponent as RewardIcon } from '../../../assets/icons/reward-icon.svg';

export default function OrderReward({ points }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      pt={3}
      pb={3}
      pl={4}
      pr={4}
      bgcolor="rgba(240, 247, 255, 0.8)"
      borderRadius="7px"
    >
      <Typography
        variant="body4"
        color="primary"
        fontWeight={600}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <RewardIcon />
        <span style={{ display: 'inline-block', paddingLeft: '6px' }}>Points Earned</span>
      </Typography>
      <Typography variant="body4" color="primary" fontWeight={600}>
        + {points} pts
      </Typography>
    </Stack>
  );
}
