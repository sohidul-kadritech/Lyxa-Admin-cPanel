import { ArrowDownward } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';

const fieldContainerSx = {
  padding: '14px 0px 23px 0',
};
function EditUser({ onClose, editUser, ...props }) {
  const [userData, setUserData] = useState(props.data);
  const userEditOnChangeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = () => {
    props.editUserHandler(userData);
    onClose();
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
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              type: 'text',
              name: 'name',
              value: userData.name,
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
              value: userData.email,
            }}
          />

          {/* new password */}
          <StyledFormField
            label="New password"
            intputType="text"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              type: 'password',
              name: 'new_password',
              onChange: userEditOnChangeHandler,
            }}
          />
          {/* confirm password */}
          <StyledFormField
            label="Confirm new password"
            intputType="text"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              type: 'password',
              name: 'confirm_new_password',
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
            onClick={onSubmitHandler}
            disabled={props?.loading}
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
