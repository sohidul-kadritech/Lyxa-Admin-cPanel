/* eslint-disable prettier/prettier */
import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { PhraseBox } from './PhraseBox';

const ChatBox = React.forwardRef(
  ({ messages, onSendMessage, message, setMessage, sendMessageLoading, showInput, loading, height }, ref) => {
    const [open, setOpen] = useState(false);

    console.log({ message, messages });
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
          <MessageList messages={messages} loading={loading} ref={ref} />
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
  },
);

export default ChatBox;
