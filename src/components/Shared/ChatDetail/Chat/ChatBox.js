import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { PhraseBox } from './PhraseBox';

export default function ChatBox({ messages, onSendMessage, message, setMessage, sendMessageLoading, showInput }) {
  const [open, setOpen] = useState(false);

  return (
    <Stack
      position="relative"
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'custom.border',
        padding: '24px 15px 0',
        minHeight: '800px',
        borderRadius: '8px',
      }}
    >
      {showInput && <PhraseBox open={open} setOpen={setOpen} />}
      <Box sx={{ flex: 1 }}>
        <MessageList messages={messages} />
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
