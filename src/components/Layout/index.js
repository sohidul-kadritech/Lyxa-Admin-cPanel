import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
  admin_menu_items,
  customer_service_menu_items,
  seller_menu_items,
  shop_menu_items,
} from '../../common/sidebar_menu_items';
import { useGlobalContext } from '../../context';
import { admin_routes } from '../../routes/admin_routes';
import { customer_service_routes } from '../../routes/customer_service_routes';
import { seller_routes } from '../../routes/seller_routes';
import { shop_routes } from '../../routes/shop_routes';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export const getRouteAndSidebarItems = (userType, adminType, prefix = '') => {
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

  if (userType === 'admin' && adminType === 'admin') {
    routes = admin_routes;
    menuItems = admin_menu_items;
  }

  if (userType === 'admin' && adminType === 'customerService') {
    routes = customer_service_routes;
    menuItems = customer_service_menu_items;
  }

  return { routes, menuItems };
};

export default function Layout() {
  const { currentUser } = useGlobalContext();
  const [sidebar, setSidebar] = useState(false);
  const { routes, menuItems } = useMemo(
    () => getRouteAndSidebarItems(currentUser?.userType, currentUser?.adminType),
    [currentUser?.userType]
  );

  // const location = useLocation();

  // // check and update route depth
  // useEffect(() => {
  //   console.log(location);
  //   // admin
  //   if (currentUser?.userType === 'admin') {

  //   } else if (currentUser?.userType === 'seller') {
  //   }
  // }, [location]);

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
            paddingLeft: '50px',
            paddingRight: '50px',
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
