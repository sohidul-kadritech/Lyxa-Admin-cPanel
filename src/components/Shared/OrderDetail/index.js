/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Print } from '@mui/icons-material';
import { Avatar, Box, Button, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useGlobalContext } from '../../../context';
import CloseButton from '../../Common/CloseButton';
import TabPanel from '../../Common/TabPanel';
import { getNextStatus, statusOptions } from '../UpdateOrderStatus/helpers';
import ChatRequests from './ChatReqests';
import Details from './Details';
import Earnings from './Earnings';
import OrderContextProvider from './OrderContext';
import Review from './Reviews';
import RiderChat from './RiderChat';

const hideUpdateAndCancelOption = (order) => {
  const orderStatus = ['cancelled', 'delivered', 'refused'];

  const nextStatus = ['order_on_the_way', 'delivered'];

  const isMatchedNextStatus = nextStatus.indexOf(getNextStatus(order)) >= 0;

  const deliveryBoy = order?.deliveryBoy;

  const assignDeliveryBoyOrNot = isMatchedNextStatus ? !!deliveryBoy : false;

  const areMissedAboveOptions = orderStatus.indexOf(order?.orderStatus) < 0;

  const shouldHideUpdateAndCancelOption = areMissedAboveOptions ? !assignDeliveryBoyOrNot : false;

  return shouldHideUpdateAndCancelOption;
};

function OrderUpdateForShop({
  userType,
  onClickReject,
  onClickAdjustOrder = () => {},
  order,
  onClickAccept,
  onLoadingUpdateStatus,
}) {
  const isPreparing = statusOptions[getNextStatus(order)]?.label === 'Preparing';
  const isSpecific = order?.orderFor !== 'global';

  const shouldReplacementOrderOntheWay =
    !order?.isReplacementItemPickFromUser &&
    order?.replacementOrderDeliveryInfo?.deliveryType === 'shop-customer-shop' &&
    order?.orderStatus === 'order_on_the_way';

  return (
    <Box>
      {/* This component only visible for shop */}
      {userType === 'shop' && (
        <Box my={7.2}>
          <Stack
            direction="row"
            justifyContent={
              statusOptions[getNextStatus(order)]?.label === 'Preparing' ||
              (order?.orderStatus === 'preparing' && !order?.adjustOrderReques)
                ? 'space-between'
                : 'flex-end'
            }
          >
            <Stack direction="row" gap={2.5} alignContent="center">
              {order?.orderStatus === 'preparing' && !order?.adjustOrderRequest && (
                <Button onClick={() => onClickAdjustOrder(order)} variant="outlined" size="small" color="primary">
                  Adjust Order
                </Button>
              )}
              {/* @If the next status is preparing then it will visible otherwise not (Reject button) */}
              {statusOptions[getNextStatus(order)]?.label === 'Preparing' && (
                <Button onClick={onClickReject} variant="contained" size="small" color="danger">
                  Reject
                </Button>
              )}
            </Stack>

            <Stack direction="row" gap={4}>
              <Button variant="text" startIcon={<Print />} disableRipple color="primary">
                Print
              </Button>
              {/* @If there has next step it will visible otherWise not (Next Status Button) */}
              {hideUpdateAndCancelOption(order) && (
                <Button
                  onClick={onClickAccept}
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={
                    onLoadingUpdateStatus ||
                    (statusOptions[getNextStatus(order)].label === 'Ready for pickup' &&
                      order?.adjustOrderRequest &&
                      !order?.isOrderAdjusted)
                  }
                >
                  {statusOptions[getNextStatus(order)]?.label === 'Preparing'
                    ? 'Accept'
                    : shouldReplacementOrderOntheWay
                    ? 'Replacement Order on The Way'
                    : statusOptions[getNextStatus(order)]?.label}
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default function OrderDetail({
  order,
  onClose,
  hideIssues,
  onClickAdjustOrder,
  onClickAccept,
  onClickReject,
  onLoadingUpdateStatus,
  showFor = 'admin',
  stickySx,
  sx,
}) {
  const { currentUser } = useGlobalContext();
  const { userType } = currentUser;
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();

  console.log(theme.palette.danger.secondary2, '');

  const value = useMemo(
    () => ({
      baseCurrency: order?.baseCurrency?.symbol,
      secondaryCurrency: order?.secondaryCurrency?.code,
      shopExchangeRate: order?.shopExchangeRate,
      adminExchangeRate: order?.adminExchangeRate,
    }),
    [],
  );

  return (
    <OrderContextProvider value={value}>
      <Box
        sx={{
          width: '425px',
          padding: '0px 20px 25px 20px',
          ...(sx || {}),
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
              ...(stickySx || {}),
            }}
          >
            {/* top */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" gap={3}>
                <Avatar alt="user-image" src={order?.user?.profile_photo} sx={{ width: 36, height: 36 }}>
                  {order?.user?.name?.length && order?.user?.name?.[0]}
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
            <Stack pt={10} pb={6} gap={2.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
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

              {order?.adjustOrderRequest && !order?.isOrderAdjusted && (
                <Stack
                  sx={{
                    padding: '10px 16px',
                    borderRadius: '7px',
                    alignItems: 'center',
                    backgroundColor: '#FFF5F8',
                  }}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography sx={{ color: theme.palette.danger.secondary }}>
                    Waiting for User to Adjust Order
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Box sx={{ margin: '0 -8px' }}>
              <Tabs
                value={currentTab}
                variant="scrollable"
                scrollButtons="auto"
                onChange={(event, newValue) => {
                  setCurrentTab(newValue);
                }}
                sx={{
                  '& .MuiTab-root': {
                    padding: '8px 12px',
                    textTransform: 'none',
                  },

                  '& .MuiTabScrollButton-root': {
                    width: '15px',
                  },
                }}
              >
                <Tab label="Order Details" />
                <Tab label="Review" />
                {userType === 'admin' && <Tab label="Earning Details" />}
                {userType === 'admin' && <Tab label="Tickets" />}
                {userType === 'admin' && <Tab label="Rider Chat" />}
              </Tabs>
            </Box>
          </Box>
          {/* order detail */}
          <TabPanel index={0} value={currentTab} noPadding>
            <Box>
              <Details hideIssues={hideIssues} order={order} userType={userType} />
              <OrderUpdateForShop
                order={order}
                userType={userType}
                onClickAccept={onClickAccept}
                onClickReject={onClickReject}
                onClickAdjustOrder={onClickAdjustOrder}
                onLoadingUpdateStatus={onLoadingUpdateStatus}
              />
            </Box>
          </TabPanel>
          {/* review */}
          <TabPanel index={1} value={currentTab} noPadding>
            <Review reviews={order?.reviews} />
          </TabPanel>
          {/* earning details */}
          <TabPanel index={2} value={currentTab} noPadding>
            <Earnings order={order} userType={userType} />
          </TabPanel>
          {/*  chat */}
          <TabPanel index={3} value={currentTab} noPadding>
            <ChatRequests order={order} />
          </TabPanel>
          {/* rider chat */}
          <TabPanel index={4} value={currentTab} noPadding>
            <RiderChat chats={order?.chats} />
          </TabPanel>
        </Box>
      </Box>
    </OrderContextProvider>
  );
}
