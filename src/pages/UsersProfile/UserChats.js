import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import ChatDetails from '../../components/Shared/ChatDetail';
import ChatsList from '../OngoingTickets/ChatList';
import { order } from '../OngoingTickets/mock';

export default function UserChatList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box>
      <ChatsList
        onOpen={() => {
          setSidebarOpen(true);
        }}
      />
      <Drawer anchor="right" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Box sx={{ minWidth: '400px' }}>
          <ChatDetails showingFor="pastAccount" chat={order} onClose={() => setSidebarOpen(false)} />
        </Box>
      </Drawer>
    </Box>
  );
}
