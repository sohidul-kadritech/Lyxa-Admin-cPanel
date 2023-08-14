import { Stack } from '@mui/material';
import MessageItem from './MessageItem';
import MessageListSkeleton from './Skeleton';

export default function MessageList({ messages, loading }) {
  // console.log('loading inside loader', loading);
  // console.log('messages', messages);

  if (loading) return <MessageListSkeleton />;

  return (
    <Stack gap={2} pt={5}>
      {messages?.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </Stack>
  );
}
