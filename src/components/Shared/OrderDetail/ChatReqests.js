/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prettier/prettier */
import { Box, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ChatBox from '../ChatDetail/Chat/ChatBox';
import ChatIssues from '../ChatDetail/Chat/ChatIssue';

const resolvedChat = {
  chatType: 'order',
};

export default function ChatRequests({ order }) {
  const orderId = order?._id;

  const orderChatQuery = useQuery([Api.SINGLE_CHAT, { orderId }], () =>
    AXIOS.get(Api.SINGLE_CHAT, {
      params: { orderId },
    }),
  );

  const tempResolvedChat =
    orderChatQuery?.data?.data?.chats?.length > 0
      ? orderChatQuery?.data?.data?.chats
          ?.filter((chat) => chat?.adminChatRequest?.resolveReason)
          .map(({ adminChatRequest }) => adminChatRequest)
      : [];

  resolvedChat.resolvedReason =
    tempResolvedChat?.length > 0 ? { ...tempResolvedChat[tempResolvedChat?.length - 1] } : undefined;

  return (
    <Box>
      {(orderChatQuery?.data?.data?.chats?.length || orderChatQuery?.isLoading) && (
        <Stack gap={4}>
          {resolvedChat?.resolvedReason && <ChatIssues chat={resolvedChat} />}
          <ChatBox
            showInput={false}
            messages={orderChatQuery?.data?.data?.chats}
            loading={orderChatQuery?.isLoading}
            height="calc(100vh - 250px)"
          />
        </Stack>
      )}
      {!orderChatQuery?.data?.data?.chats?.length && !orderChatQuery?.isLoading && (
        <Stack pt={30} pb={3}>
          <Typography textAlign="center" variant="body1">
            No chat
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
