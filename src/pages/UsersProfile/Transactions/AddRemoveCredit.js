import { Box, Button, Stack, Typography } from '@mui/material';
import { React, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CloseButton from '../../../components/Common/CloseButton';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const getDataInit = (userId) => ({ userId, amount: 0, adminNote: '', userNote: '' });

const typeOptions = [
  { label: 'Remove', value: 'remove' },
  { label: 'Add', value: 'add' },
];

export default function AddRemoveCredit({ userId, onClose }) {
  const queryClient = useQueryClient();
  const [data, setData] = useState(getDataInit(userId));
  const [maxValue, setMaxValue] = useState(null);

  const settingsQuery = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS), {
    onSuccess: (data) => {
      setMaxValue(data?.data?.appSetting?.maxCustomerServiceValue);
    },
  });

  const creditMutation = useMutation((data) => AXIOS.post(Api.ADD_USER_BALANCE, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries([Api.DROP_PAY_LIST, { userId }]);
        onClose();
      }
    },
  });

  const addRemoveCredit = () => {
    if (data?.amount < 0) {
      successMsg("Amount can't be negative", 'error');
      return;
    }

    if (data?.amount > maxValue) {
      successMsg(`Amount can't be more than ${maxValue}`, 'error');
      return;
    }

    if (!data?.userNote) {
      successMsg('Must add user note', 'error');
      return;
    }

    creditMutation.mutate(data);
  };

  useEffect(() => {
    setMaxValue(settingsQuery?.data?.data?.appSetting?.maxCustomerServiceValue || null);
  }, []);

  return (
    <Box
      sx={{
        background: '#fff',
        padding: '15px 20px 20px 20px',
        borderRadius: '7px',
        minWidth: '700px',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
        <Typography fontSize="18px" variant="h4">
          Add / Remove Credit
        </Typography>
        <CloseButton onClick={onClose} size="sm" />
      </Stack>
      <Box>
        <Box pb={3}>
          <StyledRadioGroup
            sx={{
              flexDirection: 'row',
              gap: '25px',
            }}
            items={typeOptions}
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
          />
        </Box>
        <StyledFormField
          label="Amount *"
          intputType="text"
          inputProps={{
            type: 'number',
            value: data.amount,
            onChange: (e) => {
              if (e.target.value > 0) setData({ ...data, amount: e.target.value });
              else setData({ ...data, amount: 1 });
            },
          }}
        />
        <StyledFormField
          label="Admin note"
          intputType="textarea"
          inputProps={{
            multiline: true,
            value: data.desc,
            onChange: (e) => setData({ ...data, adminNote: e.target.value }),
          }}
        />
        <StyledFormField
          label="User note *"
          intputType="textarea"
          inputProps={{
            multiline: true,
            value: data.desc,
            onChange: (e) => setData({ ...data, userNote: e.target.value }),
          }}
        />
        <Stack direction="row" alignItems="center" justifyContent="flex-end" pt={6.5}>
          <Button
            color="primary"
            variant="contained"
            sx={{ width: '200px' }}
            onClick={addRemoveCredit}
            disabled={creditMutation.isLoading || maxValue === null}
          >
            Pay
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
