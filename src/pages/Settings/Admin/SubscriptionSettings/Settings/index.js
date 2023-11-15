/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Drawer, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { successMsg } from '../../../../../helpers/successMsg';
import * as API_URL from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import EditSubscription from './EditSubscription';
import Table from './Table';

export const initialData = {
  subscriptionPackage: 'monthly', // "monthly", "yearly"
  subscriptionFee: 10,
  status: 'active', // "active", "inactive"
};

function Settings() {
  const queryClient = useQueryClient();

  const [sidebar, setSidebar] = useState(false);
  const [editField, setEditField] = useState({});

  const getSubscriptionQuery = useQuery([API_URL.SUBSCRIPTION_SETTINGS], () =>
    AXIOS.get(API_URL.SUBSCRIPTION_SETTINGS),
  );

  const updateSubscriptionSettingsQuery = useMutation(
    (data) => AXIOS.post(API_URL.SUBSCRIPTION_SETTINGS_EDIT, { ...data?.body }),
    {
      onSuccess: (data, payload) => {
        queryClient.invalidateQueries(API_URL.SUBSCRIPTION_SETTINGS);
        console.log('payload', payload);
        if (data?.status) {
          if (!payload?.isToggled) successMsg(data?.message, 'success');
          setSidebar(false);
          setEditField({});
        } else {
          successMsg(data?.message);
        }
      },
      onError: (error) => {
        successMsg(error?.message);
      },
    },
  );

  const onEdit = (row) => {
    setEditField(row);
    setSidebar(true);
  };

  const updateField = (row, isToggled = false) => {
    updateSubscriptionSettingsQuery.mutate({ body: { ...row }, isToggled });
  };

  return (
    <Stack>
      <Typography variant="h6" fontWeight={700} pb={5} textTransform="capitalize">
        Subscription Info
      </Typography>

      <Table
        onEdit={onEdit}
        onStatusChange={updateField}
        loading={getSubscriptionQuery?.isLoading}
        rows={getSubscriptionQuery?.data?.data?.subscriptionSetting || []}
      />

      <Drawer open={Boolean(sidebar)} anchor="right">
        <EditSubscription
          loading={updateSubscriptionSettingsQuery.isLoading}
          editField={editField}
          updateField={updateField}
          onClose={() => {
            setSidebar(false);
            setEditField({});
          }}
        />
      </Drawer>
    </Stack>
  );
}

export default Settings;
