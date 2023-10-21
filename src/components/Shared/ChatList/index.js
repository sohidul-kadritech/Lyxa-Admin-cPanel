/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import OrderCancel from '../../../pages/NewOrder/OrderCancel';
import { UpdateFlag } from '../../../pages/NewOrder/UpdateFlag';

import socketServices from '../../../common/socketService';
import LoadingOverlay from '../../Common/LoadingOverlay';
import TablePagination from '../../Common/TablePagination';
import { getChatRequestId } from '../ChatDetail/Chat';
import ResolveChat from '../ResolveChat';
import UpdateOrderStatus from '../UpdateOrderStatus';
import ChatItem from './ChatItem';
import ChatListSkeleton from './Skeleton';

const modalsStateInit = { flag: false, updateStatus: false, cancelOrder: false, resolveChat: false };

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
}) {
  const queryClient = useQueryClient();

  const [temporarySelectedChat, setTemporarySelectedChat] = useState({});
  const [requestId, setRequestedId] = useState('');
  const [modals, setModals] = useState({ ...modalsStateInit });

  const closeChatMutation = useMutation((data) => AXIOS.post(Api.CLOSE_CONVERSATION, { requestId: data?.requestId }), {
    onSuccess: (data, reqBody) => {
      if (data?.status) {
        socketServices.emit('chat-close', { requestId: reqBody?.requestId });
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
            <ChatItem chat={chat} key={chat?._id} onViewDetails={onViewDetails} handleMenuClick={handleMenuClick} />
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
      <Modal open={modals.flag} onClose={() => setModals((prev) => ({ ...prev, flag: false }))}>
        <UpdateFlag
          currentOrder={temporarySelectedChat?.order}
          onClose={() => setModals((prev) => ({ ...prev, flag: false }))}
          refetchApiKey={Api.ONGOING_CHATS}
          onSuccess={(data) => onAction('flag', data)}
        />
      </Modal>
      <Modal
        open={modals.cancelOrder}
        onClose={() => setModals((prev) => ({ ...prev, cancelOrder: false }))}
        sx={{ zIndex: '10 !important' }}
      >
        <OrderCancel
          currentOrder={temporarySelectedChat?.order}
          setOpenCancelModal={() => setModals((prev) => ({ ...prev, cancelOrder: false }))}
          refetchApiKey={Api.ONGOING_CHATS}
          onSuccess={(data) => onAction('cancelOrder', data)}
        />
      </Modal>
      <Modal open={modals.resolveChat} onClose={() => setModals((prev) => ({ ...prev, resolveChat: false }))}>
        <ResolveChat
          onClose={() => setModals((prev) => ({ ...prev, resolveChat: false }))}
          requestId={requestId}
          closeChatMutation={closeChatMutation}
        />
      </Modal>
    </>
  );
}
