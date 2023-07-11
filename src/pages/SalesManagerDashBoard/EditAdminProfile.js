import { EmailOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { parsePhoneNumber } from 'react-phone-number-input';
import { useMutation } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { statusTypeOptions } from '../Faq2/helpers';
import { previewGenerator } from '../Sellers2/helpers';
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
    profile_photo: previewGenerator(data?.profile_photo),
    password: '',
  };
};

function EditAdminProfile({ adminType = 'admin', onClose, currentAdmin = null, isEdit }) {
  const [newAdminData, setNewAdminData] = useState(generateEditAdminData(currentAdmin) || intialData);

  const { dispatchCurrentUser } = useGlobalContext();
  const theme = useTheme();

  const editAdminQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_ADMIN, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        onClose();
        dispatchCurrentUser({ type: 'admin', payload: { admin: data?.data?.admin, isCurrentUser: true } });
      } else {
        successMsg(data.message, 'warn');
      }
    },
  });

  const changeHandler = (e) => {
    setNewAdminData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitAdminController = async () => {
    const isVarified = varifyUserData(newAdminData, isEdit);
    console.log(isVarified);

    if (isVarified) {
      const adminData = await generateData({ ...newAdminData, adminType }, isEdit);
      if (adminData?.status === false) {
        return;
      }
      editAdminQuery.mutate(adminData);
    }
  };

  const onDrop = (acceptedFiles, filesFor) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
      }),
    );
    setNewAdminData((prev) => ({
      ...prev,
      [filesFor]: newFiles?.length ? newFiles : prev[filesFor],
    }));
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
            label="Address *"
            // label="Repeated Password *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              value: newAdminData?.address,
              placeholder: 'address',
              type: 'text',
              name: 'address',
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
            label="Profile Image *"
            intputType="file"
            inputProps={{
              onDrop: (acceptedFiles) => {
                onDrop(acceptedFiles, 'profile_photo');
              },
              name: 'profile_photo',
              maxSize: 1000 * 1000,
              text: 'Drag and drop or chose photo',
              files: newAdminData?.profile_photo,
              helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
              helperText2: 'Pixels: Minimum 320 for width and height',
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
            disabled={editAdminQuery?.isLoading}
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

export default EditAdminProfile;
