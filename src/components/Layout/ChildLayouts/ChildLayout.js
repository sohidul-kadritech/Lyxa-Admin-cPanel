import { Box } from '@material-ui/core';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import Sidebar from '../Sidebar';

export default function ChildLayout({ routes, menuItems, sidebarTitle }) {
  console.log('from child layout============================================');
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
      <Sidebar variant="child" menuItems={menuItems} title={sidebarTitle} />
      <Box
        sx={{
          paddingLeft: '50px',
          paddingRight: '50px',
          overflowY: 'scroll',
          backgroundColor: '#fbfbfb',
          height: 'calc(100vh - 67px)',
        }}
      >
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
      </Box>
    </Box>
  );
}
