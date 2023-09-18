/* eslint-disable no-unused-vars */
import { Box, Button, Modal, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../../helpers/successMsg';
import * as API_URL from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import CloseButton from '../../../Common/CloseButton';
import StyledFormField from '../../../Form/StyledFormField';
import PayoutAddRemoveCredit from './PayoutAddRemoveCredit';

const initRevokePayout = {
  payoutId: '',
  payoutRevokedReason: '',
};

function RevokePayout({ onClose, payout, closeVeiw }) {
  const [revokePayout, setRevokePayout] = useState({ ...initRevokePayout, payoutId: payout?._id });
  const [addRemoveCreditOpen, setAddRemoveCredit] = useState(false);

  const queryClient = useQueryClient();

  const revokePayoutQuery = useMutation((data) => AXIOS.post(API_URL.REVOKE_PAYOUTS, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data?.message, 'success');
        queryClient.invalidateQueries(API_URL.GET_PAYOUTS);
        onClose();
        closeVeiw();
      } else {
        successMsg(data?.message, 'warn');
      }
    },
  });

  const onSubmitRevoke = () => {
    if (!revokePayout?.payoutId) {
      successMsg('Payout Id is missing');
      return;
    }
    if (!revokePayout?.payoutRevokedReason) {
      successMsg('Payout revoked reason is missing');
      return;
    }

    revokePayoutQuery.mutate(revokePayout);
  };

  return (
    <Paper
      sx={{
        minWidth: 'max(35vw, 550px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
        background: '#fff',
        borderRadius: '12px',
      }}
    >
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid #eee"
          sx={{ padding: '20px 25px' }}
        >
          <Typography variant="h3">Confirm Revoke</Typography>
          <CloseButton
            onClick={() => {
              onClose();
            }}
          />
        </Stack>

        <Stack sx={{ padding: '18px 25px 31px 25px' }}>
          <Typography variant="body2" fontSize="16px" color="text.secondary">
            Are you sure you want to revoke access?
          </Typography>

          <StyledFormField
            label="Reason"
            intputType="text"
            inputProps={{
              value: revokePayout?.payoutRevokedReason || '',
              placeholder: 'Enter revoke reason here ...',
              onChange: (e) => {
                setRevokePayout((prev) => ({
                  ...prev,
                  payoutRevokedReason: e.target.value,
                }));
              },
            }}
          />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              variant="text"
              color="primary"
              disableRipple
              onClick={() => {
                setAddRemoveCredit(true);
              }}
            >
              Add/Remove Credit
            </Button>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
              <Button
                variant="text"
                color="primary"
                disableRipple
                onClick={() => {
                  onClose();
                }}
              >
                Discard
              </Button>
              <Button
                disabled={revokePayoutQuery?.isLoading}
                variant="contained"
                color="primary"
                onClick={onSubmitRevoke}
              >
                Confirm
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Modal open={addRemoveCreditOpen}>
        <PayoutAddRemoveCredit
          payout={payout}
          closeVeiw={() => {
            closeVeiw();
            onClose();
          }}
          onClose={() => {
            setAddRemoveCredit(false);
          }}
        />
      </Modal>
    </Paper>
  );
}

export default RevokePayout;
