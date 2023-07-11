import { Button, Stack } from '@mui/material';
import CallUser from '../OrderDetail/Details/CallUser';
import DeliveryDetails from '../OrderDetail/Details/DeliveryDetails';
import OrderTimeline from '../OrderDetail/Details/OrderTimeline';
import PaymentDetails from '../OrderDetail/Details/PaymentDetails';
import PaymentMethod from '../OrderDetail/Details/PaymentMethod';
import OrderSummary from '../OrderDetail/Details/Summary';

export default function ChatOrderDetail({ order }) {
  console.log({ order });

  return (
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
      <OrderSummary productsDetails={order?.productsDetails} />
      <PaymentMethod method={order?.paymentMethod} />
      <PaymentDetails order={order} /> {/* note */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          marginTop: '14px',
        }}
      >
        Resolve Ticket
      </Button>
    </Stack>
  );
}
