// third party
import { Avatar, Box, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import moment from 'moment';

// project import
import { useState } from 'react';
import { useGlobalContext } from '../../../context';
import CloseButton from '../../Common/CloseButton';
import TabPanel from '../../Common/TabPanel';
import CallUser from './CallUser';
import CancelReason from './CancelReason';
import DeliveryDetails from './DeliveryDetails';
import OrderAmountDetails from './OrderAmountDetails';
import OrderIssues from './OrderIssues';
import OrderRefundBeforeDelivered from './OrderRefundBeforeDelivered';
import OrderRefundDetails from './OrderRefundDetails';
import OrderReward from './OrderReward';
import OrderTimeline from './OrderTimeline';
import PaymentDetails from './PaymentDetails';
import PaymentMethod from './PaymentMethod';
import Review from './Review';
import OrderSummary from './Summary';

export default function OrderDetail({ order, onClose, hideIssues }) {
  const { currentUser } = useGlobalContext();
  const { userType } = currentUser;

  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();

  console.log(order);

  return (
    <Box
      sx={{
        width: '400px',
        padding: '0px 20px 25px 20px',
      }}
    >
      <Box>
        <Box
          sx={{
            position: 'sticky',
            top: '0',
            background: '#fff',
            padding: '25px 0px',
            zIndex: '999',
          }}
        >
          {/* top */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={3}>
              <Avatar alt="user-image" src={order?.user?.profile_photo} sx={{ width: 36, height: 36 }}>
                {order?.user?.name?.length && order?.user?.name[0]}
              </Avatar>
              <Stack gap={0.5}>
                <Typography variant="body4">{order?.user?.name}</Typography>
                <Typography variant="body4" color="#737373">
                  {order?.user?.orderCompleted || 0} orders
                </Typography>
              </Stack>
            </Stack>
            <CloseButton
              disableRipple
              onClick={onClose}
              sx={{
                color: theme.palette.text.primary,
              }}
            />
          </Stack>
          {/* heading */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" pt={10} pb={6}>
            <Typography variant="h5" fontSize={19} lineHeight="21px" fontWeight={700}>
              Order# {order?.orderId}
            </Typography>
            <Typography
              variant="h5"
              fontSize={12}
              lineHeight="20px"
              sx={{
                flexShrink: 0,
              }}
            >
              {moment(order?.createdAt).format('ddd DD, MMM, YYYY')}
            </Typography>
          </Stack>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
            sx={{
              '& .MuiTab-root': {
                padding: '8px 12px',
                textTransform: 'none',
              },
            }}
          >
            <Tab label="Order Details" />
            <Tab label="Review" />
            {userType === 'admin' && <Tab label="Earning Details" />}
          </Tabs>
        </Box>
        {/* order detail */}
        <TabPanel
          index={0}
          value={currentTab}
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
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
            <OrderSummary productsDetails={order?.productsDetails} />
            <PaymentMethod method={order?.paymentMethod} />
            {order?.summary?.reward?.points && userType === 'admin' ? (
              <OrderReward points={order?.summary?.reward?.points} />
            ) : null}
            <PaymentDetails order={order} />
          </Stack>
        </TabPanel>
        {/* review */}
        <TabPanel
          index={1}
          value={currentTab}
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <Review reviews={order?.reviews} />
        </TabPanel>

        {/* order details */}
        <TabPanel
          index={2}
          value={currentTab}
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <Stack gap={5}>
            {userType === 'admin' ? <OrderAmountDetails order={order} /> : null}
            {userType === 'admin' && order?.userCancelTnx?.length > 0 ? (
              <OrderRefundBeforeDelivered order={order} />
            ) : null}
            {userType === 'admin' && order?.isRefundedAfterDelivered && order?.userRefundTnx?.length > 0 ? (
              <OrderRefundDetails order={order} />
            ) : null}
          </Stack>
        </TabPanel>
      </Box>
    </Box>
  );
}
