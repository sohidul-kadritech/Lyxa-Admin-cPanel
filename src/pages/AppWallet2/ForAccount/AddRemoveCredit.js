import { Box, Button, Stack, Typography, createFilterOptions, debounce } from '@mui/material';
import { isNumber } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';

import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import IncrementDecrementButton from '../../AppSettings2/IncrementDecrementButton';

function AddRemoveCredit({ onClose, storeAppSettings }) {
  const { general } = useGlobalContext();
  const { adminExchangeRate, secondaryCurrency } = storeAppSettings;
  const currency = general?.currency?.symbol;
  const [searchedUserOptions, setSearchedUserOptions] = useState([]);
  const [user, setUser] = useState({});

  const [searchKeyUser, setSearchKeyUser] = useState('');
  const [amount, setAmount] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [adminNote, setAdminNote] = useState('');
  const [userNote, setUserNote] = useState('');

  const queryClient = useQueryClient();
  const incrementByOneHandler = (setValue) => {
    setValue((prev) => {
      if (isNumber(parseInt(prev, 10)) && prev !== '') return parseInt(prev, 10) + 1;
      if (prev === '') return 1;
      return prev;
    });
  };
  // Handle decremented by one
  const decrementByOneHandler = (setValue) => {
    setValue((prev) => {
      if (isNumber(parseInt(prev, 10)) && prev !== '') return parseInt(prev, 10) - 1;
      if (prev === '' || prev <= 0) return 0;
      return prev;
    });
  };
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
    }
  );
  const settingsQuery = useQuery([Api.APP_SETTINGS], () => AXIOS.get(Api.APP_SETTINGS), {
    onSuccess: (data) => {
      setMaxValue(data?.data?.appSetting?.maxCustomerServiceValue);
    },
  });

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
    if (!user?.id) {
      successMsg('Select an user', 'error');
      return;
    }
    if (amount < 0) {
      successMsg("Amount can't be negative", 'error');
      return;
    }

    if (amount > maxValue) {
      successMsg(`Amount can't be more than ${maxValue}`, 'error');
      return;
    }

    if (!userNote) {
      successMsg('Must add user note', 'error');
      return;
    }
    const api = type === 'add' ? Api.ADD_USER_BALANCE : Api.REMOVE_USER_BALANCE;

    const data = { api, data: { userId: user?.id, amount, adminNote, userNote } };
    console.log(data);
    creditMutation.mutate(data);
  };

  useEffect(() => {
    setMaxValue(settingsQuery?.data?.data?.appSetting?.maxCustomerServiceValue || null);
  }, []);

  const getShops = useMemo(
    () =>
      debounce((value) => {
        console.log('value: ', value);
        setSearchKeyUser(value);
        shopsQuery.mutate();
      }, 300),
    // eslint-disable-next-line prettier/prettier
    []
  );

  const filterOptions = createFilterOptions({
    stringify: ({ name, phone_number, _id }) => `${name} ${phone_number} ${_id}`,
  });

  const clearData = () => {
    setUser({});
    setAmount(0);
    setAdminNote('');
    setUserNote('');
  };

  return (
    <SidebarContainer title="Add/Remove credit" onClose={onClose}>
      <Box position="relative">
        <StyledFormField
          label="Select User"
          intputType="autocomplete"
          inputProps={{
            multiple: false,
            maxHeight: '110px',
            options: searchedUserOptions,
            value: user.id,
            placeholder: 'Choose user',
            noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No users',
            filterOptions,
            getOptionLabel: (option) => option?.name,
            isOptionEqualToValue: (option, value) => option?._id === value?._id,
            onChange: (e, v) => {
              console.log('value: ', v);
              setUser((prev) => ({ ...prev, id: v?._id }));
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
      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: '600', fontSize: '15px' }}>
          Amount (max {currency}
          {maxValue || 0})
        </Typography>
        <IncrementDecrementButton
          incrementHandler={incrementByOneHandler}
          decrementHandler={decrementByOneHandler}
          setValue={setAmount}
          isValidateType={false}
          currentValue={amount}
        />
      </Box>
      {secondaryCurrency?.symbol && (
        <Typography pt={2} variant="body3" display="block">
          Equivalent Price: {secondaryCurrency?.code} {Math.round(amount * parseInt(adminExchangeRate, 10))}
        </Typography>
      )}
      <Box sx={{ marginTop: '20px' }}>
        <StyledFormField
          label="Admin Note (Visible to you)"
          intputType="textarea"
          inputProps={{
            multiline: true,
            value: adminNote,
            onChange: (e) => setAdminNote(e.target.value),
          }}
        />
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <StyledFormField
          label="User Note (Visible to User) *"
          intputType="textarea"
          inputProps={{
            multiline: true,
            value: userNote,
            onChange: (e) => setUserNote(e.target.value),
          }}
        />
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="16px" pt={6.5}>
        <Button
          color="primary"
          variant="outlined"
          sx={{ width: '200px' }}
          onClick={() => {
            addRemoveCredit('remove');
          }}
          disabled={creditMutation.isLoading || maxValue === null}
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
          disabled={creditMutation.isLoading || maxValue === null}
        >
          Add
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="center" marginTop="12px">
        <Button
          variant="text"
          disableRipple
          color="error"
          //   disabled={update.isLoading}
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
