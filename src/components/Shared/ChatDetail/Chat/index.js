import { Button, Stack } from '@mui/material';

import ChatBox from './ChatBox';
import ChatIssues from './ChatIssue';

export default function Chat({ chat }) {
  return (
    <Stack
      pb={5}
      sx={{
        height: '100%',
        gap: '20px',
      }}
    >
      <ChatIssues chat={chat} />
      <ChatBox />
      <Stack gap={2.5}>
        <Button variant="contained" color="primary">
          Accept Enquiry
        </Button>
        <Button variant="contained" color="primary">
          Resolve Ticket
        </Button>
      </Stack>
    </Stack>
  );
}
