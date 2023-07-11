/* eslint-disable no-unused-vars */
import { Button, Stack } from '@mui/material';

import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
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

export default function Chat({ chat }) {
  const { socket } = useSelector((store) => store.socketReducer);
  const [requestId, setRequestId] = useState(getRequestId(chat?.chats));

  const [, setRender] = useState(false);
  const [messages, setMessages] = useState(chat?.chats || []);
  const [message, setMessage] = useState('');

  // accept chat
  const acceptMutation = useMutation((data) => AXIOS.post(Api.ACCEPT_CHAT, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      console.log('data--', data);
      if (data?.status) {
        socket.emit('admin_accepted_chat_request', { requestId });
        chat.status = 'accepted';
        setRender((prev) => !prev);
      }
    },

    onError: (error) => {
      successMsg(error?.message || 'Could not accept chat request', 'error');
      console.log(error);
    },
  });

  const onAcceptChat = () => {
    acceptMutation.mutate({ id: requestId });
  };

  // message
  const messageMutation = useMutation((data) => AXIOS.post(Api.SEND_MESSAGE, data), {
    onSuccess: (data) => {
      if (data?.status) {
        setMessage('');
        setMessages((prev) => [...prev, data?.data?.request]);
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

  useEffect(() => {
    setRequestId(getRequestId(chat?.chats));
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
        sendMessageLoading={messageMutation.isLoading}
        messages={messages}
        message={message}
        setMessage={setMessage}
        onSendMessage={onSendMessage}
      />
      <Stack gap={2.5}>
        {chat?.status === 'pending' && (
          <Button variant="contained" color="primary" onClick={onAcceptChat} disabled={acceptMutation.isLoading}>
            Accept Enquiry
          </Button>
        )}
        {chat?.status === 'accepted' && (
          <Button variant="contained" color="primary">
            Resolve Ticket
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
