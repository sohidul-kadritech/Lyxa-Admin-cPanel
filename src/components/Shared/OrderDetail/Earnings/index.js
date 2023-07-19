import { Stack } from '@mui/material';
import AmountDetails from './AmountDetails';
import ButlerAmountDetails from './ButlerAmountDetails';
import RefundBeforeDelivered from './RefundBeforeDelivered';
import RefundDetails from './RefundDetails';

// eslint-disable-next-line no-unused-vars
export default function Earnings({ order }) {
  return (
    <Stack gap={5}>
      {order?.isButler ? <ButlerAmountDetails order={order} /> : <AmountDetails order={order} />}
      {order?.userCancelTnx?.length > 0 ? <RefundBeforeDelivered order={order} /> : null}
      {order?.isRefundedAfterDelivered && order?.userRefundTnx?.length > 0 ? <RefundDetails order={order} /> : null}
    </Stack>
  );
}
