import { Box, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function MenuList({ menuList }) {
  return (
    <Box>
      <Typography
        variant="body3"
        sx={{
          fontWeight: '500',
          fontSize: '12px',
          lineHeight: '18px',
          paddingLeft: '30px',
          paddingTop: '28px',
          paddingBottom: '8px',
          color: '#fff!important',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          display: 'block',
        }}
      >
        {menuList.title}
      </Typography>
      <Stack>
        {menuList?.menu?.map(({ to, icon: Icon, label }, index) => (
          <NavLink to={to} exact key={index} className={() => `sidebar-menu-item`}>
            {Icon && <Icon />}
            <Typography
              variant="body2"
              sx={{
                color: '#fff',
                fontWeight: '400',
              }}
            >
              {label}
            </Typography>
          </NavLink>
        ))}
      </Stack>
    </Box>
  );
}
