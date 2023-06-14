import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import CloseButton from '../../components/Common/CloseButton';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { butlerFlagTypeOptions, orderFlagTypeOptions } from './helpers';

export function UpdateFlag({ currentOrder, onClose }) {
  const [flagType, setFlagType] = useState([]);

  const [flagComment, setFlagComment] = useState('');

  const queryClient = useQueryClient();

  const getFlagOptions = (currentOrder) => {
    const options = currentOrder?.isButler ? butlerFlagTypeOptions : orderFlagTypeOptions;
    const newOptions = [];
    let isAllFlagged = true;

    options.forEach((item) => {
      if (!currentOrder?.deliveryBoy?._id && item.value === 'delivery') {
        return;
      }
      if (currentOrder?.flag?.find((flagItem) => flagItem[item.value])) {
        newOptions.push({
          ...item,
          isDisabled: true,
        });
      } else {
        isAllFlagged = false;
        newOptions.push({
          ...item,
        });
      }
    });

    return {
      options: newOptions,
      isAllFlagged,
    };
  };

  const flagOptions = useMemo(() => getFlagOptions(currentOrder), [currentOrder]);

  const resetFlagModal = () => {
    onClose();
    setFlagType([]);
    setFlagComment('');
  };

  const addFlagMutation = useMutation(
    (payload) => {
      console.log('payload data', payload.data);
      const API = payload.service === 'butler' ? Api.BUTLER_ORDER_ADD_FLAG : Api.SEND_ORDER_FLAG;
      return AXIOS.post(API, payload.data);
    },
    {
      onSuccess: (data) => {
        if (data?.status) {
          queryClient.invalidateQueries(['all-orders']);
          successMsg(data?.message, 'success');
          resetFlagModal();
        } else {
          successMsg(data?.message);
        }
      },
      onError: (error) => {
        successMsg(error?.message);
        console.log('api error: ', error);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const addOrderFlag = () => {
    console.log('triggerring order flaggin');
    if (flagComment.trim() === '') {
      successMsg('Comment cannot be empty');
      return;
    }

    if (flagType.length === 0) {
      successMsg('Please select someone to flag');
      return;
    }

    const data = {};
    data.orderId = currentOrder?._id;
    data.comment = flagComment.trim();

    flagType.forEach((item) => {
      if (item === 'user') {
        data.user = currentOrder?.user?._id;
      }
      if (item === 'delivery') {
        data.delivery = currentOrder?.deliveryBoy?._id;
      }
      if (item === 'shop') {
        data.shop = currentOrder?.shop?._id;
      }
    });

    console.log('add flag: ', { service: currentOrder?.isButler ? 'butler' : 'regular', data });

    addFlagMutation.mutate({ service: currentOrder?.isButler ? 'butler' : 'regular', data });
  };

  const handleFlagTypeChange = (value) => {
    if (flagType.includes(value)) {
      setFlagType((prev) => prev.filter((val) => val !== value));
    } else {
      setFlagType((prev) => [...prev, value]);
    }
  };

  return (
    <Paper
      sx={{
        minWidth: 'max(35vw, 450px)',
      }}
    >
      <Box padding={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={6}>
          <Typography variant="h3">Add Flag</Typography>
          <CloseButton
            onClick={() => {
              resetFlagModal();
            }}
          />
        </Stack>
        {flagOptions.isAllFlagged ? (
          <Stack spacing={3} mb={4}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
              }}
            >
              Everyone is already flagged!
            </Typography>
            <Typography variant="body2">Please check order details</Typography>
          </Stack>
        ) : (
          <Stack spacing={6}>
            <Stack direction="row" spacing={5} alignItems="center">
              <Typography variant="h5">Choose Type</Typography>
              <OptionsSelect value={flagType} items={flagOptions.options} onChange={handleFlagTypeChange} multiple />
            </Stack>
            <TextField
              label="Comment"
              variant="outlined"
              fullWidth
              value={flagComment}
              onChange={(e) => {
                setFlagComment(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={addFlagMutation.isLoading}
              fullWidth
              onClick={() => {
                addOrderFlag();
              }}
            >
              Update
            </Button>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
