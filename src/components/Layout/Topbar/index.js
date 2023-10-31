/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as Logo } from '../../../assets/icons/logo-sm.svg';
import { ReactComponent as NotificationIcon } from '../../../assets/icons/t-notification.svg';
import { ReactComponent as SupportIcon } from '../../../assets/icons/t-support.svg';
import { useGlobalContext } from '../../../context';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import StyledBadgeContainer from '../../Styled/StyledBadge';
import { getProfilePhotoAndAltName } from '../helper';
import AccountMenu from './AccountMenu';
import Notification from './NotificationSidebar';
import Tabs from './Tabs';

const getConsoleName = (userType, adminType, shopOrderManager) => {
  if (userType === 'admin' && adminType === 'admin') {
    return 'Admin Console-Release';
  }

  if (userType === 'admin' && adminType === 'customerService') {
    return 'Customer Service Console';
  }
  if (userType === 'admin' && adminType === 'accountManager') {
    return 'Account Manager';
  }
  if (userType === 'admin' && adminType === 'sales') {
    return 'Sales Manager';
  }
  console.log('shopManager', { shopOrderManager });
  if (userType === 'shop' && shopOrderManager && shopOrderManager !== 'null') {
    return 'Shop Order Manager';
  }

  if (userType === 'shop') {
    return 'Shop Manager';
  }

  if (userType === 'seller') {
    return 'Seller Manager';
  }

  return '';
};

export default function Topbar({ setSidebar, sidebar }) {
  const { currentUser } = useGlobalContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { profilePhoto, altName } = getProfilePhotoAndAltName(currentUser, currentUser?.userType);

  const notificationCountQuery = useQuery(
    [API_URL.GET_UNSEEN_NOTIFICATIONS_COUNT],
    () => AXIOS.get(API_URL.GET_UNSEEN_NOTIFICATIONS_COUNT),
    {
      refetchInterval: 30 * 1000,
      refetchIntervalInBackground: true,
      enabled: currentUser?.userType !== 'shop',
    },
  );

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
            {getConsoleName(currentUser?.userType, currentUser?.adminType, currentUser?.shopOrderManager)}
          </Typography>
        </Stack>
        <Box
          sx={{
            marginBottom: '-43px',
            paddingLeft: '40px',
          }}
        >
          <Tabs />
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" gap="25px">
        <Typography variant="body2">
          <SupportIcon /> Get Support
        </Typography>
        <Button variant="text" disableRipple sx={{ minWidth: 0 }} onClick={() => setOpen(true)}>
          <StyledBadgeContainer
            badgeContent={notificationCountQuery?.data?.data?.unseenCount || 0}
            color="danger"
            sx={{
              '& .MuiBadge-badge': {
                right: 0,
                top: 0,
                padding: '0 4px',
              },
            }}
          >
            <NotificationIcon />
          </StyledBadgeContainer>
        </Button>
        <IconButton onClick={handleClick} disableRipple>
          <Avatar src={profilePhoto} alt="photo" sx={{ width: 36, height: 36, textTransform: 'uppercase' }}>
            {altName}
          </Avatar>
        </IconButton>
      </Stack>
      <AccountMenu anchorEl={anchorEl} handleClose={handleClose} />

      <Drawer open={open} anchor="right">
        <Notification
          onClose={() => {
            setOpen(false);
            notificationCountQuery.refetch();
          }}
        />
      </Drawer>
    </Stack>
  );
}
