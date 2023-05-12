import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as Logo } from '../../../assets/icons/logo-sm.svg';
import { ReactComponent as NotificationIcon } from '../../../assets/icons/t-notification.svg';
import { ReactComponent as SupportIcon } from '../../../assets/icons/t-support.svg';
import AccountMenu from './AccountMenu';

export default function Topbar({ setSidebar, sidebar }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      pt="15px"
      pb="15px"
      pl="30px"
      pr="30px"
      sx={{
        zIndex: '1500',
        background: '#fff',
        borderBottom: `1px solid ${sidebar ? 'rgba(177, 177, 177, 0.2)' : 'transparent'}`,
      }}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        <Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setSidebar((prev) => !prev);
            }}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Stack direction="row" alignItems="center" gap={2}>
          <Logo />
          <Typography variant="inherit" fontSize={22} lineHeight="26px" fontWeight={500}>
            Sales Manager
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" gap="25px">
        <Typography variant="body2">
          <SupportIcon /> Get Support
        </Typography>
        <Button variant="text" disableRipple sx={{ minWidth: 0 }}>
          <NotificationIcon />
        </Button>
        <IconButton onClick={handleClick} disableRipple>
          {/* eslint-disable-next-line react/no-children-prop */}
          <Avatar src={undefined} alt="U" children="U" sx={{ width: 36, height: 36 }} />
        </IconButton>
      </Stack>
      <AccountMenu anchorEl={anchorEl} handleClose={handleClose} />
    </Stack>
  );
}
