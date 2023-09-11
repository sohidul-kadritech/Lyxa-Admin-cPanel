/* eslint-disable no-unused-vars */
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ConfirmModal from '../../../../components/Common/ConfirmModal';
import { successMsg } from '../../../../helpers/successMsg';
import * as API_URL from '../../../../network/Api';
import AXIOS from '../../../../network/axios';

import OverDuePeriod from './OverDuePeriod';
import SettingsForFirstDayOfWeek from './SettingsForFirstDayOfWeek';

export const boxSx2 = {
  padding: '32px 56px 21px 30px',
  borderRadius: '7px',
  width: '100%',
  color: '#000',
  backgroundColor: '#ffffff',
  marginBottom: '22px',
};

const initialData = {
  firstDayOfWeek: 0,
  overDuePeriod: 0,
  payoutType: [],
};

function PageSkeleton() {
  return (
    <Stack mt={7.5} direction="row" alignItems="center" gap={19.5} width="100%">
      <Stack flex={1} width="100%" gap={4}>
        <Skeleton flex={1} height={20} width="200px" sx={{ borderRadius: '24px' }} />
        <Skeleton flex={1} height={50} width="100%" sx={{ borderRadius: '24px' }} />
      </Stack>
      <Stack flex={1} width="100%" gap={4}>
        <Skeleton flex={1} height={20} width="200px" sx={{ borderRadius: '24px' }} />
        <Skeleton flex={1} height={50} width="100%" sx={{ borderRadius: '24px' }} />
      </Stack>
    </Stack>
  );
}

function Settings() {
  const [settings, setSettings] = useState({ ...initialData });

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const getPayoutsQuery = useQuery([API_URL.PAYOUT_SETTINGS], () => AXIOS.get(API_URL.PAYOUT_SETTINGS), {
    onSuccess: (data) => {
      if (data?.status) {
        const payoutSettings = data?.data?.payoutSetting;
        delete payoutSettings._id;
        delete payoutSettings?.createdAt;
        delete payoutSettings?.updatedAt;
        delete payoutSettings?._v;

        setSettings((prev) => ({ ...prev, ...payoutSettings, payoutType: [] }));
      }
    },
  });

  const editPayoutQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_PAYOUT_SETTINGS, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data?.message, 'success');
        queryClient.invalidateQueries(API_URL.PAYOUT_SETTINGS);
      } else {
        successMsg(data?.message, 'success');
      }
    },
  });

  const populatePayoutData = () => {
    setSettings((prev) => ({ ...prev, ...getPayoutsQuery?.data?.data?.payoutSetting, payoutType: [] }));
  };

  const onSubmitPayoutData = () => {
    editPayoutQuery.mutate(settings);
  };

  return (
    <Stack sx={boxSx2}>
      <Box>
        <Typography variant="h4">Properties</Typography>
      </Box>

      {!getPayoutsQuery?.isLoading ? (
        <Stack mt={7.5} direction="row" alignItems="center" gap={19.5}>
          <SettingsForFirstDayOfWeek setSettings={setSettings} settings={settings} sx={{ flex: 1 }} />
          <OverDuePeriod setSettings={setSettings} settings={settings} sx={{ flex: 1 }} />
        </Stack>
      ) : (
        <PageSkeleton />
      )}
      <Stack mt={8} direction="row" alignItems="center" gap={4} justifyContent="end">
        <Button
          disabled={editPayoutQuery?.isLoading}
          variant="outlined"
          color="primary"
          onClick={() => {
            if (settings?.payoutType?.length) {
              setOpen(true);
              return;
            }
            successMsg('Please make some changes first');
          }}
        >
          Discard
        </Button>
        <Button
          disabled={editPayoutQuery?.isLoading}
          variant="contained"
          color="primary"
          onClick={() => {
            if (settings?.payoutType?.length) {
              onSubmitPayoutData();
              return;
            }
            successMsg('Please make some changes first');
          }}
        >
          Save Changes
        </Button>
      </Stack>

      <ConfirmModal
        message="Do you want to discard this settings?"
        isOpen={open}
        onCancel={() => {
          setOpen(false);
        }}
        onConfirm={() => {
          populatePayoutData();
          setOpen(false);
        }}
      />
    </Stack>
  );
}

export default Settings;
