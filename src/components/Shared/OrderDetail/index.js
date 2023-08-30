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

const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];

export default function OrderDetail({
  order,
  onClose,
  hideIssues,
  onClickAccept,
  onClickReject,
  onLoadingUpdateStatus,
  showFor = 'admin',
}) {
  console.log('order status', order?.orderStatus);
  console.log('order next order', getNextStatus(order));
  console.log('order label', statusOptions[getNextStatus(order)]?.label);
  const { currentUser } = useGlobalContext();
  const { userType } = currentUser;
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();

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
            <Stack direction="row" alignItems="center" justifyContent="space-between" pt={10} pb={6}>
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
            <Details hideIssues={hideIssues} order={order} userType={userType} />
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

          {/* This component only visible for shop */}
          {showFor === 'shop' && (
            <Box my={7.2}>
              <Stack
                direction="row"
                justifyContent={
                  statusOptions[getNextStatus(order)]?.label === 'Preparing' ? 'space-between' : 'flex-end'
                }
              >
                {/* @If the next status is preparing then it will visible otherwise not (Reject button) */}
                {statusOptions[getNextStatus(order)]?.label === 'Preparing' && (
                  <Button onClick={onClickReject} variant="contained" color="danger">
                    Reject
                  </Button>
                )}
                <Stack direction="row" gap={4}>
                  <Button variant="text" startIcon={<Print />} disableRipple color="primary">
                    Print
                  </Button>
                  {/* @If there has next step it will visible otherWise not (Next Status Button) */}
                  {hideUpdateAndCanelOption.indexOf(order?.orderStatus) < 0 && (
                    <Button
                      onClick={onClickAccept}
                      variant="contained"
                      color="primary"
                      disabled={onLoadingUpdateStatus}
                    >
                      {statusOptions[getNextStatus(order)]?.label === 'Preparing'
                        ? 'Accept'
                        : statusOptions[getNextStatus(order)]?.label}
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </OrderContextProvider>
  );
}
