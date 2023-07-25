import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import MessageList from '../ChatDetail/Chat/ChatBox/MessageList';

export default function RiderChat({ chats }) {
  const messages = useMemo(() => chats?.map((message) => ({ ...message, type: message?.sender })), [chats]);
  return (
    <Box>
      {messages?.length > 0 && (
        <Stack
          sx={{
            border: '1px solid',
            borderColor: 'custom.border',
            padding: '0 15px',
            borderRadius: '8px',
            height: 'calc(100vh - 250px)',
            overflowY: 'auto',
          }}
        >
          <MessageList messages={messages} />
        </Stack>
      )}
      {messages?.length === 0 && (
        <Stack pt={30} pb={3}>
          <Typography textAlign="center" variant="body1">
            No chat
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
