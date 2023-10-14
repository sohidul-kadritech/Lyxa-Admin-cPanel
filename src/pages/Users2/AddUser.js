/* eslint-disable no-unused-vars */
import { EmailOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { addUserInit, credentialTypeOptions, validateUser } from './helpers';

const userTypeToApiMap = { shop: Api.ADD_SHOP_CREDENTIAL, seller: Api.ADD_SELLER_CREDENTIAL };

function AddUser({ onClose, userType, refetch }) {
  const theme = useTheme();

  const { currentUser } = useGlobalContext();

  const [user, setUser] = useState(addUserInit(userType, currentUser[userType]?._id));

  console.log(addUserInit(userType, currentUser[userType]?._id));

  const addUserMutation = useMutation((data) => AXIOS.post(userTypeToApiMap[userType], data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        onClose();
        refetch();
      }
    },
  });

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    const status = validateUser(user, userType);

    if (!status.status) {
      successMsg(status?.message);
      return;
    }

    addUserMutation.mutate(user);
  };

  return (
    <SidebarContainer title="Add User" onClose={onClose}>
      <Stack direction="column" alignContent="space-between" justifyContent="space-between" sx={{ height: '80vh' }}>
        <Box>
          {/* name */}
          <StyledFormField
            label="Full Name"
            intputType="text"
            inputProps={{
              type: 'text',
              name: 'name',
              value: user.name,
              onChange,
            }}
          />
          {/* email */}
          <StyledFormField
            label="Email"
            intputType="text"
            containerProps={{
              sx: {
                padding: '14px 0px 10px 0',
              },
            }}
            inputProps={{
              type: 'email',
              name: 'email',
              onChange,
              value: user.email,
              inputProps: {
                autoComplete: 'off',
              },
            }}
          />

          <Typography
            sx={{ fontSize: '15px', color: theme.palette.text.secondary, fontWeight: 500, margin: '0px 0px 18px 0px' }}
          >
            Email connected to Lyxa account
          </Typography>

          {/* credential user type */}
          <StyledFormField
            label="User Type"
            intputType="select"
            containerProps={{
              sx: {
                padding: '14px 0px 10px 0',
              },
            }}
            inputProps={{
              type: 'text',
              name: 'credentialType',
              items: credentialTypeOptions,
              onChange,
              value: user?.credentialType,
              inputProps: {
                autoComplete: 'off',
              },
            }}
          />

          {/* password */}
          <StyledFormField
            label="Password"
            intputType="password"
            inputProps={{
              value: user.password,
              name: 'password',
              onChange,
            }}
          />
          {/* repeated password */}
          <StyledFormField
            label="Repeat Password"
            intputType="password"
            inputProps={{
              value: user.repeated_password,
              name: 'repeated_password',
              onChange,
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{ fontSize: '15px', color: theme.palette.text.secondary, fontWeight: 500, margin: '0px 0px 16px 0px' }}
          >
            *Manager: Access to all pages and are authorized to add new staff members.
          </Typography>
          <Typography
            sx={{ fontSize: '15px', color: theme.palette.text.secondary, fontWeight: 500, margin: '0px 0px 32px 0px' }}
          >
            *Staff: Access to almost all pages, except for those related to payments, tax, user management, marking, and
            settings.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={addUserMutation.isLoading}
            onClick={onSubmit}
            startIcon={<EmailOutlined />}
            fullWidth
          >
            Add e-mail
          </Button>
        </Box>
      </Stack>
    </SidebarContainer>
  );
}

export default AddUser;
