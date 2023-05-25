import { Box, Stack, Typography } from '@mui/material';
import { getMockChats } from './mock';

function ChatItem({ chat }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className={chat?.status === 'new' ? 'new' : undefined}
      sx={{
        padding: '12px 20px',
        border: '1px solid',
        borderColor: 'custom.border',
        borderRadius: '7px',
        cursor: 'pointer',
        transition: 'background 200ms ease-in-out',

        '&:hover': {
          background: '#f0f3f6',
        },

        '&.new': {
          borderColor: '#5BBD4E',
          background: 'rgba(91, 189, 78, 0.1)',
        },
      }}
    >
      <Stack gap={1}>
        <Typography variant="body4" fontWeight={600}>
          {chat?.customerName}
        </Typography>
        <Typography variant="body4" fontWeight={400}>
          {chat?.orderId}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={4}>
        {chat?.status === 'new' && (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #5BBD4E',
              background: 'rgba(91, 189, 78, 0.1)',
              borderRadius: '25px',
              fontSize: '12px',
              width: '50px',
              height: '24px',
            }}
          >
            New
          </Box>
        )}
        <Typography variant="body4" fontWeight={600}>
          ${chat?.amount}
        </Typography>
        <Typography variant="body4" fontWeight={400}>
          {chat?.createdAt}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function ChatsList() {
  return (
    <Stack gap={5}>
      {getMockChats(10)?.map((chat) => (
        <ChatItem chat={chat} key={chat?.orderId} />
      ))}
    </Stack>
  );
}
