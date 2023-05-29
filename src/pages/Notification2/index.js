import { Box, Drawer, Stack, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
// eslint-disable-next-line import/no-named-as-default
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import DateRange from '../../components/StyledCharts/DateRange';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { AddMenuButton } from '../Faq2';
import { dateRangeInit } from '../Faq2/helpers';
import AddNotification from './AddNotification';
import NotificationList from './NotificationList';
import TablePageSkeleton from './TablePageSkeleton';
import { accountTypeOptionsFilter, activeStatusOptions, notificationTypeOptionsFilter } from './helpers';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/',
  },
  {
    label: 'Notifications',
    to: '#',
  },
];
function Notification() {
  const theme = useTheme();
  const [range, setRange] = useState({ ...dateRangeInit });

  const [open, setOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState('all');

  // eslint-disable-next-line no-unused-vars
  const [accountType, setAccountType] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState('');
  // eslint-disable-next-line no-unused-vars

  const [searchKey, setSearchKey] = useState('');

  const queryClient = useQueryClient();

  const getAllNotifications = useQuery(
    [API_URL.GET_NOTIFICATIONS, { status, accountType, type, startDate: range.start, endDate: range.end, searchKey }],
    () =>
      AXIOS.get(API_URL.GET_NOTIFICATIONS, {
        params: {
          searchKey,
          status,
          accountType,
          type,
          startDate: range.start,
          endDate: range.end,
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  // eslint-disable-next-line no-unused-vars
  const sendNotificationQuery = useMutation((data) => AXIOS.post(API_URL.CREATE_NOTIFICATION, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Successfully Added', 'success');
        queryClient.invalidateQueries(API_URL.GET_NOTIFICATIONS);
        setOpen(false);
      } else {
        successMsg('Something Went Wrong!');
      }
    },
  });
  // eslint-disable-next-line no-unused-vars
  const deleteNotificationQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_NOTIFICATION_STATUS, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg('Successfully Deleted', 'success');
        queryClient.invalidateQueries(API_URL.GET_NOTIFICATIONS);
        setIsConfirm(false);
      } else {
        successMsg('Something went wrong!');
      }
    },
  });

  console.log('getAllNotificatoins: ', getAllNotifications?.data?.data?.notifications);

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
        <DateRange range={range} setRange={setRange} />
        <StyledFormField
          intputType="select"
          containerProps={{
            sx: { padding: '0px 0px' },
          }}
          inputProps={{
            name: 'status',
            placeholder: 'Status',
            value: status,
            items: activeStatusOptions,
            size: 'sm2',
            //   items: categories,
            onChange: (e) => setStatus(e.target.value),
          }}
        />
        <StyledFormField
          intputType="select"
          containerProps={{
            sx: { padding: '0px 0px' },
          }}
          inputProps={{
            name: 'accountType',
            placeholder: 'Account Type',
            value: accountType,
            items: accountTypeOptionsFilter,
            size: 'sm2',
            //   items: categories,
            onChange: (e) => setAccountType(e.target.value),
          }}
        />
        <StyledFormField
          intputType="select"
          containerProps={{
            sx: { padding: '0px 0px' },
          }}
          inputProps={{
            name: 'type',
            placeholder: 'Notification Type',
            value: type,
            items: notificationTypeOptionsFilter,
            size: 'sm2',
            //   items: categories,
            onChange: (e) => setType(e.target.value),
          }}
        />

        <AddMenuButton
          onClick={() => {
            setOpen(() => true);
          }}
        />
      </Stack>

      <Box
        sx={{
          border: `1px solid ${theme.palette.custom.border}`,
          padding: '20px',
          borderRadius: '7px',
          maxHeight: '700px',
          overflow: 'auto',
        }}
      >
        {getAllNotifications.isLoading ? (
          <TablePageSkeleton column={5} row={6} />
        ) : (
          <NotificationList
            data={getAllNotifications?.data?.data?.notifications}
            loading={getAllNotifications.isLoading}
            deleteQuery={deleteNotificationQuery}
            isConfirm={isConfirm}
            setIsConfirm={setIsConfirm}
          />
        )}
      </Box>

      <Drawer open={open} anchor="right">
        <AddNotification
          onClose={() => {
            setOpen(false);
          }}
          sendNotificationQuery={sendNotificationQuery}
          deleteNotificationQuery={deleteNotificationQuery}
        />
      </Drawer>
    </Box>
  );
}

export default Notification;
