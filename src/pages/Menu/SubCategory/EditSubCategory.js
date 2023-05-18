/* eslint-disable no-unused-vars */
import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/delete-icon.svg';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import { confirmActionInit } from '../../../assets/staticData';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import { useGlobalContext } from '../../../context/GlobalContext';
import minInMiliSec from '../../../helpers/minInMiliSec';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { validateSubCategory } from '../helpers';
import PageSkeleton from './PageSkeleton';

const fieldContainerSx = {
  padding: '14px 0',
};

export default function EditSubCategory({ onClose, editSubCategory }) {
  // const shop = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  const queryClient = useQueryClient();

  const categoriesQuery = useQuery(
    ['single-shop-category', { shopId: shop?._id }],
    () =>
      AXIOS.get(Api.GET_ALL_CATEGORY, {
        params: {
          page: 1,
          pageSize: 100,
          searchKey: '',
          sortBy: 'desc',
          status: 'active',
          type: shop?.shopType,
          userType: 'shop',
        },
      }),
    {
      staleTime: minInMiliSec(10),
      onSuccess: (data) => {},
    }
  );

  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(confirmActionInit);

  const [subCategory, setSubCategory] = useState(editSubCategory);

  // input handler
  const commonChangeHandler = (e) => {
    console.log(e);
    setSubCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // categoryMutation
  const subCategoryMutation = useMutation((data) => AXIOS.post(Api.EDIT_SUB_CATEGORY, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : '');
      console.log(data);

      if (data?.status) {
        queryClient.invalidateQueries('category-wise-products');
        onClose();
      }
    },
  });

  const onSubmit = async () => {
    const valid = validateSubCategory(subCategory);

    if (!valid?.status) {
      successMsg(valid?.msg);
      return;
    }

    subCategoryMutation.mutate({
      ...subCategory,
      id: subCategory?._id,
    });
  };

  // delete category
  const deleteCategoryMutation = useMutation(
    (data) => AXIOS.post(Api.DELETE_SUB_CATEGORY, { id: editSubCategory?._id }),
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : undefined);

        if (data?.status) {
          queryClient.invalidateQueries('category-wise-products');
          onClose();
        }
      },
    }
  );

  return (
    <>
      <SidebarContainer title="Edit Sub-Category" onClose={onClose}>
        {categoriesQuery?.isLoading && <PageSkeleton isEdit />}
        {!categoriesQuery?.isLoading && (
          <Box>
            {/* category */}
            <StyledFormField
              label="Category"
              intputType="select"
              containerProps={{
                sx: fieldContainerSx,
              }}
              inputProps={{
                name: 'category',
                value: subCategory?.category,
                items: categoriesQuery?.data?.data?.categories || [],
                onChange: commonChangeHandler,
                readOnly: true,
                getKey: (c) => c?.category?._id,
                getLabel: (c) => c?.category?.name,
                getValue: (c) => c?.category?._id,
                getDisplayValue: (value) =>
                  categoriesQuery?.data?.data?.categories?.find((category) => category?.category?._id === value)
                    ?.name || '',
              }}
            />
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
                value: subCategory.name,
                onChange: commonChangeHandler,
              }}
            />
            <Stack
            // height="100%"
            // sx={{
            //   height: 'auto',
            //   position: 'absolute',
            //   left: '0',
            //   right: '0',
            //   bottom: '0',
            //   padding: '24px 16px',
            // }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<DropIcon />}
                fullWidth
                onClick={onSubmit}
                disabled={subCategoryMutation?.isLoading}
                sx={{
                  marginTop: '14px',
                }}
              >
                Save Item
              </Button>
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
                Delete Sub-Category
              </Button>
            </Stack>
          </Box>
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
