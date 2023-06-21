import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, styled } from '@mui/material';
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

const StyledToggleButton = styled(IconButton)(() => ({
  position: 'absolute',
  zIndex: 9,
  left: '-6px',
  right: 'auto',
  top: '22px',
  color: '#fff',
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
              <StyledToggleButton
                disableRipple
                onClick={() => {
                  setCurrentSidebar((prev) => (prev === 'right' ? 'left' : 'right'));
                }}
              >
                {currentSidebar === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </StyledToggleButton>
              <SidebarWrapper className={currentSidebar === 'right' ? 'show-left' : undefined}>
                <Sidebar variant="child" menuItems={menuItems} title={sidebarTitle} childFor={childFor} />
                <Sidebar variant="child" menuItems={secondaryMenuItems} title="Lyxa Shop" childFor="shop" />
              </SidebarWrapper>
            </Box>
          )}
        </Box>
      )}
      {hideSidebar && <Box />}
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
            {routes?.map(({ path, component: Component, componentProps, ...props }) => (
              <CacheRoute
                when="always"
                multiple
                exact
                key={path}
                path={path}
                render={(...routeProps) => <Component {...routeProps} {...componentProps} />}
                cacheKey={path}
                saveScrollPosition
                {...props}
              />
            ))}
          </CacheSwitch>
        ) : (
          <Switch>
            {routes?.map(({ path, component: Component, componentProps, ...props }) => (
              <Route
                exact
                key={path}
                path={path}
                render={(...routeProps) => <Component {...routeProps} {...componentProps} />}
                {...props}
              />
            ))}
          </Switch>
        )}
      </Box>
    </Box>
  );
}
