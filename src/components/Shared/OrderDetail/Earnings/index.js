import { Stack } from '@mui/material';
import AmountDetails from './AmountDetails';
import ButlerAmountDetails from './ButlerAmountDetails';
import BeforeDelivered from './RefundBeforeDelivered';
import OrderRefundDetails from './RefundDetails';

export default function Earnings({ order }) {
  return (
    <Stack gap={5}>
      {order?.isButler ? <ButlerAmountDetails order={order} /> : <AmountDetails order={order} />}
      {order?.userCancelTnx?.length > 0 ? <BeforeDelivered order={order} /> : null}
      {order?.isRefundedAfterDelivered && order?.userRefundTnx?.length > 0 ? (
        <OrderRefundDetails order={order} />
      ) : null}
    </Stack>
  );
}
