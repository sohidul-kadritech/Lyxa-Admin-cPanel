/* eslint-disable no-unused-vars */
import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete-icon.svg';
import { ReactComponent as DropIcon } from '../../assets/icons/down.svg';
import { confirmActionInit } from '../../assets/staticData';
import ConfirmModal from '../../components/Common/ConfirmModal';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { useGlobalContext } from '../../context';
import { getImageUrl } from '../../helpers/images';
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
  type: shopType,
  note: '',
});

const getEditCategoryData = (editCategory, shopType) => {
  const category = {
    name: editCategory?.category.name || '',
    type: shopType,
    note: editCategory?.category.note || '',
  };

  if (shopType === 'food') {
    return category;
  }

  return {
    ...category,
    image: [{ preview: editCategory?.category?.image }],
  };
};

export default function AddCategory({ onClose, editCategory }) {
  // const shop = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(confirmActionInit);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState(
    // eslint-disable-next-line prettier/prettier
    editCategory?._id ? getEditCategoryData(editCategory, shop?.shopType) : getCategoryInit(shop?.shopType),
  );

  // input handler
  const commonChangeHandler = (e) => {
    setCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // file handler
  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
      }),
    );

    setCategory((prev) => ({
      ...prev,
      image: newFiles?.length > 0 ? newFiles : prev.image,
    }));
  };

  // categoryMutation
  const categoryMutation = useMutation(
    (data) => {
      const API = editCategory?._id ? Api.EDIT_CATEGORY : Api.ADD_CATEGORY;
      return AXIOS.request({
        url: API,
        method: 'POST',
        data,
        // params: {
        //   userType: 'shop',
        // },
      });
    },
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : '');
        console.log(data);

        if (data?.status) {
          queryClient.invalidateQueries('category-wise-products');
          onClose();
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const onSubmit = async () => {
    const valid = validateCategory(category);

    if (!valid?.status) {
      successMsg(valid?.msg);
      return;
    }

    let imgUrl;

    if (shop?.shopType !== 'food') {
      setLoading(true);
      imgUrl = await getImageUrl(category?.image[0]);

      if (!imgUrl) {
        setLoading(false);
        successMsg('Error while uploading image');
        return;
      }
    }

    categoryMutation.mutate({
      ...category,
      image: imgUrl,
      id: editCategory?._id,
      shopId: shop._id,
    });

    setLoading(false);
  };

  // delete category
  const deleteCategoryMutation = useMutation((data) => AXIOS.post(Api.DELETE_CATEGORY, { id: editCategory?._id }), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries('category-wise-products');
        onClose();
      }
    },
  });

  return (
    <>
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
          {shop?.shopType !== 'food' && (
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
          {/* note */}
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
              name: 'note',
              value: category.note,
              onChange: commonChangeHandler,
              multiline: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<DropIcon />}
            fullWidth
            onClick={onSubmit}
            disabled={categoryMutation?.isLoading || loading}
            sx={{
              marginTop: '14px',
            }}
          >
            Save Item
          </Button>
        </Box>
        {editCategory?._id && (
          <Button
            disableRipple
            variant="text"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={deleteCategoryMutation.mutate}
            disabled={deleteCategoryMutation.isLoading}
            fullWidth
            sx={{
              marginTop: '20px',
            }}
          >
            Delete Category
          </Button>
        )}
      </SidebarContainer>
      <ConfirmModal
        message={confirmAction.message}
        isOpen={confirmModal}
        blurClose
        onCancel={confirmAction.onCancel}
        onConfirm={confirmAction.onConfirm}
      />
    </>
  );
}
