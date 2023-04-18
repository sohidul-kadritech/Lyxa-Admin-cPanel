/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as DropIcon } from '../../assets/icons/down.svg';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import minInMiliSec from '../../helpers/minInMiliSec';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import SubCategoryList from './SubCategoryList';

const fieldContainerSx = {
  padding: '14px 0',
};

const subCategoryInit = {
  categoryId: '',
  subCategories: [],
};

export default function AddSubCategory({ onClose, editCategory }) {
  const shop = useSelector((store) => store.Login.admin);

  const [subCategory, setSubCategory] = useState(subCategoryInit);
  const [categories, setCategories] = useState();
  const [render, setRender] = useState(false);

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

  const onSubmit = () => {};

  const onDelete = (category) => {};

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
      <Box sx={fieldContainerSx}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: '600',
            fontSize: '15px',
            lineHeight: '18px',
            pb: 2,
          }}
        >
          Sub-Category
        </Typography>
        <SubCategoryList
          subCategories={subCategory.subCategories}
          onDelete={(item) => {
            subCategory.subCategories.filter((category) => category?.name === item?.name);
            setRender(!render);
          }}
        />
      </Box>
    </SidebarContainer>
  );
}
