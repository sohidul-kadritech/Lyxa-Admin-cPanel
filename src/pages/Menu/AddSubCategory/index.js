/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import minInMiliSec from '../../../helpers/minInMiliSec';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SubCategoryList from './SubCategoryList';
import { addSubCategoriesInit, createCategoriesData, validateAddSubCategories } from './helpers';

const fieldContainerSx = {
  padding: '14px 0',
};

export default function AddSubCategory({ onClose, editCategory }) {
  const shop = useSelector((store) => store.Login.admin);

  const [subCategory, setSubCategory] = useState(addSubCategoriesInit);
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

  // add sub categoreis mutation
  const addSubCategoryMutation = useMutation((data) => AXIOS.post(Api.ADD_SUB_CATEGORY, data), {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const onSubmit = () => {
    const filteredCategories = subCategory.subCategories.filter((category) => !!category?.name?.trim());

    if (filteredCategories?.length < 1) {
      successMsg('Must have at least 1 sub category');
      return;
    }

    // mutating state to ensure latest value
    subCategory.subCategories = filteredCategories;
    setRender(!render);

    const validationStatus = validateAddSubCategories(subCategory);

    if (!validationStatus.status) {
      successMsg(validationStatus.message);
      return;
    }

    const categoriesData = createCategoriesData(subCategory);

    // categoriesData?.mutate()
    categoriesData.subCategories.forEach((category) => {
      addSubCategoryMutation.mutate(category);
    });
  };

  return (
    <SidebarContainer title="Add Category" onClose={onClose}>
      <Box>
        {/* name */}
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
          subCategories={subCategory.subCategories}
          onDelete={(item) => {
            setSubCategory((prev) => ({
              ...prev,
              subCategories: prev.subCategories.filter((category) => category?.id !== item?.id),
            }));
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
        <Button variant="contained" color="primary" startIcon={<DropIcon />} fullWidth onClick={onSubmit}>
          Save Item
        </Button>
      </Stack>
    </SidebarContainer>
  );
}
