/* eslint-disable prettier/prettier */
import { Box, Button, Stack, createFilterOptions, debounce } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';

import StyledRadioGroup from '../../../components/Styled/StyledRadioGroup';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { currencyTypeOptions } from '../../UsersProfile/Transactions/AddRemoveCredit';

const getDataInit = () => ({
  userId: null,
  amount: '',
  secondaryCurrency_amount: '',
  adminNote: '',
  userNote: '',
  paidCurrency: 'baseCurrency',
});

function AddRemoveCredit({ onClose }) {
  const queryClient = useQueryClient();

  const { general } = useGlobalContext();
  const { appSetting } = general;
  const { secondaryCurrency, adminExchangeRate, baseCurrency } = appSetting;
  const max = appSetting?.maxCustomerServiceValue;
  const isSecondaryCurrencyEnabled = adminExchangeRate > 0;

  const [data, setData] = useState(getDataInit());

  const [searchedUserOptions, setSearchedUserOptions] = useState([]);
  const [searchKeyUser, setSearchKeyUser] = useState('');

  const shopsQuery = useMutation(
    () =>
      AXIOS.get(Api.ALL_USERS, {
        params: {
          page: 1,
          pageSize: 15,
          searchKey: searchKeyUser,
        },
      }),
    {
      onSuccess: (data) => {
        setSearchedUserOptions((prev) => {
          console.log('shopData', data?.data?.users?.length > 0 ? data?.data?.users : prev);
          return data?.data?.users?.length > 0 ? data?.data?.users : prev;
        });
      },
    },
  );

  const creditMutation = useMutation((data) => AXIOS.post(data?.api, data?.data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries(Api.DROP_PAY_LIST);
        onClose();
      }
    },
  });

  const addRemoveCredit = (type) => {
    if (!data?.userId) {
      successMsg('Plese select user first!');
      return;
    }

    if (Number.isNaN(Number(data?.amount))) {
      successMsg('Please enter valid amount', 'error');
      return;
    }

    if (data?.amount <= 0) {
      successMsg('Please enter valid amount', 'error');
      return;
    }

    if (data?.amount > max) {
      successMsg(`Amount can't be more than maximum`, 'error');
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
      successMsg(`Asount can't be more than maximum`, 'error');
      return;
    }

    if (!data?.userNote) {
      successMsg('Must add user note', 'error');
      return;
    }

    const api = type === 'add' ? Api.ADD_USER_BALANCE : Api.REMOVE_USER_BALANCE;
    const payload = { api, data: { ...data, userId: data?.userId?._id } };

    // console.log('payload', payload);
    creditMutation.mutate(payload);
  };

  const getShops = useMemo(
    () =>
      debounce((value) => {
        console.log('value: ', value);
        setSearchKeyUser(value);
        shopsQuery.mutate();
      }, 300),
    [],
  );

  const filterOptions = createFilterOptions({
    stringify: ({ name, phone_number, _id }) => `${name} ${phone_number} ${_id}`,
  });

  const clearData = () => {
    setData(getDataInit());
  };

  return (
    <SidebarContainer title="Add/Remove credit" onClose={onClose}>
      <Box position="relative" pt={7.5}>
        {isSecondaryCurrencyEnabled && (
          <StyledRadioGroup
            sx={{
              flexDirection: 'row',
              gap: '25px',
              pb: 5,
            }}
            items={currencyTypeOptions}
            value={data?.paidCurrency}
            onChange={(e) =>
              setData({ ...data, paidCurrency: e.target.value, amount: '', secondaryCurrency_amount: '' })
            }
          />
        )}

        <StyledFormField
          label="Select User"
          intputType="autocomplete"
          inputProps={{
            multiple: false,
            maxHeight: '110px',
            options: searchedUserOptions,
            value: data?.userId,
            placeholder: 'Choose user',
            noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No users',
            filterOptions,
            getOptionLabel: (option) => option?.name,
            isOptionEqualToValue: (option, value) => option?._id === value?._id,
            onChange: (e, v) => {
              console.log('value: ', v);
              setData((prev) => ({ ...prev, userId: v }));
            },
            onInputChange: (e) => {
              getShops(e?.target?.value);
            },
            sx: {
              '& .MuiFormControl-root': {
                minWidth: '300px',
              },
            },
          }}
        />
      </Box>

      {data?.paidCurrency === 'baseCurrency' ? (
        <StyledFormField
          label={`Amount * (max ${baseCurrency?.code} ${max} )`}
          intputType="text"
          inputProps={{
            type: 'number',
            value: data?.amount,
            onChange: (e) => {
              setData({
                ...data,
                amount: e.target.value,
                secondaryCurrency_amount: Number(e.target.value) * adminExchangeRate,
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
              type: 'number',
              value: data?.amsecondaryCurrency_amountount,
              onChange: (e) => {
                setData({
                  ...data,
                  secondaryCurrency_amount: e.target.value,
                  amount: Number((Number(e.target.value) / adminExchangeRate)?.toFixed(2) || 0),
                });
              },
            }}
          />
          <span></span>
        </>
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
      <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="16px" pt={6.5}>
        <Button
          color="primary"
          variant="outlined"
          sx={{ width: '200px' }}
          onClick={() => {
            addRemoveCredit('remove');
          }}
          disabled={creditMutation.isLoading || max === null}
        >
          Remove
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{ width: '200px' }}
          onClick={() => {
            addRemoveCredit('add');
          }}
          disabled={creditMutation.isLoading || max === null}
        >
          Add
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="center" marginTop="12px">
        <Button
          variant="text"
          disableRipple
          color="error"
          onClick={() => {
            clearData();
          }}
        >
          Discard Changes
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

export default AddRemoveCredit;
