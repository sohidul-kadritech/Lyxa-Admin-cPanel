import { Box } from '@mui/material';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children }) {
  const [sidebar, setSidebar] = useState(false);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        height: '100vh',
        overflowY: 'hidden',
      }}
    >
      <Topbar sidebar={sidebar} setSidebar={setSidebar} />
      <Box position="relative">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} variant="parent" />
        <Box
          sx={{
            paddingLeft: 12.5,
            paddingRight: 12.5,
            height: 'calc(100vh - 67px)',
            overflowY: 'scroll',
            backgroundColor: '#fbfbfb',
          }}
        >
          {children}
        </Box>
        <ToastContainer />
      </Box>
    </Box>
  );
}
