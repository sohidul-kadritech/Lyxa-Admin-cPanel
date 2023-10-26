/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { ReactComponent as NotificationIcon } from '../../../../assets/icons/notification-icon.svg';

const notificationCardSx = (theme, isHover) => {
  if (isHover) {
    return {
      padding: 2,
      borderRadius: '7px',
      border: `1px solid ${theme?.palette?.custom?.border}`,
      cursor: 'pointer',
      transition: 'all 0.3s ease-in',
      '&:hover': {
        background: `rgba(177,177,177,0.1)`,
      },
    };
  }

  return {
    padding: 2,
    borderRadius: '7px',
    border: `1px solid ${theme?.palette?.custom?.border}`,
    cursor: 'pointer',
  };
};

export const dynamicRedirectingPathForAdmin = (accountType) => 'hello';

function NotificationCard({ notification, onClick }) {
  const theme = useTheme();
  return (
    <Box
      sx={notificationCardSx(theme, notification?.clickable)}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <Stack direction="row" alignItems="flex-start" gap={3}>
        <NotificationIcon />
        <Stack flex={1} sx={{ marginTop: '0px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{notification?.title || 'title'}</Typography>
            <Typography variant="body3">{moment(notification?.updatedAt).calendar() || 'time'}</Typography>
          </Stack>
          <Typography variant="bod2">{notification?.description || 'description'}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default NotificationCard;
