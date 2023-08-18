import { Stack } from '@mui/material';
import { useState } from 'react';
import Attachments from './Attachments';
import ButlerOrderSummary from './ButlerOrderSummary';
import CancelReason from './CancelReason';
import CouponDetails from './Coupon';
import DeliveryDetails from './DeliveryDetails';
import GroupOrderSettings from './GroupOrderSettings';
import OrderIssues from './OrderIssues';
import OrderReward from './OrderReward';
import OrderSummary from './OrderSummary';
import OrderTimeline from './OrderTimeline';
import PaymentMethod from './PaymentMethod';
import PaymentSummary from './PaymentSummary';
import ResolveOrderFlag from './ResolveFlag';
import OrderScheduleTimer from './ScheduleTimer';

export default function Detail({ order, hideIssues, userType, hideMoreOptions }) {
  const [, setRender] = useState(false);

  return (
    <Stack gap={5}>
      {order?.orderStatus === 'schedule' && <OrderScheduleTimer order={order} />}
      {order?.flag?.length && !hideIssues ? <OrderIssues flags={order?.flag} /> : null}
      <OrderTimeline order={order} />
      {order?.orderStatus === 'cancelled' && <CancelReason cancelReason={order?.orderCancel} />}
      <DeliveryDetails order={order} />
      {order?.leaveAtDoorImage && <Attachments order={order} />}
      {order?.isButler && <ButlerOrderSummary order={order} />}
      {!order?.isButler && <OrderSummary order={order} />}
      <PaymentMethod method={order?.paymentMethod} />
      {order?.couponDetails && <CouponDetails coupon={order?.couponDetails} />}
      {order?.rewardPoints > 0 && userType === 'admin' ? <OrderReward points={order?.rewardPoints} /> : null}
      {order?.cart?.cartType === 'group' && <GroupOrderSettings order={order} />}
      <PaymentSummary order={order} />
      {order?.flag?.length && !hideMoreOptions ? <ResolveOrderFlag order={order} setRender={setRender} /> : null}
    </Stack>
  );
}
