import { Button, Stack } from '@mui/material';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { successMsg } from '../../../../helpers/successMsg';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import ChatBox from './ChatBox';
import ChatIssues from './ChatIssue';

const getRequestId = (chats = []) => {
  const recentMsg = chats?.at(-1) || chats?.[chats.length - 1];

  return typeof recentMsg?.adminChatRequest === 'string'
    ? recentMsg?.adminChatRequest
    : recentMsg?.adminChatRequest?._id;
};

const getOrderId = (chat) => (typeof chat?.order === 'string' ? chat?.order : chat?.order?._id);

export default function Chat({ chat, onClose, onAcceptChat }) {
  const queryClient = useQueryClient();

  const { socket } = useSelector((store) => store.socketReducer);
  const [requestId, setRequestId] = useState(getRequestId(chat?.chats));
  const [orderId, setOrderId] = useState(getOrderId(chat));

  const [, setRender] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // accept chat
  const acceptMutation = useMutation((data) => AXIOS.post(Api.ACCEPT_CHAT, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        socket.emit('admin_accepted_chat_request', { requestId });
        chat.status = 'accepted';
        setRender((prev) => !prev);
        onAcceptChat(data);
      }
    },

    onError: (error) => {
      successMsg(error?.message || 'Could not accept chat request', 'error');
      console.log(error);
    },
  });

  // chat query
  const setMessageData = (data) => {
    if (data?.status) setMessages(data?.data?.chats || []);
  };

  const query = useQuery(
    [Api.SINGLE_CHAT, { orderId }],
    () =>
      AXIOS.get(Api.SINGLE_CHAT, {
        params: { orderId },
      }),
    {
      onSuccess: (data) => setMessageData(data),
    }
  );

  // message
  const messageMutation = useMutation((data) => AXIOS.post(Api.SEND_MESSAGE, data), {
    onSuccess: (data) => {
      if (data?.status) {
        socket.emit('admin_message_sent', { room: requestId });
        setMessages((prev) => [...prev, data?.data?.request]);
        setMessage('');
      }
    },
  });

  const onSendMessage = () => {
    if (!message?.trim() || messageMutation?.isLoading) return;

    messageMutation.mutate({
      id: requestId,
      message,
    });
  };

  // close chat
  const afterCloseChat = (closedBy) => {
    if (closedBy === 'admin') socket.emit('chat-close', { requestId });
    chat.status = 'closed';
    queryClient.invalidateQueries([Api.ONGOING_CHATS]);
    onClose();
  };

  const closeChatMutation = useMutation((data) => AXIOS.post(Api.CLOSE_CONVERSATION, data), {
    onSuccess: (data) => {
      if (data?.status) {
        afterCloseChat('admin');
      }
    },

    onError: (error) => {
      successMsg(error?.message || 'Could not close chat request', 'error');
      console.log(error);
    },
  });

  useEffect(() => {
    setOrderId(getOrderId(chat));
    setRequestId(getRequestId(chat?.chats));
    const cache = queryClient.getQueryData([Api.SINGLE_CHAT, { orderId: getOrderId(chat) }]);
    setMessageData(cache);
  }, [chat]);

  useEffect(() => {
    if (requestId && socket) {
      socket.on(`user_message_sent`, (data) => {
        setMessage((prev) => [...prev, data]);
      });

      socket.on(`chat-close`, () => afterCloseChat());
    }

    return () => {
      socket?.removeListener(`user_message_sent-${requestId}`);
      socket?.removeListener(`chat-close-${requestId}`);
    };
  }, []);

  return (
    <Stack
      pb={5}
      sx={{
        height: '100%',
        gap: '20px',
      }}
    >
      <ChatIssues chat={chat} />
      <ChatBox
        showInput={chat.status === 'accepted'}
        sendMessageLoading={messageMutation.isLoading}
        messages={messages}
        message={message}
        setMessage={setMessage}
        onSendMessage={onSendMessage}
        loading={query?.isLoading}
      />
      {chat?.status === 'pending' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            acceptMutation.mutate({ id: requestId });
          }}
          disabled={acceptMutation.isLoading}
        >
          Accept Enquiry
        </Button>
      )}
      {chat?.status === 'accepted' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            closeChatMutation.mutate({ requestId });
          }}
          disabled={closeChatMutation.isLoading}
        >
          Resolve Ticket
        </Button>
      )}
    </Stack>
  );
}
