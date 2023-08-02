import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function ExchangeRate({ order }) {
  const secondaryCurrency = order?.secondaryCurrency?.code;
  const adminExchangeRate = order?.adminExchangeRate;

  const shopExchangeRate = order?.shopExchangeRate;
  const currency = order?.baseCurrency?.symbol;

  return (
    <StyledOrderDetailBox title="Exchange Rate">
      <Box pt={2}>
        <SummaryItem label="Lyxa Rate" value={`${currency} 1 = ${secondaryCurrency} ${adminExchangeRate}`} />
        {!order?.isButler && (
          <SummaryItem label="Shop Rate" value={`${currency} 1 = ${secondaryCurrency} ${shopExchangeRate}`} pb={0} />
        )}
      </Box>
    </StyledOrderDetailBox>
  );
}
