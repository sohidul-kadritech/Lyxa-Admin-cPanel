import { Avatar, Button, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as NotificationIcon } from '../../../assets/icons/t-notification.svg';
import { ReactComponent as SupportIcon } from '../../../assets/icons/t-support.svg';
import AccountMenu from './AccountMenu';

export default function Topbar() {
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
      justifyContent="flex-end"
      sx={{
        borderBottom: '1px solid #F8F8F8',
      }}
    >
      <Stack direction="row" alignItems="center" gap="25px" pt="15px" pb="15px" pl="30px" pr="30px">
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
