/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Avatar, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import ButlerOrderSummary from '../../Shared/OrderDetail/Details/ButlerOrderSummary';
import DeliveryDetails from '../../Shared/OrderDetail/Details/DeliveryDetails';
import OrderSummary from '../../Shared/OrderDetail/Details/OrderSummary';
import OrderTimeline from '../../Shared/OrderDetail/Details/OrderTimeline';

function UrgentOrderDetails({ order }) {
  return (
    <Stack mt={2.5}>
      <Stack>
        {/* User */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={4}>
          <Stack direction="row" alignItems="center" gap={3}>
            <Avatar alt="user-image" src={order?.user?.profile_photo} sx={{ width: 36, height: 36 }}>
              {order?.user?.name?.length && order?.user?.name?.[0]}
            </Avatar>
            <Stack gap={0.5}>
              <Typography variant="body1" fontWeight={600}>
                {order?.user?.name}
              </Typography>
              <Typography variant="body1" fontWeight={500} color="#737373">
                {order?.user?.orderCompleted || 0} orders
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        {/* Order id */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" pt={5} pb={5}>
          <Typography variant="h5" fontSize={17} lineHeight="21px" fontWeight={700}>
            Order #{order?.orderId}
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

        <Stack gap={4} mb={4}>
          {/* <Details order={order} /> */}
          {/* <OrderIssues flags={order?.flag} sx={{ border: 'none', borderRadius: '0px', padding: '0px 0px' }} /> */}
          <OrderTimeline
            order={order}
            timelineTypoSx={{
              fontSize: '12px',
            }}
            sx={{ border: 'none', borderRadius: '0px', padding: '0px 0px' }}
          />
          <DeliveryDetails order={order} sx={{ border: 'none', borderRadius: '0px', padding: '0px 0px' }} />
          {order?.isButler && (
            <ButlerOrderSummary order={order} sx={{ border: 'none', borderRadius: '0px', padding: '0px 0px' }} />
          )}
          {!order?.isButler && (
            <OrderSummary order={order} sx={{ border: 'none', borderRadius: '0px', padding: '0px 0px' }} />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default UrgentOrderDetails;
