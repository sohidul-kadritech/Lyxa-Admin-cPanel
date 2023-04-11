/* eslint-disable no-unused-vars */
import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as DropIcon } from '../../assets/icons/down.svg';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { validateCategory } from './helpers';

const fieldContainerSx = {
  padding: '14px 0',
};

const getCategoryInit = (shopType) => ({
  name: '',
  image: shopType === 'food' ? undefined : [],
  type: '',
  note: '',
});

export default function AddCategory({ onClose, readOnly, editCategory }) {
  const adminShop = useSelector((store) => store.Login.admin);
  const queryClient = useQueryClient();
  const [render, setRender] = useState(false);
  const [category, setCategory] = useState(editCategory || getCategoryInit(adminShop?.shopType));

  console.log(adminShop);

  // input handler
  const commonChangeHandler = (e) => {
    setCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // file handler
  const onDrop = (acceptedFiles, rejectedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setCategory((prev) => ({
      ...prev,
      image: newFiles?.length > 0 ? newFiles : prev.image,
    }));
  };

  // categoryMutation
  const categoryMutation = useMutation(
    (data) => {
      const API = editCategory ? Api.EDIT_CATEGORY : Api.ADD_CATEGORY;
      return AXIOS.post(API, data);
    },
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : '');

        if (data?.status) {
          queryClient.invalidateQueries('category-wise-products');
          onClose();
        }
      },
    }
  );

  const onSubmit = () => {
    category.type = adminShop?.shopType;
    const valid = validateCategory(category);

    if (!valid?.status) {
      successMsg(valid?.msg);
      return;
    }

    categoryMutation.mutate(category);
  };

  return (
    <SidebarContainer title="Add Category" onClose={onClose}>
      <Box>
        {/* name */}
        <StyledFormField
          label="Name"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            type: 'text',
            name: 'name',
            value: category.name,
            onChange: commonChangeHandler,
          }}
        />
        {/* photo */}
        {adminShop?.shopType !== 'food' && (
          <StyledFormField
            label="Photo"
            intputType="file"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              onDrop,
              accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
              maxSize: 1000 * 1000,
              text: 'Drag and drop or chose photo',
              files: category.image,
              helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
              helperText2: 'Pixels: Minimum 320 for width and height',
            }}
          />
        )}
        {/* description */}
        <StyledFormField
          label={
            <span>
              Notes
              <span
                style={{
                  color: '#7E8299',
                }}
              >
                {' '}
                (only visible to you)
              </span>
            </span>
          }
          intputType="textarea"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            name: 'description',
            value: category.description,
            onChange: commonChangeHandler,
            multiline: true,
          }}
        />
      </Box>
      <Stack
        height="100%"
        sx={{
          height: 'auto',
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          padding: '24px 16px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<DropIcon />}
          fullWidth
          onClick={onSubmit}
          disabled={categoryMutation?.isLoading}
        >
          Save Item
        </Button>
      </Stack>
    </SidebarContainer>
  );
}
