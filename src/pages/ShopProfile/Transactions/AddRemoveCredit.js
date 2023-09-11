/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography } from '@mui/material';
import { React, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import CloseButton from '../../../components/Common/CloseButton';
import OptionsSelect from '../../../components/Filter/OptionsSelect';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const getDataInit = (shopId) => ({ shopId, amount: '', type: 'remove', desc: '', secondaryCurrency_amount: '' });

const typeOptions = [
  { label: 'Remove', value: 'remove' },
  { label: 'Add', value: 'add' },
];

export const currencyOptions = (baseCurrency, secondaryCurrency, secondaryEnabled) => {
  const baseCode = baseCurrency?.code;
  const secondaryode = secondaryCurrency?.code;

  if (secondaryEnabled) {
    return [
      { label: baseCode, value: 'baseCurrency' },
      { label: secondaryode, value: 'secondaryCurrency' },
    ];
  }

  return [{ label: baseCode, value: 'baseCurrency' }];
};

export default function AddRemoveCredit({ shopId, onClose, dropAmount, shopAmount, storeAppSettings }) {
  const adminExchangeRate = storeAppSettings?.adminExchangeRate;

  const secondaryEnabled = adminExchangeRate > 0;

  const secondaryCurrency = storeAppSettings?.secondaryCurrency;

  const baseCurrency = storeAppSettings?.baseCurrency;

  const [selectedCurrency, setSelectedCurrency] = useState('baseCurrency');

  const queryClient = useQueryClient();
  const [data, setData] = useState(getDataInit(shopId));

  const creditMutation = useMutation((data) => AXIOS.post(Api.SHOP_ADD_REMOVE_CREDIT, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries([Api.SHOP_TRX, { shopId }]);
        queryClient.invalidateQueries(Api.GET_SHOP_DASHBOARD_SUMMARY);
        onClose();
      }
    },
  });

  const addRemoveCredit = () => {
    if (Number.isNaN(Number(data?.amount))) {
      successMsg('Please enter valid amount', 'error');
      return;
    }

    if (Number(data?.amount) <= 0) {
      successMsg("Base amount can't be negative", 'error');
      return;
    }

    if (data.type === 'add' && Number(data.amount) > dropAmount) {
      successMsg("You don't have enough credit", 'error');
      return;
    }

    if (data.type === 'remove' && Number(data.amount) > shopAmount) {
      successMsg("Shop doesn't have enough credit", 'error');
      return;
    }

    creditMutation.mutate(data);
  };

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
        <Box py={3}>
          <OptionsSelect
            value={selectedCurrency}
            sx={{ padding: '8px 10px' }}
            gapSx={3}
            items={currencyOptions(baseCurrency, secondaryCurrency, secondaryEnabled)}
            onChange={(value) => setSelectedCurrency(value)}
          />
        </Box>

        {selectedCurrency === 'baseCurrency' && (
          <StyledFormField
            label="Base Amount *"
            intputType="text"
            inputProps={{
              type: 'number',
              value: data.amount,
              onChange: (e) => {
                setData({ ...data, amount: e.target.value });
              },
            }}
          />
        )}

        {selectedCurrency === 'secondaryCurrency' && (
          <StyledFormField
            label="Secondary Amount *"
            intputType="text"
            inputProps={{
              type: 'number',
              value: data.secondaryCurrency_amount,
              onChange: (e) => {
                if (e.target.value > 0) setData({ ...data, secondaryCurrency_amount: e.target.value });
                else setData({ ...data, secondaryCurrency_amount: 1 });
              },
            }}
          />
        )}

        <StyledFormField
          label="Description"
          intputType="textarea"
          inputProps={{
            multiline: true,
            value: data.desc,
            onChange: (e) => setData({ ...data, desc: e.target.value }),
          }}
        />
        <Stack direction="row" alignItems="center" justifyContent="flex-end" pt={6.5}>
          <Button
            color="primary"
            variant="contained"
            sx={{ width: '200px' }}
            onClick={addRemoveCredit}
            disabled={creditMutation.isLoading}
          >
            Pay
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
