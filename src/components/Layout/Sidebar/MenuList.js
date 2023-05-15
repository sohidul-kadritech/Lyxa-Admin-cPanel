import { Box, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const variantToItemStylesMap = {
  dark: {
    color: '#363636',
  },
  light: {
    color: '#fff',
  },
};

export default function MenuList({ menuList, variant, onLinkClick }) {
  return (
    <Box>
      <Typography
        variant="inherit"
        sx={{
          fontWeight: '500',
          fontSize: '12px',
          lineHeight: '18px',
          paddingLeft: '30px',
          paddingTop: '28px',
          paddingBottom: '8px',
          color: variant === 'parent' ? '#363636' : 'white',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          display: 'block',
        }}
      >
        {menuList.title}
      </Typography>
      <Stack>
        {menuList?.menu?.map(({ to, icon: Icon, label }, index) => (
          <NavLink to={to} exact key={index} className={() => `sidebar-menu-item ${variant}`} onClick={onLinkClick}>
            {Icon && <Icon />}
            <span>{label}</span>
          </NavLink>
        ))}
      </Stack>
    </Box>
  );
}
