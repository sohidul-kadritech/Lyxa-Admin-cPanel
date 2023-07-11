import { Stack } from '@mui/material';
import { useState } from 'react';
import ButlerOrderSummary from './ButlerOrderSummary';
import CancelReason from './CancelReason';
import CouponDetails from './Coupon';
import DeliveryDetails from './DeliveryDetails';
import GroupOrderSettings from './GroupOrderSettings';
import OrderIssues from './OrderIssues';
import OrderReward from './OrderReward';
import OrderSummary from './OrderSummary';
import OrderTimeline from './OrderTimeline';
import PaymentDetails from './PaymentDetails';
import PaymentMethod from './PaymentMethod';
import ResolveOrderFlag from './ResolveFlag';

export default function Detail({ order, hideIssues, userType }) {
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  return (
    <Stack gap={5}>
      {order?.flag?.length && !hideIssues ? <OrderIssues flags={order?.flag} /> : null}
      <OrderTimeline order={order} />
      {order.orderStatus === 'cancelled' && <CancelReason cancelReason={order?.orderCancel} />}
      <DeliveryDetails order={order} />
      {order?.isButler && <ButlerOrderSummary order={order} />}
      {!order?.isButler && <OrderSummary order={order} />}
      <PaymentMethod method={order?.paymentMethod} />
      {order?.couponDetails && <CouponDetails coupon={order?.couponDetails} />}
      {order?.rewardPoints > 0 && userType === 'admin' ? <OrderReward points={order?.rewardPoints} /> : null}
      {order?.cart?.cartType === 'group' && <GroupOrderSettings order={order} />}
      <PaymentDetails order={order} />
      <ResolveOrderFlag order={order} setRender={setRender} />
    </Stack>
  );
}
