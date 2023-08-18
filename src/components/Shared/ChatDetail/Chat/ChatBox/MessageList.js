import { Stack } from '@mui/material';
import React from 'react';
import MessageItem from './MessageItem';
import MessageListSkeleton from './Skeleton';

const MessageList = React.forwardRef(({ messages, loading }, ref) => (
  <Stack gap={2} pt={5}>
    {!loading && messages?.map((message, index) => <MessageItem key={index} message={message} />)}
    {loading && <MessageListSkeleton />}
    <span ref={ref}></span>
  </Stack>
));

export default MessageList;
