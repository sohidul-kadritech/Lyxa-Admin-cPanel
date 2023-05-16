import { Box } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar';

export default function ChildLayout({ routes, menuItems }) {
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
      <Sidebar variant="child" menuItems={menuItems} />
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
