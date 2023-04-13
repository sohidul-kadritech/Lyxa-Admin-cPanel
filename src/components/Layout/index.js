import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '230px 1fr',
        height: '100vh',
        overflowY: 'hidden',
      }}
    >
      <Sidebar />
      <Box>
        <Topbar />
        <Box
          sx={{
            paddingLeft: 10,
            paddingRight: 10,
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
