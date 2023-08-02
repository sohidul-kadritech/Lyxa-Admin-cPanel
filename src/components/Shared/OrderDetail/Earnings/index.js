import { Stack } from '@mui/material';
import ButlerProfitDetails from './ButlerProfitDetails';
import ExchangeRate from './ExchangeRate';
import ProfitDetails from './ProfitDetails';
import RefundBeforeDelivered from './RefundBeforeDelivered';
import RefundDetails from './RefundDetails';

export default function Earnings({ order }) {
  console.log('rate', order?.adminExchangeRate);

  return (
    <Stack gap={5}>
      {order?.adminExchangeRate !== 0 && <ExchangeRate order={order} />}
      {order?.isButler ? <ButlerProfitDetails order={order} /> : <ProfitDetails order={order} />}
      {order?.userCancelTnx?.length > 0 && !order?.isButler ? <RefundBeforeDelivered order={order} /> : null}
      {order?.isRefundedAfterDelivered && order?.userRefundTnx?.length > 0 ? <RefundDetails order={order} /> : null}
    </Stack>
  );
}
