import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { admin_menu_items, seller_menu_items, shop_menu_items } from '../../common/sidebar_menu_items';
import { useGlobalContext } from '../../context/GlobalContext';
import { admin_routes } from '../../routes/admin_routes';
import { seller_routes } from '../../routes/seller_routes';
import { shop_routes } from '../../routes/shop_routes';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export const getRouteAndSidebarItems = (userType, prefix = '') => {
  let routes = [];
  let menuItems = [];

  if (userType === 'shop') {
    routes = shop_routes(prefix);
    menuItems = shop_menu_items(prefix);
  }

  if (userType === 'seller') {
    routes = seller_routes(prefix);
    menuItems = seller_menu_items(prefix);
  }

  if (userType === 'admin') {
    routes = admin_routes;
    menuItems = admin_menu_items;
  }

  return { routes, menuItems };
};

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
