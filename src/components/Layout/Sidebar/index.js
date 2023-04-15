import { Box, Drawer, Stack, Typography, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactComponent as Logo } from '../../../assets/icons/lyxa-sidebar-logo.svg';
import { admin_menu_items, shop_menu_items } from '../../../common/sidebar_menu_items';
import MenuList from './MenuList';

export default function Sidebar({ sidebar, setSidebar }) {
  const matches = useMediaQuery('(max-width: 1100px)');
  const { account_type } = useSelector((store) => store.Login.admin);

  // menu items
  let menuItems = [];

  if (account_type === 'shop') menuItems = shop_menu_items;
  if (account_type === 'admin') menuItems = admin_menu_items;

  return (
    <Drawer
      variant={matches ? 'temporary' : 'permanent'}
      open={matches ? sidebar : true}
      onClose={() => {
        setSidebar(false);
      }}
    >
      <Box
        sx={{
          background: '#333333',
          height: '100vh',
          overflowY: 'scroll',
          width: '230px',
        }}
      >
        {/* logo */}
        <Box
          sx={{
            textAlign: 'center',
            padding: '30px 0px 20px 0px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            top: '0px',
            position: 'sticky',
            background: '#333333',
          }}
        >
          <Logo />
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: '500',
              fontSize: '22px',
              lineHeight: '27px',
              paddingTop: '20px',
              letterSpacing: '0.05em',
            }}
          >
            Lyxa Manager
          </Typography>
        </Box>
        <Stack pb={8.5}>
          {menuItems.map((list, index) => (
            <MenuList key={index} menuList={list} />
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
