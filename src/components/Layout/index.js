import { Box, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children }) {
  const matches = useMediaQuery('(max-width: 1100px)');
  const [sidebar, setSidebar] = useState(false);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: matches ? '1fr' : '230px 1fr',
        height: '100vh',
        overflowY: 'hidden',
      }}
    >
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
      <Box>
        <Topbar sidebar={sidebar} setSidebar={setSidebar} />
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
