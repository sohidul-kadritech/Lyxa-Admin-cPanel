/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { ExpandMore } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';

import { useQuery } from 'react-query';
import { successMsg } from '../../../../../helpers/successMsg';
import * as API_URL from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import ConfirmModal from '../../../../Common/ConfirmModal';
import PhraseList from '../ChatBox/PhraseBox/List';
import CustomeInput from './CustomeInput';

const defaultSx = {
  position: 'absolute',
  bottom: '60px',
  padding: '16px 15px',
  width: '100%',
  height: '0px',
  zIndex: '9999',
  borderRadius: '32px',
  background: '#F6F8FA',
  transition: 'all 0.2s linear',
};

function ResolveBox({ open, onClose, requestId, closeChatMutation }) {
  const [selected, setSelected] = useState({});
  const [messages, setMessages] = useState([]);

  const [otherReason, setOtherReason] = useState('');

  const [isConfirm, setIsConfirm] = useState(false);

  const getAllcancelReason = useQuery(
    [API_URL.ALL_ORDER_CANCEL_REASON, requestId, open],
    () =>
      AXIOS.get(API_URL.ALL_ORDER_CANCEL_REASON, {
        params: { type: 'resolve' },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          console.log('data?.data?.cancelReason', data?.data?.cancelReason);
          let cancelReason = data?.data?.cancelReason || [];
          cancelReason = [...cancelReason, { name: 'other', _id: 'other', type: 'resolve' }];
          setMessages(cancelReason?.map(({ name, type, _id }) => ({ message: name, type, _id })) || []);
        }
      },
    },
  );

  const onSearch = (key) => {
    let cancelReason = getAllcancelReason?.data?.data?.cancelReason || [];
    cancelReason = [...cancelReason, { name: 'other', _id: 'other', type: 'resolve' }];
    const data = cancelReason?.map(({ name, type, _id }) => ({
      message: name,
      type,
      _id,
    }));
    const result = data?.filter((item) => item?.message?.toLowerCase()?.includes(key?.toLowerCase()));
    setMessages(result);
  };

  return (
    <Box
      sx={
        open
          ? { ...defaultSx, minHeight: '350px', opacity: 1 }
          : { ...defaultSx, minHeight: '0px', opacity: 0, visibility: 'hidden', pointerEvents: 'none' }
      }
    >
      <Box>
        <Stack direction="row" alignItems="center">
          <CustomeInput onChange={onSearch} />
          <span style={{ cursor: 'pointer' }} onClick={onClose}>
            <ExpandMore />
          </span>
        </Stack>

        <Box sx={{ height: '150px', overflowY: 'auto' }}>
          <PhraseList
            onSelect={(msg) => {
              setSelected(msg);
              setOtherReason('');
            }}
            selected={selected}
            messages={messages}
          />
        </Box>
        <Box mt={2.5}>
          {selected?._id === 'other' && (
            <CustomeInput
              sx={{
                border: '1px solid #eee',
                padding: '9px',
                borderRadius: '16px',
                background: '#fff',
              }}
              startAdornment={undefined}
              onChange={(value) => setOtherReason(value)}
              placeholder="Enter other reason here ..."
              inputProps={{
                value: otherReason,
              }}
            />
          )}
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" pt={4}>
          <Button
            variant="contained"
            size="small"
            sx={{ minWidth: '100px' }}
            disabled={!selected?._id}
            onClick={() => {
              setIsConfirm(true);
            }}
          >
            Resolve
          </Button>
        </Stack>

        <ConfirmModal
          onCancel={() => setIsConfirm(false)}
          message="Do you want to resolve this chat?"
          isOpen={isConfirm}
          loading={closeChatMutation?.isLoading}
          onConfirm={() => {
            const templateResolve = {
              requestId,
              resolveReason: selected?.message,
            };

            if (selected?._id === 'other' && !otherReason) {
              successMsg('Please provide other reason');
              return;
            }

            if (selected?._id === 'other' && otherReason) {
              templateResolve.resolveReason = otherReason;
              console.log({ templateResolve, otherReason });
              closeChatMutation.mutate(templateResolve);
              return;
            }

            console.log({ templateResolve, otherReason });
            closeChatMutation.mutate(templateResolve);
          }}
        />
      </Box>
    </Box>
  );
}

export default ResolveBox;
