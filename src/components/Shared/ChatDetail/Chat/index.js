/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Button, Stack } from '@mui/material';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import socketServices from '../../../../common/socketService';
import { useGlobalContext } from '../../../../context';
import getCookiesAsObject from '../../../../helpers/cookies/getCookiesAsObject';
import { successMsg } from '../../../../helpers/successMsg';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import ChatBox from './ChatBox';
import ChatIssues from './ChatIssue';

export const getChatRequestId = (chats = []) => {
  const recentMsg = chats?.at(-1) || chats?.[chats.length - 1];
  return typeof recentMsg?.adminChatRequest === 'string'
    ? recentMsg?.adminChatRequest
    : recentMsg?.adminChatRequest?._id;
};

const getOrderId = (chat) => (typeof chat?.order === 'string' ? chat?.order : chat?.order?._id);

export default function Chat({ chat, onClose, onAcceptChat, readOnly }) {
  const queryClient = useQueryClient();
  const { access_token } = getCookiesAsObject();

  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;

  const [requestId, setRequestId] = useState(getChatRequestId(chat?.chats));
  const [orderId, setOrderId] = useState(getOrderId(chat));

  const [, setRender] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const listContainerRef = useRef();

  // scroll into bottom
  const scrollToBottom = () => {
    listContainerRef.current.style.height = '80px';
    listContainerRef?.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    listContainerRef.current.style.height = '0px';
  };

  // chat orderChatQuery
  const setMessageData = (data, type) => {
    if (data?.status && type === 'order') setMessages(data?.data?.chats || []);
    if (data?.status && type === 'account') setMessages(data?.data?.chats?.chats || []);
  };

  const orderChatQuery = useQuery(
    [Api.SINGLE_CHAT, { orderId }],
    () =>
      AXIOS.get(Api.SINGLE_CHAT, {
        params: { orderId },
      }),
    {
      enabled: chat?.chatType === 'order',
      onSuccess: (data) => {
        setMessageData(data, 'order');
      },
    },
  );

  const accountChatQuery = useQuery(
    [Api.SINGLE_CHAT_ACCOUNT, { requestId }],
    () =>
      AXIOS.get(Api.SINGLE_CHAT_ACCOUNT, {
        params: { requestId },
      }),
    {
      enabled: chat?.chatType === 'account',
      onSuccess: (data) => setMessageData(data, 'account'),
    },
  );

  // message
  const messageMutation = useMutation((data) => AXIOS.post(Api.SEND_MESSAGE, data), {
    onSuccess: (data) => {
      if (data?.status) {
        socketServices.emit('admin_message_sent', { room: requestId });
        setMessages((prev) => [...prev, data?.data?.request]);
        setMessage('');
        scrollToBottom();
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
    console.log('chat closed by user');

    chat.status = 'closed';
    queryClient.invalidateQueries([Api.ONGOING_CHATS]);

    if (closedBy === 'admin') {
      onClose();
      socketServices.emit('chat-close', { requestId });
      successMsg('Chat successfully closed', 'success');
    } else {
      successMsg('User closed chat', 'success');
    }
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

  const chatConnect = () => {
    socketServices?.emit('join_user_and_admin_chat', { room: requestId, data: { access_token } });
  };

  // accept chat
  const acceptMutation = useMutation((data) => AXIOS.post(Api.ACCEPT_CHAT, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        socketServices.emit('admin_accepted_chat_request', { requestId });
        chat.status = 'accepted';
        setRender((prev) => !prev);

        // console.log('accepted data', data);

        messages?.push({
          type: 'admin',
          createdAt: new Date(),
          message: `Hi, I am ${admin?.name}. How can I help you.`,
          admin,
        });

        onAcceptChat(data);
        chatConnect();
        queryClient.invalidateQueries([Api.ONGOING_CHATS]);
        queryClient.invalidateQueries([Api.NEW_CHATS]);
      }
    },
    onError: (error) => {
      successMsg(error?.message || 'Could not accept chat request', 'error');
      console.log(error);
    },
  });

  useEffect(() => {
    if (!readOnly) {
      // join room
      if (requestId) chatConnect();

      // listen for user messages
      socketServices?.on(`user_message_sent-${requestId}`, (data) => {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      });

      // listen for user chat close
      socketServices?.on(`chat-close-${requestId}`, () => afterCloseChat('user'));
    }

    return () => {
      socketServices?.removeListener(`user_message_sent-${requestId}`);
      socketServices?.removeListener(`chat-close-${requestId}`);
      socketServices?.removeListener(`admin_accepted_chat_request-${requestId}`);
    };
  }, [requestId]);

  useEffect(() => {
    setOrderId(getOrderId(chat));
    setRequestId(getChatRequestId(chat?.chats));

    if (chat?.chatType === 'order') {
      const cache = queryClient.getQueryData([Api.SINGLE_CHAT, { orderId: getOrderId(chat) }]);
      setMessageData(cache, 'order');
    } else {
      const cache = queryClient.getQueryData([Api.SINGLE_CHAT_ACCOUNT, { requestId }]);
      setMessageData(cache, 'account');
    }
  }, [chat]);

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
        ref={listContainerRef}
        showInput={chat.status === 'accepted' && !readOnly}
        sendMessageLoading={messageMutation.isLoading}
        messages={messages}
        message={message}
        setMessage={setMessage}
        onSendMessage={onSendMessage}
        loading={orderChatQuery?.isLoading || accountChatQuery?.isLoading}
      />
      {chat?.status === 'pending' && !readOnly && (
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
      {chat?.status === 'accepted' && !readOnly && (
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
