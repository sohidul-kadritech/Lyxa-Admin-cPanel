import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Button, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as NotificationIcon } from '../../../assets/icons/t-notification.svg';
import { ReactComponent as SupportIcon } from '../../../assets/icons/t-support.svg';
import AccountMenu from './AccountMenu';

export default function Topbar({ setSidebar }) {
  const matches = useMediaQuery('(max-width: 1100px)');

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
        borderBottom: '1px solid #F8F8F8',
      }}
    >
      <Box>
        {matches && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setSidebar(true);
            }}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>
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
