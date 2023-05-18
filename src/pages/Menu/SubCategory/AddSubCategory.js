/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import { useGlobalContext } from '../../../context/GlobalContext';
import minInMiliSec from '../../../helpers/minInMiliSec';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import PageSkeleton from './PageSkeleton';
import SubCategoryList from './SubCategoryList';
import { createCategoriesData, getAddSubCategoriesInit, validateAddSubCategories } from './helpers';

const fieldContainerSx = {
  padding: '14px 0',
};

export default function AddSubCategory({ onClose, editCategory, newSubCategoryId }) {
  // const shop = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { userType, shop } = currentUser;

  const queryClient = useQueryClient();

  const [subCategory, setSubCategory] = useState(getAddSubCategoriesInit(newSubCategoryId));
  const [successCounter, setSuccessCounter] = useState(0);
  const [categories, setCategories] = useState();
  const [render, setRender] = useState(false);

  // parent categories query
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
      onSuccess: (data) => {
        setCategories(
          (prev) => data?.data?.categories?.map((c) => ({ value: c?.category?._id, label: c?.category?.name })) || prev
        );
      },
    }
  );

  useEffect(() => {
    if (categoriesQuery.data?.status) {
      setCategories(
        (prev) =>
          categoriesQuery.data?.data?.categories?.map((c) => ({ value: c?.category?._id, label: c?.category?.name })) ||
          prev
      );
    }
  }, []);

  // add sub categoreis mutation
  const addSubCategoryMutation = useMutation((data) => AXIOS.post(Api.ADD_SUB_CATEGORY, data), {
    onSuccess: (data) => {
      console.log(data);
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        queryClient.invalidateQueries(['category-wise-products']);

        onClose();
      }
    },
  });

  const onSubmit = () => {
    const filteredCategories = subCategory.categories.filter((category) => !!category?.name?.trim());

    if (filteredCategories?.length < 1) {
      successMsg('Must have at least 1 sub category');
      return;
    }

    // mutating state to ensure latest value
    subCategory.categories = filteredCategories;
    setRender(!render);

    const validationStatus = validateAddSubCategories(subCategory);

    if (!validationStatus.status) {
      successMsg(validationStatus.message);
      return;
    }

    addSubCategoryMutation.mutate(createCategoriesData(subCategory));
  };

  return (
    <SidebarContainer title="Add Sub-Category" onClose={onClose}>
      {categoriesQuery?.isLoading && <PageSkeleton />}
      {!categoriesQuery?.isLoading && (
        <Box>
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
                value: subCategory.categoryId,
                items: categories || [],
                readOnly: Boolean(newSubCategoryId),
                onChange: (e) => {
                  setSubCategory((prev) => ({ ...prev, categoryId: e.target.value }));
                },
              }}
            />
          </Box>
          <Box sx={fieldContainerSx}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: '600',
                fontSize: '15px',
                lineHeight: '18px',
                pb: 2.5,
              }}
            >
              Sub-Category
            </Typography>
            <SubCategoryList
              subCategories={subCategory.categories}
              onDelete={(item) => {
                setSubCategory((prev) => ({
                  ...prev,
                  categories: prev.categories.filter((category) => category?.id !== item?.id),
                }));
              }}
            />
          </Box>
          <Stack pt={10}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DropIcon />}
              fullWidth
              disabled={addSubCategoryMutation.isLoading}
              onClick={onSubmit}
            >
              Add Items
            </Button>
          </Stack>
        </Box>
      )}
    </SidebarContainer>
  );
}
