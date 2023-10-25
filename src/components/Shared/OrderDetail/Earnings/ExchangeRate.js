import { Box } from '@mui/material';
import FormatesecondaryCurrency from '../../../Common/FormatesecondaryCurrency';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function ExchangeRate({ order }) {
  const adminExchangeRate = order?.adminExchangeRate;

  const shopExchangeRate = order?.shopExchangeRate;

  const currency = order?.baseCurrency?.symbol;

  return (
    <StyledOrderDetailBox title="Exchange Rate">
      <Box pt={2}>
        <SummaryItem
          label="Lyxa Rate"
          value={`${currency} 1 = ${FormatesecondaryCurrency.get(adminExchangeRate)}`}
          pb={order?.isButler ? 0 : undefined}
        />
        {!order?.isButler && (
          <SummaryItem
            label="Shop Rate"
            value={`${currency} 1 = ${FormatesecondaryCurrency.get(shopExchangeRate)}`}
            pb={0}
          />
        )}
      </Box>
    </StyledOrderDetailBox>
  );
}
