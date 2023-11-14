/* eslint-disable no-unused-vars */
import { Email, Logout } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { ReactComponent as Phone } from '../../../assets/icons/phone.svg';

import { ReactComponent as UserIcon } from '../../../assets/icons/user_outline.svg';
import socketServices from '../../../common/socketService';
import getCookiesAsObject from '../../../helpers/cookies/getCookiesAsObject';
import setCookiesAsObject from '../../../helpers/cookies/setCookiesAsObject';
import CustomerServiceOnlineOfflineToggle from '../../../pages/OngoingTickets/CustomerServiceOnlineOfflineToggle';

function CustomerServiceInfoBox({ icon, label, onClickHandler }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2.5}
      onClick={() => {
        if (onClickHandler) {
          onClickHandler();
        }
      }}
    >
      <Stack flex={0.1} sx={{ width: '24px' }} direction="row" justifyContent="center" alignItems="center">
        {icon}
      </Stack>
      <Stack flex={0.9}>
        <Typography variant="h5" sx={{ display: 'flex', direction: 'row', alignItems: 'center' }}>
          {label}
        </Typography>
      </Stack>
    </Stack>
  );
}

function CustomerServiceProfileCardContainer({ children, theme, sx }) {
  return (
    <Box
      sx={{
        padding: '2px 10px',
        backgroundColor: 'rgba(177, 177, 177, 0)',
        transition: 'background-color 0.3s linear',
        cursor: 'default',
        '&:hover': {
          backgroundColor: 'rgba(177, 177, 177, 0.2)',
        },
        ...(sx || {}),
      }}
    >
      {children}
    </Box>
  );
}

function CustomerServiceProfile({ admin, open, onClose }) {
  const theme = useTheme();
  const onClickHandler = (href) => {
    window.location.href = href;
  };

  const _logout = () => {
    const authCookies = getCookiesAsObject();
    setCookiesAsObject(authCookies, 0);
    window.location.reload(true);
    socketServices.close();
  };
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 70,
        right: 40,
        zIndex: 9,
        padding: '8px 0px',
        borderRadius: '10px',
        minWidth: '300px',
        minHeight: open ? '100px' : '0px',
        maxHeight: open ? '250px' : '0px',
        background: '#fff',
        overflow: 'auto',
        border: `1px solid ${theme?.palette?.custom?.border}`,
        opacity: open ? '1' : '0',
        visibility: !open ? 'hidden' : null,
        pointerEvents: !open ? 'none' : null,
        transition: 'all 0.3s linear',
      }}
    >
      <Stack
        gap={1.2}
        sx={{
          position: 'relative',
          width: '100%',
        }}
      >
        <CustomerServiceProfileCardContainer theme={theme}>
          <CustomerServiceInfoBox icon={<UserIcon />} label={admin?.name} />
        </CustomerServiceProfileCardContainer>

        {/* email */}
        <CustomerServiceProfileCardContainer theme={theme}>
          <CustomerServiceInfoBox icon={<Email />} label={admin?.email} />
        </CustomerServiceProfileCardContainer>

        {/* phone */}
        <CustomerServiceProfileCardContainer theme={theme}>
          <CustomerServiceInfoBox icon={<Phone />} label={admin?.phone_number} />
        </CustomerServiceProfileCardContainer>
        <CustomerServiceProfileCardContainer
          theme={theme}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(177, 177, 177, 0.0)',
            },
          }}
        >
          <CustomerServiceOnlineOfflineToggle
            admin={admin}
            sx={{
              justifyContent: 'space-between',
            }}
            sxToggle={{
              width: 40,
              height: 20,
              '& .MuiSwitch-switchBase': {
                margin: '1px 2px 2px 2px',
                '&.Mui-checked': {
                  transform: 'translateX(19px)',
                },
              },
              '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 18,
                height: 18,
              },
            }}
          />
        </CustomerServiceProfileCardContainer>

        <CustomerServiceProfileCardContainer theme={theme}>
          <CustomerServiceInfoBox icon={<Logout />} onClickHandler={_logout} label="Logout" />
        </CustomerServiceProfileCardContainer>
      </Stack>
    </Box>
  );
}

export default CustomerServiceProfile;
