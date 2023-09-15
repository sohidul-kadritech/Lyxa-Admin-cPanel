import { Stack } from '@mui/material';
import { InfoCardForPayout } from './InfoCardForPayout';

export function RiderProfitBreakDown({ currentPayout, currency }) {
  const profitBreakdown = currentPayout?.info.profitBreakdown;
  return (
    <Stack>
      <InfoCardForPayout
        title="Total Delivery Fee"
        value={`${currency} ${Math.round(profitBreakdown?.totalDeliveryFee)}`}
      />
      <InfoCardForPayout
        title="Lyxa Delivery Cut"
        isNegative
        value={`${currency} ${Math.round(profitBreakdown?.adminDeliveryProfit)}`}
      />

      <InfoCardForPayout title="Rider Tips" value={`${currency} ${Math.round(profitBreakdown?.riderTips)}`} />

      <InfoCardForPayout
        title="Rider Add/Remove credit"
        value={`${currency} ${Math.round(Math.abs(profitBreakdown?.riderAddRemoveCredit || 0))}`}
        isNegative={profitBreakdown?.riderAddRemoveCredit < 0}
      />

      <InfoCardForPayout title="Rider Payout" value={`${currency} ${Math.round(profitBreakdown?.riderPayout)}`} />

      <Stack maxWidth="250px" mt={36 / 4}>
        <InfoCardForPayout
          title={` Total In (${currency})`}
          value={`${currency} ${Math.round(profitBreakdown?.riderPayout)}`}
        />
      </Stack>
    </Stack>
  );
}
