import { Stack } from '@mui/material';
import OrderAmountDetails from './OrderAmountDetails';
import OrderRefundBeforeDelivered from './OrderRefundBeforeDelivered';
import OrderRefundDetails from './OrderRefundDetails';

export default function Earnings({ userType, order }) {
  return (
    <Stack gap={5}>
      {userType === 'admin' ? <OrderAmountDetails order={order} /> : null}
      {userType === 'admin' && order?.userCancelTnx?.length > 0 ? <OrderRefundBeforeDelivered order={order} /> : null}
      {userType === 'admin' && order?.isRefundedAfterDelivered && order?.userRefundTnx?.length > 0 ? (
        <OrderRefundDetails order={order} />
      ) : null}
    </Stack>
  );
}
