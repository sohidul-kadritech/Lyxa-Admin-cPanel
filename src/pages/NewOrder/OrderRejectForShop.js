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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CloseButton from '../../components/Common/CloseButton';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

const initialData = {
  refundType: 'full',
  orderId: '',
  cancelReasonId: null,
  otherReason: '',
};

function OrderRejectForShop({ currentOrder, setCurrentOrder, onClose, onSuccess, refetchApiKey }) {
  const queryClient = useQueryClient();

  const [rejectionData, setRejectionData] = useState({ ...initialData, orderId: currentOrder?._id });
  const [isOtherReason, setIsOtherReason] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const getCancelReasonsQuery = useQuery(
    [Api.ALL_ORDER_CANCEL_REASON],
    () =>
      AXIOS.get(Api.ALL_ORDER_CANCEL_REASON, {
        params: {
          type: 'shopCancel',
        },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          console.log('data?.data?.cancelReason', data?.data?.cancelReason);
          const holdingFirstReason = data?.data?.cancelReason?.length > 0 ? data?.data?.cancelReason[0] : null;
          setRejectionData((prev) => ({ ...prev, cancelReasonId: holdingFirstReason }));
        }
      },
    },
  );

  const cancelOrderByShopAdminMutation = useMutation(
    (data) =>
      AXIOS.post(Api.CANCEL_ORDER, data, {
        params: {
          userType: 'shop',
        },
      }),
    {
      onSuccess: (data) => {
        console.log('data response: ', data);
        if (data.status) {
          if (onSuccess) onSuccess(data);
          successMsg(data.message, 'success');
          console.log('data status true');
          onClose();
          queryClient.invalidateQueries(refetchApiKey);
        } else {
          successMsg(data.message, 'error');
        }
      },
    },
  );

  const onRejectOrder = () => {
    console.log('rejectionData', rejectionData);

    if (!rejectionData?.orderId) {
      successMsg('Order not found!');
      return;
    }

    if (!rejectionData?.cancelReasonId && !rejectionData?.otherReason) {
      successMsg('Provide your reason!');
    }

    cancelOrderByShopAdminMutation.mutate({
      ...rejectionData,
      cancelReasonId: rejectionData?.cancelReasonId?._id,
    });
  };

  return (
    <Paper
      sx={{
        minWidth: 'max(35vw, 550px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
        background: '#fff',
      }}
    >
      <Box sx={{ padding: 5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3">Reject Order</Typography>
          <CloseButton
            onClick={() => {
              onClose();
            }}
          />
        </Stack>
        <Stack>
          <Box flex={1}>
            <Typography>What is the reason for rejecting the orders?</Typography>
            <Box>
              <Autocomplete
                className="cursor-pointer mt-3"
                disabled={isOtherReason}
                value={rejectionData.cancelReasonId}
                onChange={(event, newValue) => {
                  setRejectionData({
                    ...rejectionData,
                    cancelReasonId: newValue,
                    otherReason: '',
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
                    label="Select a reject reason"
                    value={rejectionData.cancelReasonId}
                    required={!isOtherReason}
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
                      onChange={(e) => setIsOtherReason(e.target.checked)}
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
                    value={rejectionData.otherReason}
                    onChange={(e) =>
                      setRejectionData({
                        ...rejectionData,
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
              disabled={cancelOrderByShopAdminMutation?.isLoading}
              onClick={onRejectOrder}
            >
              Reject Order
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

export default OrderRejectForShop;
