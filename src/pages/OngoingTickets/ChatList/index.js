import { Stack, Typography } from '@mui/material';
import ChatItem from './ChatItem';
import ChatListSkeleton from './Skeleton';

export default function ChatsList({ onViewDetails, chats, loading }) {
  if (loading) return <ChatListSkeleton />;

  if (!loading && !chats?.length)
    return (
      <Typography variant="inherit" fontSize="17px" color="text.secondary2">
        No chats found
      </Typography>
    );

  return (
    <Stack gap={5} pb={9}>
      {chats?.map((chat) => (
        <ChatItem chat={chat} key={chat?._id} onViewDetails={onViewDetails} />
      ))}
    </Stack>
  );
}
