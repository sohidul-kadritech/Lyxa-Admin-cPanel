import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useGlobalContext } from '../../context/GlobalContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getRouteAndSidebarItems } from './helper';

export default function Layout() {
  const { currentUser } = useGlobalContext();
  const [sidebar, setSidebar] = useState(false);
  const { routes, menuItems } = useMemo(() => getRouteAndSidebarItems(currentUser?.userType), [currentUser?.userType]);

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
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} menuItems={menuItems} variant="parent" />
        <Box
          sx={{
            paddingLeft: 12.5,
            paddingRight: 12.5,
            height: 'calc(100vh - 67px)',
            overflowY: 'scroll',
            backgroundColor: '#fbfbfb',
          }}
        >
          <Switch>
            {routes.map((route) => (
              <Route exact {...route} key={route.path} />
            ))}
          </Switch>
        </Box>
        <ToastContainer />
      </Box>
    </Box>
  );
}
