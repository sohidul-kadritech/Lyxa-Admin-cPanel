// third party
import { Box, Button } from '@mui/material';
import React, { useState } from 'react';

// project import
import { useMutation, useQueryClient } from 'react-query';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { creatUserData, createEditUserData, genderOptions, validateUser } from './helpers';

export default function EditUser({ editUser, onClose }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(createEditUserData(editUser));
  const [loading, setLoading] = useState(false);

  const commonChangeHandler = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setUser((prev) => ({
      ...prev,
      profile_photo: newFiles?.length > 0 ? newFiles : prev.images,
    }));
  };

  // product mutation
  const userMuation = useMutation((data) => AXIOS.post(Api.USER_UPDATE, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        setLoading(false);
        queryClient.invalidateQueries([Api.ALL_USERS]);
        onClose();
      }
    },
  });

  const updateUser = async () => {
    const valid = validateUser(user);

    if (!valid.status) {
      successMsg(valid?.message);
      return;
    }

    setLoading(true);
    const userData = await creatUserData(user);

    if (userData?.error) {
      successMsg(userData?.message);
      setLoading(false);
      return;
    }

    userMuation.mutate(userData);
  };

  return (
    <SidebarContainer title="Edit User" onClose={onClose}>
      {/* name */}
      <StyledFormField
        label="Name"
        intputType="text"
        inputProps={{
          type: 'text',
          name: 'name',
          value: user?.name,
          onChange: commonChangeHandler,
        }}
      />
      {/* Date of birth */}
      <StyledFormField
        label="Date of Birth"
        intputType="date"
        inputProps={{
          value: user?.dob,
          onChange: (e) => {
            setUser((prev) => ({ ...prev, dob: e?._d }));
          },
          fullWidth: true,
          sx: {
            '& .MuiInputBase-root': {
              maxWidth: 'inherit',
            },
          },
        }}
      />
      {/* Gender */}
      <StyledFormField
        label="Gender"
        intputType="select"
        inputProps={{
          name: 'gender',
          value: user?.gender,
          items: genderOptions,
          onChange: commonChangeHandler,
        }}
      />
      {/* Photo */}
      <StyledFormField
        label="Photo"
        intputType="file"
        inputProps={{
          onDrop,
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: user.profile_photo,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />
      <Box pt={6} pb={6}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DropIcon />}
          fullWidth
          disabled={loading}
          onClick={updateUser}
        >
          Update
        </Button>
      </Box>
    </SidebarContainer>
  );
}
