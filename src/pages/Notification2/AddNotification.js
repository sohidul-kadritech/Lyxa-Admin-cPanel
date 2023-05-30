import { Button, FormControl, Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import React, { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { accountTypeOptionsAdd, generateData, notificationDataValidation, notificationTypeOptionsAdd } from './helpers';

// eslint-disable-next-line no-unused-vars
function AddNotification({ isEdit = false, onClose, notifiction, sendNotificationQuery, deleteNotificationQuery }) {
  const [currentNotificaion, setCurrentNotificaion] = useState(notifiction || {});

  // eslint-disable-next-line no-unused-vars
  const [searchKeyShop, setSearchKeyShop] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchKeyUser, setSearchKeyUser] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchKeyRider, setSearchKeyRider] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchedShopOptions, setSearchedShopOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchedUserOptions, setSearchedUserOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchedRiderOptions, setSearchedRiderOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedShopOptions, setSelectedShopOptions] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedRiderOptions, setSelectedRiderOptions] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedUserOptions, setSelectedUserOptions] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [userOptions, setUserOptions] = useState([]);

  const changeHandler = (event) => {
    setCurrentNotificaion((prev) => {
      console.log('notification update: ', { ...prev, [event.target.name]: event.target.value });
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const sendNotificationHandler = () => {
    const data = currentNotificaion;
    if (data.type === 'specific') {
      if (data.accountType === 'deliveryBoy') {
        data.deliveryBoy = selectedRiderOptions;
      } else if (data.accountType === 'shop') {
        data.shop = selectedShopOptions;
      } else if (data.accountType === 'user') {
        data.user = selectedUserOptions;
      }
    }

    if (notificationDataValidation(data)) {
      console.log('generated data: ', generateData(data));
      sendNotificationQuery.mutate(generateData(data));
    }
  };

  const usersQuery = useMutation(
    () =>
      AXIOS.get(API_URL.ALL_USERS, {
        params: {
          page: 1,
          pageSize: 15,
          searchKey: searchKeyUser,
          sortBy: 'desc',
          status: 'all',
        },
      }),
    {
      onSuccess: (data) => {
        console.log('log user: ', data?.data?.users);
        setSearchedUserOptions((prev) => data?.data?.users || prev);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  // eslint-disable-next-line no-unused-vars
  const getUsers = useMemo(
    () =>
      debounce((value) => {
        setSearchKeyUser(value);
        usersQuery.mutate();
      }, 300),
    // eslint-disable-next-line prettier/prettier
    [],
  );

  // eslint-disable-next-line no-unused-vars
  const ridersQuery = useMutation(
    () =>
      AXIOS.get(API_URL.ALL_DELIVERY_MAN, {
        params: {
          page: 1,
          pageSize: 15,
          searchKey: searchKeyRider,
          sortBy: 'desc',
          status: 'all',
        },
      }),
    {
      onSuccess: (data) => {
        console.log('log rider: ', data?.data);
        setSearchedRiderOptions((prev) => data?.data?.deliveryBoys || prev);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  // eslint-disable-next-line no-unused-vars
  const getRider = useMemo(
    () =>
      debounce((value) => {
        setSearchKeyRider(value);
        ridersQuery.mutate();
      }, 300),
    // eslint-disable-next-line prettier/prettier
    [],
  );

  const shopsQuery = useMutation(
    () =>
      AXIOS.get(API_URL.ALL_SHOP, {
        params: {
          type: 'all',
          shopStatus: 'all',
          page: 1,
          pageSize: 15,
          searchKey: searchKeyShop,
        },
      }),
    {
      onSuccess: (data) => {
        setSearchedShopOptions((prev) => data?.data?.shops || prev);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const getShops = useMemo(
    () =>
      debounce((value) => {
        setSearchKeyShop(value);
        shopsQuery.mutate();
      }, 300),
    // eslint-disable-next-line prettier/prettier
    [],
  );

  return (
    <SidebarContainer title={`${isEdit ? 'Edit Notification' : 'Add Notification'}`} onClose={onClose}>
      <StyledFormField
        label="Title *"
        intputType="text"
        containerProps={{
          sx: {
            padding: '14px 0',
          },
        }}
        inputProps={{
          value: currentNotificaion?.title,
          type: 'text',
          name: 'title',
          onChange: changeHandler,
        }}
      />

      <StyledFormField
        label="Description *"
        intputType="text"
        containerProps={{
          sx: {
            padding: '14px 0',
          },
        }}
        inputProps={{
          value: currentNotificaion?.description,
          type: 'textarea',
          multiline: true,
          name: 'description',
          onChange: changeHandler,
        }}
      />

      <FormControl
      //   className={`${isEdit ? '' : 'd-none'}`}
      >
        <StyledFormField
          label="Account Type *"
          intputType="select"
          containerProps={{
            sx: {
              padding: '14px 0',
            },
          }}
          inputProps={{
            name: 'accountType',
            placeholder: 'Account Type',
            value: currentNotificaion?.accountType || '',
            items: accountTypeOptionsAdd,
            onChange: changeHandler,
          }}
        />
      </FormControl>
      <FormControl className={`${currentNotificaion?.accountType ? '' : 'd-none'}`}>
        <StyledFormField
          label="Notification Type *"
          intputType="select"
          containerProps={{
            sx: {
              padding: '14px 0',
            },
          }}
          inputProps={{
            name: 'type',
            placeholder: 'Notification Type',
            value: currentNotificaion?.type || '',
            items: notificationTypeOptionsAdd,
            onChange: changeHandler,
          }}
        />
      </FormControl>

      {currentNotificaion.accountType === 'shop' && currentNotificaion.type === 'specific' && (
        <StyledFormField
          label="Select Shop"
          intputType="autocomplete"
          inputProps={{
            multiple: false,
            maxHeight: '110px',
            options: searchedShopOptions,
            value: selectedShopOptions,
            placeholder: 'Choose',
            noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No shops',
            getOptionLabel: (option) => option?.shopName,
            isOptionEqualToValue: (option, value) => option?._id === value?._id,
            onChange: (e, v) => {
              console.log('value: ', v);
              setSelectedShopOptions(v);
              setSelectedRiderOptions(null);
              setSelectedUserOptions(null);
            },
            onInputChange: (e) => {
              getShops(e?.target?.value);
            },
            sx: {
              '& .MuiFormControl-root': {
                minWidth: '200px',
              },
            },
          }}
        />
      )}

      {currentNotificaion.accountType === 'user' && currentNotificaion.type === 'specific' && (
        <StyledFormField
          label="Select User"
          intputType="autocomplete"
          inputProps={{
            multiple: false,
            maxHeight: '110px',
            options: searchedUserOptions,
            value: selectedUserOptions,
            placeholder: 'Choose',
            noOptionsText: usersQuery?.isLoading ? 'Loading...' : 'No Users',
            getOptionLabel: (option) => option?.name,
            isOptionEqualToValue: (option, value) => option?._id === value?._id,
            onChange: (e, v) => {
              console.log('value: ', v);
              setSelectedUserOptions(v);
              setSelectedRiderOptions(null);
              setSelectedShopOptions(null);
            },
            onInputChange: (e) => {
              getUsers(e?.target?.value);
            },
            sx: {
              '& .MuiFormControl-root': {
                minWidth: '200px',
              },
            },
          }}
        />
      )}

      {currentNotificaion.accountType === 'deliveryBoy' && currentNotificaion.type === 'specific' && (
        <StyledFormField
          label="Select Rider"
          intputType="autocomplete"
          inputProps={{
            multiple: false,
            maxHeight: '110px',
            options: searchedRiderOptions,
            value: selectedRiderOptions,
            placeholder: 'Choose',
            noOptionsText: ridersQuery?.isLoading ? 'Loading...' : 'No Riders',
            getOptionLabel: (option) => option?.name,
            isOptionEqualToValue: (option, value) => option?._id === value?._id,
            onChange: (e, v) => {
              console.log('value: ', v);
              setSelectedRiderOptions(v);
              setSelectedShopOptions(null);
              setSelectedUserOptions(null);
            },
            onInputChange: (e) => {
              getRider(e?.target?.value);
            },
            sx: {
              '& .MuiFormControl-root': {
                minWidth: '200px',
              },
            },
          }}
        />
      )}

      <Stack sx={{ padding: '30px 0px' }}>
        <Button
          disableElevation
          variant="contained"
          disabled={sendNotificationQuery.isLoading}
          onClick={() => {
            sendNotificationHandler();
          }}
          fullWidth
        >
          {isEdit ? 'Save' : 'Add'}
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

export default AddNotification;
