import { EmailOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';

// Style
const fieldContainerSx = {
  padding: '14px 0px 23px 0',
};
function AddUser({ onClose, editCategory, loading, ...props }) {
  const [userData, setUserData] = useState({});

  console.log(editCategory);

  const theme = useTheme();

  const userOnBlurHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = () => {
    console.log('added user data for credential: ', userData);
    props.addUser(userData);
  };

  return (
    <SidebarContainer title="Add User" onClose={onClose}>
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
              onBlur: userOnBlurHandler,
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
              onBlur: userOnBlurHandler,
            }}
          />
          <Typography
            sx={{ fontSize: '15px', color: theme.palette.text.secondary, fontWeight: 500, margin: '0px 0px 18px 0px' }}
          >
            Email connected to Lyxa account
          </Typography>
          {/* password */}
          <StyledFormField
            label="Password"
            intputType="text"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              type: 'password',
              name: 'password',
              onBlur: userOnBlurHandler,
            }}
          />
          {/* repeated password */}
          <StyledFormField
            label="Repeat Password"
            intputType="text"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              type: 'password',
              name: 'repeated_password',
              onBlur: userOnBlurHandler,
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
            disabled={loading}
            onClick={onSubmitHandler}
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
