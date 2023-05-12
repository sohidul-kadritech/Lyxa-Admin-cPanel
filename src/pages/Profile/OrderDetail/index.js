// third party
import { Avatar, Box, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import moment from 'moment';

// project import
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CloseButton from '../../../components/Common/CloseButton';
import TabPanel from '../../../components/Common/TabPanel';
import DeliveryDetails from './DeliveryDetails';
import OrderReward from './OrderReward';
import OrderTimeline from './OrderTimeline';
import PaymentDetails from './PaymentDetails';
import PaymentMethod from './PaymentMethod';
import Review from './Review';
import Rider from './Rider';
import OrderSummary from './Summary';
import { reviews } from './mock';

export default function OrderDetail({ order, onClose }) {
  const admin = useSelector((store) => store.Login.admin);

  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();
  console.log('Order Details: ', order);
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
              <Avatar
                alt="user-image"
                src={order?.user?.profile_photo}
                sx={{ width: 36, height: 36, textTransform: 'capitalize' }}
              >
                {order?.user?.name[0] || 'A'}
              </Avatar>
              <Stack gap={0.5}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {order?.user?.name}
                </Typography>
                <Typography variant="body4" color="#737373">
                  {order?.products.length || '9'} orders
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
            <Tab label="Order Detail" />
            <Tab label="Review" />
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
            {/* {order?.flag?.length ? <OrderIssues flags={order?.flag} /> : null} */}
            <OrderTimeline orderTimeline={order?.timeline} />
            <DeliveryDetails deliveryDetails={order?.dropOffLocation} pickUpLocation={order?.pickUpLocation} />
            {order?.orderFor === 'global' && order?.deliveryBoy && (
              <Rider rider={order?.deliveryBoy} isDelivered={order?.orderStatus === 'delivered'} />
            )}
            <OrderSummary productsDetails={order?.productsDetails} />
            <PaymentMethod method={order?.paymentMethod} />
            {order?.summary?.reward?.points && admin?.account_type === 'shop' ? (
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
          <Review reviews={reviews} />
        </TabPanel>
      </Box>
    </Box>
  );
}
