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
  height,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Stack
      position="relative"
      sx={{
        border: '1px solid',
        borderColor: 'custom.border',
        padding: '0 15px',
        borderRadius: '8px',
        height: height || 'calc(100vh - 200px)',
        overflowY: 'auto',
      }}
    >
      {showInput && (
        <PhraseBox
          open={open}
          setOpen={setOpen}
          onAdd={(selected) => {
            setMessage(selected?.message);
            setOpen(false);
          }}
        />
      )}
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
