import { EmailOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { parsePhoneNumber } from 'react-phone-number-input';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { statusTypeOptions } from '../Faq2/helpers';
import { generateData, varifyUserData } from './helpers';

const intialData = {
  status: 'active',
  password: '',
  email: '',
};

// const adminTypeIndexTracker = {
//   0: 'admin',
//   1: 'customerService',
//   2: 'sales',
//   3: 'accountManager',
// };

const getAdminType = (type) => {
  if (type === 'admin') return 'Admin';
  if (type === 'customerService') return 'customer service';
  if (type === 'sales') return 'sales';
  if (type === 'accountManager') return 'account manager';
  return '';
};

export const generateEditAdminData = (data) => {
  if (!data?._id) {
    return null;
  }

  return {
    ...data,
    number: parsePhoneNumber(data?.phone_number) ? data?.phone_number : `+880${data?.phone_number}`,
    password: '',
  };
};

function AddAdmin({ adminType = 'admin', onClose, addAdminQuery, currentAdmin = null, isEdit }) {
  const [newAdminData, setNewAdminData] = useState(generateEditAdminData(currentAdmin) || intialData);
  const theme = useTheme();
  const changeHandler = (e) => {
    setNewAdminData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitAdminController = () => {
    const isVarified = varifyUserData(newAdminData, isEdit);
    console.log(isVarified);

    if (isVarified) {
      addAdminQuery.mutate(generateData({ ...newAdminData, adminType }, isEdit));
    }
  };

  return (
    <SidebarContainer title={`${isEdit ? 'Edit' : 'Add new'} ${getAdminType(adminType)}`} onClose={onClose}>
      <Stack gap="69px" marginBottom="40px">
        <Box>
          <StyledFormField
            label="Name *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              value: newAdminData?.name,
              placeholder: 'Name',
              type: 'text',
              name: 'name',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
          <StyledFormField
            label="Email *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              value: newAdminData?.email,
              placeholder: 'Email',
              type: 'text',
              name: 'email',
              readOnly: isEdit,
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
          <StyledFormField
            label={`${isEdit ? 'New ' : ''}Password *`}
            // label="Password *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              value: newAdminData?.password,
              placeholder: 'password',
              type: 'password',
              name: 'password',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
          <StyledFormField
            label={`Repeated ${isEdit ? 'New ' : ''} Password *`}
            // label="Repeated Password *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              value: newAdminData?.confirm_password,
              placeholder: 'Repeated password',
              type: 'password',
              name: 'confirm_password',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
          <StyledFormField
            label="Phone Number *"
            intputType="phoneNumber"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              value: newAdminData?.number,
              placeholder: 'Phone number',
              type: 'number',
              name: 'number',
              onChange: (value) => {
                setNewAdminData((prev) => ({ ...prev, number: value }));
              },
              //   readOnly: isReadOnly,
            }}
          />

          <StyledFormField
            label="Status *"
            intputType="select"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              value: newAdminData?.status || '',
              placeholder: 'Select Status',
              name: 'status',
              items: statusTypeOptions,
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
        </Box>

        <Stack gap="32px">
          <Typography variant="body4" sx={{ fontWeight: '500 !important', color: theme.palette.text.secondary2 }}>
            *Access to almost all pages, except for those related to payments, tax, user management, marking, and
            settings.
          </Typography>
          <Button
            disableElevation
            variant="contained"
            disabled={addAdminQuery?.isLoading}
            onClick={() => {
              // onSubmitSeller();
              onSubmitAdminController();
              // setLoading(true);
            }}
            startIcon={<EmailOutlined />}
            fullWidth
          >
            {isEdit ? 'SAVE' : ' Add e-mail'}
          </Button>
        </Stack>
      </Stack>
    </SidebarContainer>
  );
}

export default AddAdmin;
