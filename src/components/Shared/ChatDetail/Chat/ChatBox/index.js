import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { PhraseBox } from './PhraseBox';

export default function ChatBox({
  messages,
  onSendMessage,
  message,
  setMessage,
  sendMessageLoading,
  showInput,
  loading,
}) {
  const [open, setOpen] = useState(false);

  console.log('message is loading', loading);

  return (
    <Stack
      position="relative"
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'custom.border',
        padding: '0 15px',
        borderRadius: '8px',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
      }}
    >
      {showInput && <PhraseBox open={open} setOpen={setOpen} />}
      <Box sx={{ flex: 1 }}>
        <MessageList messages={messages} loading={loading} />
      </Box>
      {showInput && (
        <MessageInput
          sendMessageLoading={sendMessageLoading}
          value={message}
          setValue={setMessage}
          onSendMessage={() => {
            onSendMessage(message);
          }}
        />
      )}
    </Stack>
  );
}
