import { Stack } from '@mui/material';
import { useMemo } from 'react';
import ButlerOrderSummary from '../OrderDetail/Details/ButlerOrderSummary';
import CallUser from '../OrderDetail/Details/CallUser';
import DeliveryDetails from '../OrderDetail/Details/DeliveryDetails';
import OrderSummary from '../OrderDetail/Details/OrderSummary';
import OrderTimeline from '../OrderDetail/Details/OrderTimeline';
import PaymentMethod from '../OrderDetail/Details/PaymentMethod';
import PaymentDetails from '../OrderDetail/Details/PaymentSummary';
import OrderContextProvider from '../OrderDetail/OrderContext';

/*
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
*/

export default function ChatOrderDetail({ order }) {
  const value = useMemo(
    () => ({
      baseCurrency: order?.baseCurrency?.symbol,
      secondaryCurrency: order?.secondaryCurrency?.code,
      shopExchangeRate: order?.shopExchangeRate,
      adminExchangeRate: order?.adminExchangeRate,
    }),
    []
  );

  return (
    <OrderContextProvider value={value}>
      <Stack gap={5} pb={5}>
        <CallUser
          user={{
            name: order?.shop?.shopName,
            phone: order?.shop?.phone_number,
            image: order?.shop?.shopLogo,
          }}
        />
        <OrderTimeline order={order} />
        <DeliveryDetails order={order} />
        {order?.isButler && <ButlerOrderSummary order={order} />}
        {!order?.isButler && <OrderSummary order={order} />}
        <PaymentMethod method={order?.paymentMethod} />
        <PaymentDetails order={order} />
      </Stack>
    </OrderContextProvider>
  );
}
