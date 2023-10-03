/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

import { Box, Button, Stack, Typography } from '@mui/material';
import { isNumber } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CloseButton from '../../Common/CloseButton';
import OptionsSelect from '../../Filter/OptionsSelect';
import StyledFormField from '../../Form/StyledFormField';
import StyledRadioGroup from '../../Styled/StyledRadioGroup';
import { formatNumber, stringToNumber } from './helpers';

const initialAddRemoveCredit = (type, props) => {
  const typeOptions = {
    shop: {
      shopId: '',
      amount: '',
      secondaryCurrency_amount: '',
      type: 'add',
      desc: '',
      paidCurrency: 'baseCurrency',
    },
    rider: {
      riderId: '',
      baseCurrency_amount: '',
      secondaryCurrency_amount: '',
      type: 'add',
      desc: '',
      paidCurrency: 'baseCurrency',
    },
  };

  if (type === 'shop') {
    typeOptions[type].shopId = props?._id;
    return typeOptions[type];
  }
  if (type === 'rider') {
    typeOptions[type].riderId = props?._id;
    return typeOptions[type];
  }

  return {};
};

const typeOptions = [
  { label: 'Add', value: 'add' },
  { label: 'Remove', value: 'remove' },
];

export const currencyOptions = (
  baseCurrency,
  secondaryCurrency,
  secondaryEnabled,
  isRider = false,
  riderCurrencytype = 'secondaryCurrecny',
) => {
  const baseCode = baseCurrency?.code;
  const secondaryode = secondaryCurrency?.code;

  if (isRider) {
    return riderCurrencytype === 'baseCurrency'
      ? [{ label: baseCode, value: 'baseCurrency' }]
      : [{ label: secondaryode, value: 'secondaryCurrency' }];
  }

  if (secondaryEnabled) {
    return [
      { label: baseCode, value: 'baseCurrency' },
      { label: secondaryode, value: 'secondaryCurrency' },
    ];
  }

  return [{ label: baseCode, value: 'baseCurrency' }];
};

const limit = {
  secondaryCurrency: 5000000,
  baseCurrency: 100,
};

function GlobalAddRemoveCredit({ type, onClose, data }) {
  const { general } = useGlobalContext();

  const [addRemoveCredit, setAddRemoveCredit] = useState({
    ...initialAddRemoveCredit(type, data),
  });

  const [baseKey, setBaseKey] = useState(type === 'rider' ? 'baseCurrency_amount' : 'amount');

  const { appSetting } = general;

  const secondaryCurrency = appSetting?.secondaryCurrency;

  const baseCurrency = appSetting?.baseCurrency;

  const exchangeRate = type === 'shop' ? data?.shopExchangeRate : appSetting?.adminExchangeRate;

  const isSecondaryCurrencyEnabled = exchangeRate > 0;

  const queryClient = useQueryClient();

  const currencyType = type === 'rider' && exchangeRate > 0 ? 'secondaryCurrency' : 'baseCurrency';

  const currencyCode = {
    secondaryCurrency: secondaryCurrency?.code,
    baseCurrency: baseCurrency?.symbol,
  };

  const typeOption = {
    shop: {
      api: API_URL.SHOP_ADD_REMOVE_CREDIT,
      params: {},
    },
    rider: {
      api: API_URL.RIDER_ADD_REMOVE_CREDIT,
      params: {},
    },
  };

  useEffect(() => {
    if (type === 'rider') {
      setAddRemoveCredit((prev) => ({ ...prev, paidCurrency: currencyType }));
    }
  }, [data]);

  const creditMutation = useMutation((data) => AXIOS.post(typeOption[type].api, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient?.invalidateQueries(API_URL.SINGLE_DELIVERY_WALLET_TRANSACTIONS);

        queryClient?.invalidateQueries(API_URL.SINGLE_DELIVERY_WALLET_CASH_ORDER_LIST);

        queryClient?.invalidateQueries(API_URL.GET_ADMIN_RIDER_FINANCIALS_PROFITBREAKDOWN);

        queryClient?.invalidateQueries(API_URL.GET_SHOP_ADMIN_FINANCIALS_PROFITBREAKDOWN);

        queryClient?.invalidateQueries(API_URL.SHOP_TRX);

        queryClient?.invalidateQueries(API_URL.GET_SHOP_DASHBOARD_SUMMARY);

        onClose();
      }
    },
  });

  const addRemoveCreditHandler = () => {
    const amount =
      addRemoveCredit?.paidCurrency === 'baseCurrency'
        ? addRemoveCredit?.[baseKey]
        : addRemoveCredit?.secondaryCurrency_amount;

    if (!isNumber(amount)) {
      successMsg('Invalid Amount');
      return;
    }

    if (amount <= 0 || !amount) {
      successMsg(`${addRemoveCredit?.paidCurrency} amount can't be zero or negative`);
      return;
    }

    if (Number(amount) > limit[addRemoveCredit?.paidCurrency]) {
      successMsg(
        `${addRemoveCredit?.paidCurrency} amount can't greater than  ${currencyCode[addRemoveCredit?.paidCurrency]} ${
          limit[addRemoveCredit?.paidCurrency]
        }`,
      );
      return;
    }

    if (type === 'rider') {
      creditMutation.mutate(addRemoveCredit);
      return;
    }

    if (type === 'shop') {
      const tempAddRemoveCredit = addRemoveCredit;
      delete tempAddRemoveCredit.paidCurrency;
      creditMutation.mutate(tempAddRemoveCredit);
    }
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
            value={addRemoveCredit.type}
            onChange={(e) => setAddRemoveCredit((prev) => ({ ...prev, type: e.target.value }))}
          />
        </Box>
        <Box py={3}>
          <OptionsSelect
            value={addRemoveCredit?.paidCurrency}
            sx={{ padding: '8px 10px' }}
            gapSx={3}
            items={currencyOptions(
              baseCurrency,
              secondaryCurrency,
              isSecondaryCurrencyEnabled,
              type === 'rider',
              currencyType,
            )}
            onChange={(value) =>
              setAddRemoveCredit((prev) => {
                const secondaryCurrency_amount = '';
                const baseCurrency_amount = '';
                return { ...prev, paidCurrency: value, secondaryCurrency_amount, [baseKey]: baseCurrency_amount };
              })
            }
          />
        </Box>

        {addRemoveCredit?.paidCurrency === 'baseCurrency' && (
          <StyledFormField
            label="Base Amount *"
            intputType="text"
            containerProps={{
              sx: {
                paddingBottom: '4px',
              },
            }}
            inputProps={{
              type: 'text',
              value: formatNumber(addRemoveCredit[baseKey]),
              min: 0,
              max: 100,
              placeholder: `Base currency amount. i.e. ${baseCurrency?.symbol} 100`,
              onChange: (e) => {
                const convertedValue = stringToNumber(e.target.value);
                if (!isNumber(Number(convertedValue))) {
                  return;
                }
                setAddRemoveCredit((prev) => {
                  const secondaryCurrency_amount = Number(convertedValue) * Number(exchangeRate);
                  console.log('prev', { ...prev, secondaryCurrency_amount, [baseKey]: Number(convertedValue) });
                  return { ...prev, secondaryCurrency_amount, [baseKey]: Number(convertedValue) };
                });
              },
            }}
          />
        )}

        {addRemoveCredit?.paidCurrency === 'secondaryCurrency' && (
          <StyledFormField
            label="Secondary Amount *"
            intputType="text"
            containerProps={{
              sx: {
                paddingBottom: '4px',
              },
            }}
            inputProps={{
              type: 'text',
              value: formatNumber(addRemoveCredit?.secondaryCurrency_amount),
              min: 0,
              max: 5000000,
              placeholder: `Secondary currency amount. i.e. ${secondaryCurrency?.code} 5000000`,
              onChange: (e) => {
                const convertedValue = stringToNumber(e.target.value);
                if (!isNumber(Number(convertedValue))) {
                  return;
                }
                setAddRemoveCredit((prev) => {
                  const baseCurrency_amount = Number(convertedValue) / Number(exchangeRate);
                  return { ...prev, [baseKey]: baseCurrency_amount, secondaryCurrency_amount: Number(convertedValue) };
                });
              },
            }}
          />
        )}

        {isSecondaryCurrencyEnabled && (
          <Typography variant="body3" sx={{ marginTop: '-8px !important' }}>
            Equivalent To:{' '}
            {addRemoveCredit?.paidCurrency === 'baseCurrency'
              ? `${secondaryCurrency?.code} ${formatNumber(Math.round(addRemoveCredit?.secondaryCurrency_amount))}`
              : `${baseCurrency?.symbol} ${formatNumber((addRemoveCredit[baseKey] || 0).toFixed(2), true)}`}
          </Typography>
        )}

        <StyledFormField
          label="Description"
          intputType="textarea"
          inputProps={{
            multiline: true,
            value: addRemoveCredit.desc,
            placeholder: 'Write description here...',
            onChange: (e) => setAddRemoveCredit((prev) => ({ ...prev, desc: e.target.value })),
          }}
        />
        <Stack direction="row" alignItems="center" justifyContent="flex-end" pt={6.5}>
          <Button
            color="primary"
            variant="contained"
            sx={{ width: '200px' }}
            onClick={addRemoveCreditHandler}
            disabled={creditMutation.isLoading}
          >
            Pay
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default GlobalAddRemoveCredit;