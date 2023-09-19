/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Button, Stack, Typography } from '@mui/material';
import { isNumber } from 'lodash';
import { React, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import CloseButton from '../../../components/Common/CloseButton';
import OptionsSelect from '../../../components/Filter/OptionsSelect';
import StyledFormField from '../../../components/Form/StyledFormField';
import { currencyOptions } from '../../../components/Shared/GlobalAddRemoveCredit';
import { formatNumber, stringToNumber } from '../../../components/Shared/GlobalAddRemoveCredit/helpers';
import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const getDataInit = (userId) => ({
  userId,
  amount: '',
  secondaryCurrency_amount: '',
  adminNote: '',
  userNote: '',
  paidCurrency: 'baseCurrency',
});

const typeOptions = [
  { label: 'Add', value: 'add' },
  { label: 'Remove', value: 'remove' },
];

export const currencyTypeOptions = [
  { label: 'Base Currency', value: 'baseCurrency' },
  { label: 'Secondary Currency', value: 'secondaryCurrency' },
];

export default function AddRemoveCredit({ userId, onClose }) {
  const queryClient = useQueryClient();

  const [data, setData] = useState(getDataInit(userId));
  const [type, setType] = useState('add');

  const { general } = useGlobalContext();
  const { appSetting } = general;
  const { secondaryCurrency, adminExchangeRate, baseCurrency } = appSetting;

  const isSecondaryCurrencyEnabled = adminExchangeRate > 0;
  const max = appSetting?.maxCustomerServiceValue;

  const creditMutation = useMutation(
    (data) => {
      const api = type === 'add' ? Api.ADD_USER_BALANCE : Api.REMOVE_USER_BALANCE;
      return AXIOS.post(api, data);
    },
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : undefined);

        if (data?.status) {
          queryClient.invalidateQueries([Api.DROP_PAY_LIST, { userId }]);
          onClose();
        }
      },
    },
  );

  const addRemoveCredit = () => {
    if (Number.isNaN(Number(data?.amount))) {
      successMsg('Please enter valid amount', 'error');
      return;
    }

    if (data?.amount <= 0) {
      successMsg('Please enter valid amount', 'error');
      return;
    }

    if (data?.amount >= max) {
      successMsg(`Base currency amount can't be more than ${max}`, 'error');
      return;
    }

    if (Number.isNaN(Number(data?.secondaryCurrency_amount))) {
      successMsg('Please enter valid amount', 'error');
      return;
    }

    if (isSecondaryCurrencyEnabled && data?.secondaryCurrency_amount <= 0) {
      successMsg('Please enter valid amount', 'error');
      return;
    }

    if (isSecondaryCurrencyEnabled && data?.secondaryCurrency_amount > max * adminExchangeRate) {
      successMsg(`Secondary currency amount can't be more than ${max * adminExchangeRate}`, 'error');
      return;
    }

    if (!data?.userNote) {
      successMsg('Must add user note', 'error');
      return;
    }

    creditMutation.mutate(data);
  };

  console.log(data);

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
        <Stack direction="row" pb={5} alignItems="center" gap="12px">
          <StyledRadioGroup
            sx={{
              flexDirection: 'row',
              gap: '25px',
            }}
            items={typeOptions}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </Stack>
        {isSecondaryCurrencyEnabled && (
          <Stack direction="row" pb={3} alignItems="center" gap="12px">
            <OptionsSelect
              value={data?.paidCurrency}
              sx={{ padding: '8px 10px' }}
              gapSx={3}
              items={currencyOptions(baseCurrency, secondaryCurrency, isSecondaryCurrencyEnabled, false)}
              onChange={(value) => setData({ ...data, paidCurrency: value, amount: '', secondaryCurrency_amount: '' })}
            />
          </Stack>
        )}
        {data?.paidCurrency === 'baseCurrency' ? (
          <StyledFormField
            label={`Amount * (max ${baseCurrency?.code} ${max} )`}
            intputType="text"
            inputProps={{
              type: 'text',
              value: formatNumber(data?.amount),
              onChange: (e) => {
                const convertedValue = stringToNumber(e.target.value);
                if (!isNumber(Number(convertedValue))) {
                  return;
                }
                setData({
                  ...data,
                  amount: convertedValue,
                  secondaryCurrency_amount: Number(convertedValue) * adminExchangeRate,
                });
              },
            }}
          />
        ) : (
          <>
            <StyledFormField
              label={`Amount * (max ${secondaryCurrency?.code} ${max * adminExchangeRate} )`}
              intputType="text"
              inputProps={{
                type: 'text',
                value: formatNumber(data?.secondaryCurrency_amount),
                onChange: (e) => {
                  const convertedValue = stringToNumber(e.target.value);
                  if (!isNumber(Number(convertedValue))) {
                    return;
                  }
                  setData({
                    ...data,
                    secondaryCurrency_amount: Number(convertedValue),
                    amount: Number((Number(convertedValue) / adminExchangeRate)?.toFixed(2) || 0),
                  });
                },
              }}
            />
            <span></span>
          </>
        )}
        {isSecondaryCurrencyEnabled && (
          <Typography variant="body3" sx={{ marginTop: '-8px !important' }}>
            Equivalent To:{' '}
            {data?.paidCurrency === 'baseCurrency'
              ? `${secondaryCurrency?.code} ${formatNumber(Math.round(data?.secondaryCurrency_amount || 0))}`
              : `${baseCurrency?.symbol} ${formatNumber((data?.amount || 0).toFixed(2), true)}`}
          </Typography>
        )}
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
            disabled={creditMutation.isLoading}
          >
            Pay
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
