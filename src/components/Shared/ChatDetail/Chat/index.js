import { Button, Stack } from '@mui/material';
import OrderIssues from '../../OrderDetail/OrderIssues';

import ChatBox from './ChatBox';

export default function Chat({ order }) {
  return (
    <Stack
      pb={5}
      sx={{
        height: '100%',
        gap: '20px',
      }}
    >
      <OrderIssues flags={order?.flag} />
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
