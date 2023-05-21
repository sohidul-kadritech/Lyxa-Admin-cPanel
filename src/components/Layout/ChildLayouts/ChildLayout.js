import { Box, Button, styled } from '@mui/material';
import { useState } from 'react';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Sidebar from '../Sidebar';

const SidebarWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  width: '460px',
  transform: 'translateX(-230px)',
  transition: '300ms ease',

  '&.show-left': {
    transform: 'translateX(0)',
  },
}));

export default function ChildLayout({
  menuItems,
  routes,
  sidebarTitle,
  childFor,
  hideSidebar,
  secondaryMenuItems,
  sidebarStyle = 'single',
}) {
  const [currentSidebar, setCurrentSidebar] = useState('left');

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
      {!hideSidebar && (
        <Box position="relative" width="230px">
          {sidebarStyle === 'single' ? (
            <Sidebar variant="child" menuItems={menuItems} title={sidebarTitle} childFor={childFor} />
          ) : (
            <Box overflow="hidden">
              <Button
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  zIndex: 9,
                }}
                onClick={() => {
                  setCurrentSidebar((prev) => (prev === 'right' ? 'left' : 'right'));
                }}
              >
                {currentSidebar}
              </Button>
              <SidebarWrapper className={currentSidebar === 'right' ? 'show-left' : undefined}>
                <Sidebar variant="child" menuItems={menuItems} title={sidebarTitle} childFor={childFor} />
                <Sidebar variant="child" menuItems={secondaryMenuItems} title={sidebarTitle} childFor="shop" />
              </SidebarWrapper>
            </Box>
          )}
        </Box>
      )}
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
