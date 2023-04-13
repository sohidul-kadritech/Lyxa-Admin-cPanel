import { Box, Stack, Typography } from '@mui/material';
import { ReactComponent as Logo } from '../../../assets/icons/lyxa-sidebar-logo.svg';
import { shop_menu_items } from '../../../common/sidebarItems';
import MenuList from './MenuList';

export default function Sidebar() {
  return (
    <Box
      sx={{
        background: '#333333',
        height: '100vh',
        overflowY: 'scroll',
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
      <Stack>
        {shop_menu_items.map((list, index) => (
          <MenuList key={index} menuList={list} />
        ))}
      </Stack>
    </Box>
  );
}
