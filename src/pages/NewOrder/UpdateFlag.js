import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import CloseButton from '../../components/Common/CloseButton';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import { successMsg } from '../../helpers/successMsg';

function UpdateFlag({ resetFlagModal, flagOptions, flagType, ...props }) {
  const addOrderFlag = () => {
    console.log('triggerring order flaggin');
    if (props?.flagComment.trim() === '') {
      successMsg('Comment cannot be empty');
      return;
    }

    if (flagType.length === 0) {
      successMsg('Please select someone to flag');
      return;
    }

    const data = {};
    data.orderId = props?.currentOrder?._id;
    data.comment = props?.flagComment.trim();

    flagType.forEach((item) => {
      if (item === 'user') {
        data.user = props?.currentOrder?.user?._id;
      }
      if (item === 'delivery') {
        data.delivery = props?.currentOrder?.deliveryBoy?._id;
      }
      if (item === 'shop') {
        data.shop = props?.currentOrder?.shop?._id;
      }
    });

    console.log('add flag: ', { service: props?.currentOrder?.isButler ? 'butler' : 'regular', data });

    props?.addFlagMutation.mutate({ service: props?.currentOrder?.isButler ? 'butler' : 'regular', data });
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
              <OptionsSelect
                value={flagType}
                items={flagOptions.options}
                onChange={props?.handleFlagTypeChange}
                multiple
              />
            </Stack>
            <TextField
              label="Comment"
              variant="outlined"
              fullWidth
              value={props?.flagComment}
              onChange={(e) => {
                props?.setFlagComment(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={props?.addFlagMutation.isLoading}
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

export default UpdateFlag;
