import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete-icon.svg';
import { ReactComponent as DropIcon } from '../../assets/icons/down.svg';
import { confirmActionInit } from '../../assets/staticData';
import ConfirmModal from '../../components/Common/ConfirmModal';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import { getImageUrl } from '../../helpers/images';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { validateCategory } from './helpers';

const getCategoryInit = (shopType, shopId) => ({
  name: '',
  image: [],
  type: shopType,
  note: '',
  shopId,
});

const getEditCategoryData = (editCategory) => ({
  name: editCategory?.category?.name,
  type: editCategory?.type,
  note: editCategory?.category?.note,
  image: [{ preview: editCategory?.category?.image }],
  id: editCategory?._id,
  // has only for multiple category type else will be undefined
  ids: editCategory?.ids,
});

export default function AddCategory({ onClose, editCategory, shopId, shopType, multiple }) {
  const queryClient = useQueryClient();

  const [confirmModal] = useState(false);
  const [confirmAction] = useState(confirmActionInit);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState(
    editCategory?._id ? getEditCategoryData(editCategory) : getCategoryInit(shopType, shopId)
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
      const EDIT_API = multiple ? Api.CATEGORY_UPDATE_MULTIPLE : Api.EDIT_CATEGORY;
      const API = editCategory?._id ? EDIT_API : Api.ADD_CATEGORY;

      return AXIOS.request({
        url: API,
        method: 'POST',
        data,
      });
    },
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : '');
        console.log(data);

        if (data?.status) {
          queryClient.invalidateQueries('category-wise-products');
          queryClient.invalidateQueries([Api.GET_ALL_CATEGORY]);
          onClose();
        }
      },
    }
  );

  const onSubmit = async () => {
    const valid = validateCategory(category);

    if (!valid?.status) {
      successMsg(valid?.msg);
      return;
    }

    let imgUrl;

    if (shopType !== 'food') {
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
    });

    setLoading(false);
  };

  // delete category
  const deleteCategoryMutation = useMutation(() => AXIOS.post(Api.DELETE_CATEGORY, { id: editCategory?._id }), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries('category-wise-products');
        queryClient.invalidateQueries([Api.GET_ALL_CATEGORY]);
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
            inputProps={{
              type: 'text',
              name: 'name',
              value: category.name,
              onChange: commonChangeHandler,
            }}
          />
          {/* photo */}
          {shopType !== 'food' && (
            <StyledFormField
              label="Photo"
              intputType="file"
              inputProps={{
                onDrop,
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
