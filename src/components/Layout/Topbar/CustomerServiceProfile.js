/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { Edit, Email, Logout } from '@mui/icons-material';
import { Avatar, Box, Drawer, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as Phone } from '../../../assets/icons/phone.svg';

import { ReactComponent as UserIcon } from '../../../assets/icons/user_outline.svg';
import socketServices from '../../../common/socketService';
import { useGlobalContext } from '../../../context';
import getCookiesAsObject from '../../../helpers/cookies/getCookiesAsObject';
import setCookiesAsObject from '../../../helpers/cookies/setCookiesAsObject';
import CustomerServiceOnlineOfflineToggle from '../../../pages/OngoingTickets/CustomerServiceOnlineOfflineToggle';
import EditAdminProfile from '../../../pages/SalesManagerDashBoard/EditAdminProfile';
import StyledIconButton from '../../Styled/StyledIconButton';
import { getProfilePhotoAndAltName } from '../helper';

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

  const [openEdit, setOpenEdit] = useState(false);

  const { currentUser } = useGlobalContext();

  const { profilePhoto, altName } = getProfilePhotoAndAltName(currentUser, currentUser?.userType);

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
        zIndex: 999999,
        padding: '8px 0px',
        borderRadius: '10px',
        minWidth: '300px',
        minHeight: open ? '100px' : '0px',
        maxHeight: open ? '350px' : '0px',
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
        <CustomerServiceProfileCardContainer
          theme={theme}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(177, 177, 177, 0.0)',
            },
          }}
        >
          <Stack justifyContent="center" alignItems="center">
            <Box sx={{ position: 'relative', top: 0 }}>
              <Avatar src={profilePhoto} alt="profile_photo" sx={{ width: '70px', height: '70px' }}>
                {altName}
              </Avatar>
              <Box sx={{ position: 'absolute', bottom: 4, right: 4 }}>
                <StyledIconButton
                  sx={{
                    backgroundColor: '#E4E6EB',
                    padding: '9px 9px 11px 9px',
                    borderRadius: '50%!important',
                    width: '28px',
                    height: '28px',
                    '&:hover': {
                      backgroundColor: 'background.secondaryHover',
                    },
                  }}
                  onClick={() => {
                    setOpenEdit(true);
                    onClose();
                  }}
                >
                  <Edit />
                </StyledIconButton>
              </Box>
              {/* <Box sx={{ position: 'absolute', top: -4, left: 4 }}>
                <Tooltip title={<span style={{ textTransform: 'capitalize' }}>{admin?.liveStatus}</span>}>
                  <Box
                    sx={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: admin?.liveStatus === 'online' ? statusColor?.green : statusColor?.orange,
                    }}
                  />
                </Tooltip>
              </Box> */}
            </Box>
          </Stack>
        </CustomerServiceProfileCardContainer>
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

        {/* edit profile */}
        {/* <CustomerServiceProfileCardContainer theme={theme}>
          <CustomerServiceInfoBox icon={<Edit />} onClickHandler={() => setOpenEdit(true)} label="Edit Profile" />
        </CustomerServiceProfileCardContainer> */}

        {/* logout */}
        <CustomerServiceProfileCardContainer
          theme={theme}
          sx={{
            cursor: 'pointer !important',
          }}
        >
          <CustomerServiceInfoBox icon={<Logout />} onClickHandler={_logout} label="Logout" />
        </CustomerServiceProfileCardContainer>
      </Stack>

      <Drawer anchor="right" open={openEdit}>
        <EditAdminProfile
          isEdit
          currentAdmin={admin}
          onClose={() => {
            setOpenEdit(false);
          }}
          adminType="customerService"
        />
      </Drawer>
    </Box>
  );
}

export default CustomerServiceProfile;
