/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CloseButton from '../../Common/CloseButton';
import ConfirmModal from '../../Common/ConfirmModal';

const initialData = {
  requestId: '',
  resolveReason: {},
  otherReason: '',
};
function ResolveChat({ onClose, requestId, closeChatMutation }) {
  const [resolveData, setResolveChatData] = useState({ ...initialData, requestId });
  const [isConfirm, setIsConfirm] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [isOtherReason, setIsOtherReason] = useState(false);
  const getCancelReasonsQuery = useQuery(
    [API_URL.ALL_ORDER_CANCEL_REASON],
    () =>
      AXIOS.get(API_URL.ALL_ORDER_CANCEL_REASON, {
        params: {
          type: 'resolve',
        },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          const holdingFirstReason = data?.data?.cancelReason?.length > 0 ? data?.data?.cancelReason[0] : null;
          setResolveChatData((prev) => ({ ...prev, cancelReasonId: holdingFirstReason }));
        }
      },
    },
  );

  const onResolve = () => {
    if (!resolveData?.requestId) {
      successMsg('Chat not found!');
      return;
    }
    if (!isOtherReason && !resolveData?.resolveReason?._id) {
      successMsg('Select a resolve reason!');
      return;
    }

    if (isOtherReason && !resolveData?.otherReason) {
      successMsg('Write other reasone!');
      return;
    }

    const data = {};
    data.requestId = requestId;

    data.resolveReason = isOtherReason ? resolveData?.otherReason : resolveData?.resolveReason?.name;

    console.log({ data });

    if (closeChatMutation) closeChatMutation?.mutate(data);
  };
  return (
    <Paper
      sx={{
        minWidth: 'max(40vw, 600px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Box padding={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={8}>
          <Typography variant="h3">Reject Chat</Typography>
          <CloseButton
            onClick={() => {
              onClose();
            }}
          />
        </Stack>
        <Stack>
          <Box flex={1}>
            <Typography>What is the reason for resolve the chat?</Typography>
            <Box>
              <Autocomplete
                className="cursor-pointer mt-3"
                disabled={isOtherReason}
                readOnly={isOtherReason}
                value={resolveData.resolveReason}
                onChange={(event, newValue) => {
                  console.log({ newValue });
                  setResolveChatData({
                    ...resolveData,
                    resolveReason: newValue,
                  });
                }}
                getOptionLabel={(option) => (option.name ? option.name : '')}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                inputValue={searchKey}
                onInputChange={(event, newInputValue) => {
                  setSearchKey(newInputValue);
                }}
                id="controllable-states-demo"
                options={getCancelReasonsQuery?.data?.data?.cancelReason || []}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a resolve reason"
                    value={resolveData?.resolveReason}
                    required={!isOtherReason}
                    disabled={isOtherReason}
                    readOnly={isOtherReason}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option?._id}>
                    {option?.name}
                  </Box>
                )}
              />

              <Box className="mt-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOtherReason}
                      onChange={(e) => {
                        setIsOtherReason(e.target.checked);
                        setResolveChatData((prev) => ({ ...prev, resolveReason: {}, otherReason: '' }));
                      }}
                      name="otherReason"
                    />
                  }
                  label="Other reason"
                />
              </Box>
              {isOtherReason && (
                <Box className="mt-2">
                  <TextField
                    type="text"
                    multiline
                    className="form-control"
                    placeholder="Type your other reaoson..."
                    maxRows={4}
                    required={isOtherReason}
                    label="Anything else to add?"
                    value={resolveData.otherReason}
                    onChange={(e) =>
                      setResolveChatData({
                        ...resolveData,
                        otherReason: e.target.value,
                        cancelReason: null,
                      })
                    }
                  />
                </Box>
              )}
            </Box>
          </Box>

          <Stack direction="row" gap={4} justifyContent="flex-end" mt={4}>
            <Button variant="outlined" color="danger" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="danger"
              disabled={closeChatMutation?.isLoading}
              onClick={() => {
                setIsConfirm(true);
              }}
            >
              Resolve chat
            </Button>
          </Stack>
        </Stack>
      </Box>

      <ConfirmModal
        onCancel={() => setIsConfirm(false)}
        message="Do you want to resolve this chat?"
        isOpen={isConfirm}
        loading={closeChatMutation?.isLoading}
        onConfirm={() => {
          onResolve();
        }}
      />
    </Paper>
  );
}

export default ResolveChat;
