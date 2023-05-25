import { Button, Stack } from '@mui/material';
import CallUser from '../../../components/Shared/OrderDetail/CallUser';
import DeliveryDetails from '../../../components/Shared/OrderDetail/DeliveryDetails';
import OrderTimeline from '../../../components/Shared/OrderDetail/OrderTimeline';
import PaymentDetails from '../../../components/Shared/OrderDetail/PaymentDetails';
import PaymentMethod from '../../../components/Shared/OrderDetail/PaymentMethod';
import OrderSummary from '../../../components/Shared/OrderDetail/Summary';

export default function ChatOrderDetail({ order }) {
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
      <OrderSummary productsDetails={order?.productsDetails} />
      <PaymentMethod method={order?.paymentMethod} />
      <PaymentDetails order={order} /> {/* note */}
      {/* <StyledFormField
        label={
          <span>
            Notes
            <span
              style={{
                color: '#7E8299',
              }}
            >
              {' '}
              (only visible to you)
            </span>
          </span>
        }
        intputType="textarea"
        inputProps={{
          name: 'note',
          multiline: true,
        }}
      /> */}
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
