import { Stack, Typography } from '@mui/material';

function MessageItem({ message }) {
  return <Typography variant="body1">{message?.message}</Typography>;
}

export default function MessageList({ messages }) {
  return (
    <Stack gap={2}>
      {messages?.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </Stack>
  );
}
