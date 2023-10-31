/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

import socketServices from '../../../common/socketService';
import OrderTrackingModal from '../../../pages/AdminOrderTable/OrderTracking';
import LoadingOverlay from '../../Common/LoadingOverlay';
import TablePagination from '../../Common/TablePagination';
import AdjustmentOrder from '../AdjustMentOrder';
import ChangeDeliveryAddress from '../ChangeDeliveryAddress';
import { getChatRequestId } from '../ChatDetail/Chat';
import FlaggedModal from '../Flagged';
import ResolveChat from '../ResolveChat';
import UpdateOrderStatus from '../UpdateOrderStatus';
import ChatItem from './ChatItem';
import ChatListSkeleton from './Skeleton';

const modalsStateInit = {
  flag: false,
  updateStatus: false,
  cancelOrder: false,
  resolveChat: false,
  orderTracking: false,
  changeAddress: false,
  adjustOrder: false,
};

export default function ChatList({
  onViewDetails,
  chats,
  loading,
  refetching,
  onAction,
  page,
  setPage,
  totalPage,
  hidePagination,
  showThreedots,
}) {
  const queryClient = useQueryClient();

  const [temporarySelectedChat, setTemporarySelectedChat] = useState({});
  const [requestId, setRequestedId] = useState('');
  const [modals, setModals] = useState({ ...modalsStateInit });

  const closeChatMutation = useMutation((data) => AXIOS.post(Api.CLOSE_CONVERSATION, { requestId: data?.requestId }), {
    onSuccess: (data, reqBody) => {
      if (data?.status) {
        socketServices.emit('chat-close', { requestId: reqBody?.requestId });
        setModals((prev) => ({ ...prev, resolveChat: false }));
        temporarySelectedChat.status = 'closed';
        queryClient.invalidateQueries([Api.ONGOING_CHATS]);
        queryClient.invalidateQueries([Api.NEW_CHATS]);
        onAction('resolve', reqBody?.chat);
      }
    },
    onError: (error) => {
      successMsg(error?.message || 'Could not close chat request', 'error');
      console.log(error);
    },
  });

  const handleMenuClick = (menu, chat) => {
    // set user inside order
    if (typeof chat?.order === 'object') chat.order.user = chat?.user;
    setTemporarySelectedChat(chat);

    if (menu === 'flag') setModals((prev) => ({ ...prev, flag: true }));
    if (menu === 'cancel_order') setModals((prev) => ({ ...prev, cancelOrder: true }));
    if (menu === 'update_status') setModals((prev) => ({ ...prev, updateStatus: true }));
    if (menu === 'track_order') setModals((prev) => ({ ...prev, orderTracking: true }));
    if (menu === 'change_address') setModals((prev) => ({ ...prev, changeAddress: true }));
    if (menu === 'adjust_order') setModals((prev) => ({ ...prev, adjustOrder: true }));

    // requestedId
    setRequestedId(getChatRequestId(chat?.chats));
    // send due to closure causing afterChat close to get old
    if (menu === 'resolve_ticket') setModals((prev) => ({ ...prev, resolveChat: true }));
  };

  if (loading) return <ChatListSkeleton />;

  if (!loading && !chats?.length)
    return (
      <Typography variant="inherit" fontSize="17px" color="text.secondary2">
        No chats found
      </Typography>
    );

  return (
    <>
      <Box pb={9}>
        <Stack gap={5} position="relative">
          {(refetching || closeChatMutation.isLoading) && <LoadingOverlay />}
          {chats?.map((chat) => (
            <ChatItem
              chat={chat}
              key={chat?._id}
              onViewDetails={onViewDetails}
              handleMenuClick={handleMenuClick}
              showThreedots={showThreedots}
            />
          ))}
        </Stack>
        {!hidePagination && (
          <Stack alignItems="center" pt={5}>
            <TablePagination
              currentPage={page}
              lisener={(page) => {
                setPage(page);
              }}
              totalPage={totalPage}
            />
          </Stack>
        )}
      </Box>
      <Modal open={modals.updateStatus} onClose={() => setModals((prev) => ({ ...prev, updateStatus: false }))}>
        <UpdateOrderStatus
          refetchApiKey={Api.ONGOING_CHATS}
          onClose={() => setModals((prev) => ({ ...prev, updateStatus: false }))}
          currentOrder={temporarySelectedChat?.order}
          onSuccess={(data) => onAction('updateStatus', data)}
        />
      </Modal>
      <Modal
        open={modals.flag}
        onClose={() => setModals((prev) => ({ ...prev, flag: false }))}
        sx={{ zIndex: '999 !important' }}
      >
        <FlaggedModal
          order={temporarySelectedChat?.order}
          showFor="flagged"
          refetchApiKey={Api.ONGOING_CHATS}
          onClose={() => setModals((prev) => ({ ...prev, flag: false }))}
          onSuccess={(data) => onAction('flag', data)}
        />
      </Modal>
      <Modal
        open={modals.cancelOrder}
        onClose={() => setModals((prev) => ({ ...prev, cancelOrder: false }))}
        sx={{ zIndex: '999 !important' }}
      >
        <FlaggedModal
          order={temporarySelectedChat?.order}
          showFor="cancelOrder"
          refetchApiKey={Api.ONGOING_CHATS}
          onClose={() => setModals((prev) => ({ ...prev, cancelOrder: false }))}
          onSuccess={(data) => onAction('cancelOrder', data)}
        />
      </Modal>
      <Modal
        open={modals.resolveChat}
        onClose={() => setModals((prev) => ({ ...prev, resolveChat: false }))}
        sx={{ zIndex: '999 !important' }}
      >
        <ResolveChat
          onClose={() => setModals((prev) => ({ ...prev, resolveChat: false }))}
          requestId={requestId}
          closeChatMutation={closeChatMutation}
        />
      </Modal>

      <Modal open={modals?.orderTracking} centered>
        <Box>
          <OrderTrackingModal
            currentOrder={temporarySelectedChat?.order}
            onClose={() => setModals((prev) => ({ ...prev, orderTracking: false }))}
          />
        </Box>
      </Modal>

      <Modal open={modals?.changeAddress}>
        <ChangeDeliveryAddress
          order={temporarySelectedChat?.order}
          onClose={() => setModals((prev) => ({ ...prev, changeAddress: false }))}
        />
      </Modal>
      <Modal open={modals?.adjustOrder} onClose={() => setModals((prev) => ({ ...prev, adjustOrder: false }))}>
        <AdjustmentOrder
          order={temporarySelectedChat?.order}
          onClose={() => setModals((prev) => ({ ...prev, adjustOrder: false }))}
        />
      </Modal>
    </>
  );
}
