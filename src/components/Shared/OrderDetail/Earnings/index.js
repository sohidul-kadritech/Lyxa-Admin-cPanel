import { Stack } from '@mui/material';
import ButlerProfitDetails from './ButlerProfitDetails';
import ExchangeRate from './ExchangeRate';
import ProfitDetails from './ProfitDetails';
import RefundBeforeDelivered from './RefundBeforeDelivered';
import RefundDetails from './RefundDetails';

export default function Earnings({ order }) {
  return (
    <Stack gap={5}>
      {order?.shopExchangeRate !== 0 && <ExchangeRate order={order} />}
      {order?.isButler ? <ButlerProfitDetails order={order} /> : <ProfitDetails order={order} />}
      {order?.userCancelTnx?.length > 0 ? <RefundBeforeDelivered order={order} /> : null}
      {order?.isRefundedAfterDelivered && order?.userRefundTnx?.length > 0 ? <RefundDetails order={order} /> : null}
    </Stack>
  );
}
