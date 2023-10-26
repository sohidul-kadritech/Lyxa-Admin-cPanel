/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Stack, Typography, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import * as API_URL from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import SidebarContainer from '../../../Common/SidebarContainerSm';
import NotificationCard from './NotificationCard';
import NotificationSekeleton from './NotificationSekeleton';

const initializeParams = {
  // page: 5,
  // pageSize: 10,
  sortBy: 'desc',
};

function Notification({ onClose }) {
  const specificElementRef = useRef();
  const [queryParams, setQueryParams] = useState(initializeParams);
  const theme = useTheme();

  const notificationQuery = useQuery(
    [API_URL.GET_UNSEEN_NOTIFICATIONS, { ...queryParams }],
    () =>
      AXIOS.get(API_URL.GET_UNSEEN_NOTIFICATIONS, {
        params: queryParams,
      }),
    {
      refetchOnMount: true,
    },
  );

  return (
    <SidebarContainer title="Notificaion" onClose={onClose}>
      {notificationQuery?.isLoading ? (
        <NotificationSekeleton />
      ) : (
        <Stack gap={2.5} ref={specificElementRef} sx={{ paddingBottom: '40px' }}>
          {notificationQuery?.data?.data?.notifications?.map((notification, i) => (
            <NotificationCard key={i} notification={notification} onClose={onClose} />
          ))}

          {!notificationQuery?.data?.data?.notifications?.length && (
            <Stack sx={{ padding: 2, borderRadius: '7px', border: `1px solid ${theme.palette.custom.border}` }}>
              <Typography variant="h5">No notification found</Typography>
            </Stack>
          )}
        </Stack>
      )}
    </SidebarContainer>
  );
}

export default Notification;
