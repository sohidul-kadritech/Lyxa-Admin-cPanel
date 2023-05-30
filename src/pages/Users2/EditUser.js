import { ArrowDownward } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { validateUser } from './helpers';

const getEditUserData = (editUser) => ({
  email: editUser?.email,
  name: editUser?.name,
  password: '',
  repeated_password: '',
  id: editUser?._id,
  isParentUser: editUser?.isParentUser,
});

const userTypeToApiMap = { shop: Api.UPDATE_SHOP_CREDENTIAL, seller: Api.UPDATE_SELLER_CREDENTIAL };

function EditUser({ onClose, editUser, userType, refetch }) {
  const { currentUser } = useGlobalContext();
  const [user, setUserData] = useState(getEditUserData(editUser));

  const userEditOnChangeHandler = (e) => {
    setUserData({ ...user, [e.target.name]: e.target.value });
  };

  const editUserMutation = useMutation(
    (data) => AXIOS.post(userTypeToApiMap[userType], { isParentUser: undefined, ...data }),
    {
      onSuccess: (data, args) => {
        if (data?.status) {
          successMsg(data.message, 'success');
          onClose();
          refetch();

          console.log(args);

          if (args?.isParentUser) {
            currentUser[userType].name = args?.name;
          }
        } else {
          successMsg(data.message, 'error');
        }
      },
    }
  );

  const onSubmit = () => {
    const status = validateUser(user);

    if (!status.status) {
      successMsg(status?.message);
      return;
    }

    editUserMutation.mutate(user);
  };

  const theme = useTheme();
  return (
    <SidebarContainer title="Edit User" onClose={onClose}>
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
              onChange: userEditOnChangeHandler,
            }}
          />
          {/* email */}
          <StyledFormField
            label="Email"
            intputType="text"
            readOnly
            containerProps={{
              sx: {
                padding: '14px 0px 10px 0',
                opacity: '0.7',
              },
            }}
            inputProps={{
              readOnly: true,
              type: 'email',
              name: 'email',
              value: user.email,
            }}
          />

          {/* new password */}
          <StyledFormField
            label="New password"
            intputType="text"
            inputProps={{
              type: 'password',
              name: 'password',
              onChange: userEditOnChangeHandler,
            }}
          />
          {/* confirm password */}
          <StyledFormField
            label="Confirm new password"
            intputType="text"
            inputProps={{
              type: 'password',
              name: 'repeated_password',
              onChange: userEditOnChangeHandler,
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
            onClick={onSubmit}
            disabled={editUserMutation.isLoading}
            variant="contained"
            color="primary"
            startIcon={<ArrowDownward />}
            fullWidth
          >
            Save changes
          </Button>
        </Box>
      </Stack>
    </SidebarContainer>
  );
}

export default EditUser;
