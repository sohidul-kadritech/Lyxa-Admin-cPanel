import { Box, Drawer, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactComponent as Logo } from '../../../assets/icons/lyxa-sidebar-logo.svg';
import {
  admin_menu_items,
  customer_service_menu_items,
  seller_menu_items,
  shop_menu_items,
} from '../../../common/sidebar_menu_items';
import MenuList from './MenuList';

export default function Sidebar({ sidebar, setSidebar, variant }) {
  const { account_type, adminType } = useSelector((store) => store.Login.admin);

  let menuItems = [];

  if (account_type === 'shop') menuItems = shop_menu_items;
  if (account_type === 'admin')
    menuItems = adminType !== 'customerService' ? admin_menu_items : customer_service_menu_items;
  if (account_type === 'seller') menuItems = seller_menu_items;

  return (
    <Drawer
      sx={
        {
          // background: 'red',
        }
      }
      variant="temporary"
      open={sidebar}
      onClose={() => {
        setSidebar(false);
      }}
    >
      <Box
        sx={{
          background: variant === 'parent' ? 'white' : '#333333',
          height: '100vh',
          overflowY: 'scroll',
          width: '230px',
        }}
      >
        {/* logo */}
        {variant === 'child' ? (
          <Box
            sx={{
              textAlign: 'center',
              padding: '97px 0px 20px 0px',
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
        ) : (
          <Box paddingTop="83px"></Box>
        )}

        <Stack pb={8.5}>
          {menuItems.map((list, index) => (
            <MenuList key={index} variant={variant} menuList={list} />
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
