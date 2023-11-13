/* eslint-disable no-unused-vars */
import { Email } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { ReactComponent as Loacation } from '../../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../../assets/icons/phone.svg';

import { ReactComponent as UserIcon } from '../../../assets/icons/user_outline.svg';

function CustomerServiceInfoBox({ icon, label }) {
  return (
    <Typography variant="h5" sx={{ display: 'flex', direction: 'row', alignItems: 'center' }}>
      {icon} {label}
    </Typography>
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

function CustomerServiceProfile({ admin }) {
  const theme = useTheme();

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
        minHeight: '100px',
        maxHeight: '250px',
        background: '#fff',
        overflow: 'auto',
        border: `1px solid ${theme?.palette?.custom?.border}`,
      }}
    >
      <Stack
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
          <CustomerServiceInfoBox icon={<Phone />} label={admin?.email} />
        </CustomerServiceProfileCardContainer>

        {/* location */}
        <CustomerServiceProfileCardContainer theme={theme}>
          <CustomerServiceInfoBox icon={<Loacation />} label={admin?.email} />
        </CustomerServiceProfileCardContainer>
      </Stack>
    </Box>
  );
}

export default CustomerServiceProfile;
