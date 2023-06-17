import { Stack } from '@mui/material';
import { useState } from 'react';
import CallUser from './CallUser';
import CancelReason from './CancelReason';
import DeliveryDetails from './DeliveryDetails';
import OrderIssues from './OrderIssues';
import OrderReward from './OrderReward';
import OrderTimeline from './OrderTimeline';
import PaymentDetails from './PaymentDetails';
import PaymentMethod from './PaymentMethod';
import ResolveOrderFlag from './ResolveFlag';
import OrderSummary from './Summary';

export default function Detail({ order, hideIssues, userType }) {
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  return (
    <Stack gap={5}>
      {order?.flag?.length && !hideIssues ? <OrderIssues flags={order?.flag} /> : null}
      <OrderTimeline order={order} />
      {order.orderStatus === 'cancelled' && <CancelReason cancelReason={order?.orderCancel} />}
      <DeliveryDetails deliveryDetails={order?.dropOffLocation} pickUpLocation={order?.pickUpLocation} />
      {order?.orderFor === 'global' && order?.deliveryBoy && (
        <CallUser
          user={{
            name: order?.deliveryBoy?.name,
            image: order?.deliveryBoy?.image,
            secondary: order?.orderStatus === 'delivered' ? 'Delivered' : 'Delivering',
            vehicleNumber: order?.deliveryBoy?.vehicleNumber,
            number: order?.deliveryBoy?.number,
          }}
        />
      )}
      <CallUser
        user={{
          name: order?.shop?.shopName,
          image: order?.shop?.shopLogo,
          number: order?.shop?.phone_number,
        }}
      />
      <OrderSummary productsDetails={order?.productsDetails} />
      <PaymentMethod method={order?.paymentMethod} />
      {order?.rewardPoints > 0 && userType === 'admin' ? <OrderReward points={order?.rewardPoints} /> : null}
      <PaymentDetails order={order} />
      <ResolveOrderFlag order={order} setRender={setRender} />
    </Stack>
  );
}
