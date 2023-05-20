import { Box } from '@material-ui/core';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Sidebar from '../Sidebar';

export default function ChildLayout({ menuItems, routes, sidebarTitle, childFor }) {
  // const routeMatch = useRouteMatch();
  // console.log(routeMatch);

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
      <Sidebar variant="child" menuItems={menuItems} title={sidebarTitle} childFor={childFor} />
      <Box
        sx={{
          paddingLeft: '50px',
          paddingRight: '50px',
          overflowY: 'scroll',
          backgroundColor: '#fbfbfb',
          height: 'calc(100vh - 67px)',
        }}
      >
        {childFor === 'shop' ? (
          <CacheSwitch>
            {routes?.map(({ path, component: Component, ...props }) => (
              <CacheRoute
                when="always"
                multiple
                exact
                key={path}
                path={path}
                component={Component}
                cacheKey={path}
                saveScrollPosition
                {...props}
              />
            ))}
          </CacheSwitch>
        ) : (
          <Switch>
            {routes?.map(({ path, component: Component, ...props }) => (
              <Route exact key={path} path={path} component={Component} {...props} />
            ))}
          </Switch>
        )}
      </Box>
    </Box>
  );
}
