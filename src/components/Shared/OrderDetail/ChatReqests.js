import { Box, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ChatBox from '../ChatDetail/Chat/ChatBox';

export default function ChatRequests({ order }) {
  const orderId = order?._id;

  const orderChatQuery = useQuery([Api.SINGLE_CHAT, { orderId }], () =>
    AXIOS.get(Api.SINGLE_CHAT, {
      params: { orderId },
    })
  );

  return (
    <Box>
      {(orderChatQuery?.data?.data?.chats?.length || orderChatQuery?.isLoading) && (
        <ChatBox
          showInput={false}
          messages={orderChatQuery?.data?.data?.chats}
          loading={orderChatQuery?.isLoading}
          height="calc(100vh - 250px)"
        />
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
