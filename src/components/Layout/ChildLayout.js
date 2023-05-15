import { Box } from '@material-ui/core';
import { Route, Switch, useParams } from 'react-router-dom';
import { shop_routes } from '../../routes/shop_routes';
import Sidebar from './Sidebar';

export default function ChildLayout({ routesPrefix, to }) {
  const { id } = useParams();
  console.log(id);

  // eslint-disable-next-line max-len
  // const { routes, menuItems } = useMemo(() => getRouteAndSidebarItems(currentUser?.userType), [currentUser?.userType]);
  let routes = [];
  if (to === 'shop') routes = shop_routes(routesPrefix);

  return (
    <Box
      position="relative"
      sx={{
        marginRight: '-50px',
        marginLeft: '-50px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
      }}
    >
      <Sidebar variant="child" />
      <Box
        sx={{
          paddingLeft: '50px',
          paddingRight: '50px',
          overflowY: 'scroll',
          backgroundColor: '#fbfbfb',
          height: 'calc(100vh - 67px)',
        }}
      >
        <Switch>
          {routes.map((route) => (
            <Route exact {...route} key={route.path} />
          ))}
        </Switch>
      </Box>
    </Box>
  );
}
