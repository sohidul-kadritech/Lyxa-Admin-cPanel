import { Box } from '@material-ui/core';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import Sidebar from '../Sidebar';

export default function ChildLayout({ routes, menuItems, sidebarTitle, childFor }) {
  // const { currentUser } = useGlobalContext();
  // const params = useParams();

  // const routePrefix = useMemo(() => {
  //   if (currentUser?.userType === 'admin') {
  //     return '/seller/:shopId/shop/:shopId';
  //   }

  //   return '/shop/:shopId';
  // }, []);

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
      {/* sidebar */}
      {/* {!hideSidebar && ( */}
      {/* <Box
          sx={{
            width: '230px',
            height: 'calc(100vh - 83px)',
            position: 'relative',
          }}
        >
          <Box position="absolute" top={0} left={0} width="230px" height="calc(100vh - 83px)">
          </Box>
          {
            currentUser?.admin?._id && currentUser?.shop
}
          <Box position="absolute" top={0} left={0} width="230px" height="calc(100vh - 83px)">
            <Sidebar
              variant="child"
              menuItems={shop_menu_items(replacePathValues(routePrefix, params))}
              title="Lyxa Shop"
              childFor="shop"
            />
          </Box>
        </Box>
      )} */}
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
