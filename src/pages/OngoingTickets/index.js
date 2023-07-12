import { Box, Modal, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TabPanel from '../../components/Common/TabPanel';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import ChatDetails from '../../components/Shared/ChatDetail';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import OrderCancel from '../NewOrder/OrderCancel';
import { UpdateFlag } from '../NewOrder/UpdateFlag';
import UpdateOrderStatus from '../NewOrder/UpdateOrderStatus';
import ChatsList from './ChatList';
import SlideInContainer from './SlideInContainer';

const queryParamsInit = {
  page: 1,
  pageSize: 10,
  chatType: 'order',
};

const tabValueToChatTypeMap = { 0: 'order', 1: 'account' };

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;

  const [currentTab, setCurrentTab] = useState(0);
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [, setRender] = useState(false);

  const [currentOrder, setCurrentOrder] = useState({});
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [flagModal, setFlagModal] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const query = useQuery(
    [Api.ONGOING_CHATS, queryParams],
    () =>
      AXIOS.get(Api.ONGOING_CHATS, {
        params: queryParams,
      }),
    {}
  );

  const onViewDetails = (chat) => {
    setSelectedChat(chat);
    setSidebarOpen(true);
  };

  const threeDotHandler = (menu, chat) => {
    if (typeof chat?.order === 'object') chat.order.user = chat?.user;

    if (menu === 'flag') {
      setFlagModal(true);
      setCurrentOrder(chat?.order);
    }

    if (menu === 'cancel_order') {
      setCurrentOrder(chat?.order);
      setOpenCancelModal(!openCancelModal);
    }

    if (menu === 'update_status') {
      setUpdateStatusModal(true);
      setCurrentOrder(chat?.order);
    }
  };

  const updateOrder = (data) => {
    console.log('data---data', data);
  };

  return (
    <>
      <Box
        sx={{
          height: 'calc(100vh - 83px)',
          overflowY: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <SlideInContainer open={sidebarOpen} type="static" pt={9}>
            <Typography variant="h4" pb={10}>
              Dashboard
            </Typography>
            <UserProfileInfo
              user={{
                name: admin?.name,
                email: admin?.email,
                phone: admin?.phone_number,
              }}
              avatarProps={{
                sx: { width: 70, height: 70 },
              }}
              containerProps={{ sx: { gap: 5 } }}
            />
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => {
                setCurrentTab(newValue);
                setQueryParams((prev) => ({ ...prev, chatType: tabValueToChatTypeMap[newValue] }));
              }}
              sx={{
                paddingTop: '40px',
                '& .MuiTab-root': {
                  padding: '8px 12px',
                  textTransform: 'none',
                },
              }}
            >
              <Tab label="Orders Ticket" />
              <Tab label="Account Tickets" />
            </Tabs>
            <Box pt={9}>
              <TabPanel index={0} value={currentTab} noPadding>
                <ChatsList
                  onViewDetails={onViewDetails}
                  chats={query?.data?.data?.list}
                  loading={query?.isLoading}
                  handleMenuClick={threeDotHandler}
                />
              </TabPanel>
              <TabPanel index={1} value={currentTab} noPadding>
                <ChatsList
                  onViewDetails={onViewDetails}
                  chats={query?.data?.data?.list}
                  loading={query?.isLoading}
                  handleMenuClick={threeDotHandler}
                />
              </TabPanel>
            </Box>
          </SlideInContainer>
        </Box>
        <SlideInContainer type="dynamic" open={sidebarOpen}>
          <ChatDetails
            showingFor="ongoing"
            chat={selectedChat}
            onClose={() => setSidebarOpen(false)}
            onAcceptChat={() => setRender((prev) => !prev)}
          />
        </SlideInContainer>
      </Box>
      <Modal
        open={updateStatusModal}
        onClose={() => {
          setUpdateStatusModal(false);
        }}
      >
        <UpdateOrderStatus
          refetchApiKey={Api.ONGOING_CHATS}
          onSuccess={(data) => {
            setSidebarOpen(false);
            updateOrder(data);
          }}
          onClose={() => setUpdateStatusModal(false)}
          setCurrentOrder={setCurrentOrder}
          currentOrder={currentOrder}
        />
      </Modal>
      <Modal
        open={flagModal}
        onClose={() => {
          setFlagModal(false);
        }}
      >
        <UpdateFlag
          onSuccess={(data) => {
            setSidebarOpen(false);
            updateOrder(data);
          }}
          currentOrder={currentOrder}
          onClose={() => setFlagModal(false)}
          refetchApiKey={Api.ONGOING_CHATS}
        />
      </Modal>
      <Modal
        open={openCancelModal}
        onClose={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        sx={{ zIndex: '10 !important' }}
      >
        <OrderCancel
          onSuccess={(data) => {
            setSidebarOpen(false);
            updateOrder(data);
          }}
          setOpenCancelModal={setOpenCancelModal}
          currentOrder={currentOrder}
          refetchApiKey={Api.ONGOING_CHATS}
        />
      </Modal>
    </>
  );
}
