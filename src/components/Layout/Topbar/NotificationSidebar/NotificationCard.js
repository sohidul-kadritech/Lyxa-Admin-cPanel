/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as NotificationIcon } from '../../../../assets/icons/notification-icon.svg';

const notificationCardSx = (theme, isHover) => {
  if (isHover) {
    return {
      padding: 2,
      borderRadius: '7px',
      border: `1px solid ${theme?.palette?.custom?.border}`,
      cursor: 'pointer',
      transition: 'all 0.1s linear',
      '&:hover': {
        background: `rgba(177,177,177,0.3)`,
      },
    };
  }

  return {
    padding: 2,
    borderRadius: '7px',
    border: `1px solid ${theme?.palette?.custom?.border}`,
    cursor: 'default',
  };
};

export const dynamicRedirectingPathForAdmin = (type, order) => {
  const tempReoutes = {
    admin: {
      route: '/orders',
      params: {},
    },
    customerService: {
      route: '/orders',
      params: {},
    },
    shop: {
      route: '/orders',
      params: {},
    },
    sales: {
      route: '/orders',
      params: {},
    },
    accountManager: {
      route: '/orders',
      params: {},
    },
  };

  tempReoutes[type].params = {
    ...tempReoutes[type].params,
    type: 'ongoing',
    errorOrderType: order?.errorOrderType,
    page: 1,
  };

  return tempReoutes[type];
};

const getQueryString = (data) =>
  Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

function NotificationCard({ notification, onClick, onClose }) {
  const theme = useTheme();

  const history = useHistory();

  const onClickHandler = () => {
    const path = dynamicRedirectingPathForAdmin(notification?.accountType, notification?.order);
    history.push({
      pathname: path?.route,
      search: getQueryString(path?.params),
    });

    if (onClose) onClose();
  };
  return (
    <Box
      sx={notificationCardSx(theme, notification?.clickable)}
      onClick={() => {
        if (notification?.clickable) {
          if (onClick) {
            onClick();
            return;
          }
          onClickHandler();
        }
      }}
    >
      <Stack direction="row" alignItems="flex-start" gap={3}>
        <NotificationIcon />
        <Stack flex={1} sx={{ marginTop: '0px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{notification?.title || 'title'}</Typography>
            <Typography variant="body3" sx={{ fontSize: '10px' }}>
              {moment(notification?.updatedAt).calendar() || 'time'}
            </Typography>
          </Stack>
          <Typography variant="bod2">{notification?.description || 'description'}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default NotificationCard;
