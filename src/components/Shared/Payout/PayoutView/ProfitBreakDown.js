import { Box, Stack, Typography } from '@mui/material';
import { RiderProfitBreakDown } from './RiderProfitBreakDown';
import { ShopProfitBreakdown } from './ShopProfitBreakdown';

export function ProfitBreakDown({ currentPayout, currency, secondaryCurrency }) {
  return (
    <Stack>
      <Box mb={52 / 4} mt={56 / 4}>
        <Typography variant="body2">You will be automatically charged for any amount due.</Typography>
      </Box>

      {currentPayout?.type === 'Rider' ? (
        <RiderProfitBreakDown currentPayout={currentPayout} currency={currency} />
      ) : (
        <ShopProfitBreakdown currentPayout={currentPayout} secondaryCurrency={secondaryCurrency} currency={currency} />
      )}
    </Stack>
  );
}
