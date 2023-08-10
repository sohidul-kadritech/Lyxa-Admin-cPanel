import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import { local_product_category_search, local_product_category_subCategory_search } from '../../../helpers/localSearch';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import RestaurantsSkeleton from '../../Display/RestaurantsSkeleton';
import CategoryItem from './CategoryItem';

export default function ViewCategoryContent({ onClose, category }) {
  const [searchKey, setSearchKey] = useState({ searchKey: '' });
  const [, setRender] = useState(false);
  const [isCategoryEmpty, setIsCategoryEmpty] = useState(false);

  const checkIsCategoryEmpty = (data) => {
    let empty = true;

    if (category?.type === 'food') {
      data?.data?.productsGroupByCategory?.forEach((category) => {
        if (category?.sortedProducts?.length) empty = false;
      });
    } else {
      data?.data?.productsGroupByCategory?.forEach((category) => {
        if (category?.subCategories?.length) empty = false;
      });
    }

    setIsCategoryEmpty(empty);
  };

  const query = useQuery(
    [Api.CATEGORY_PRODUCTS_MULTIPLE, { categoryId: category?._id }],
    () =>
      AXIOS.post(Api.CATEGORY_PRODUCTS_MULTIPLE, {
        categoryIds: category?.ids,
      }),
    {
      onSuccess: (data) => {
        checkIsCategoryEmpty(data);
      },
    }
  );

  useEffect(() => {
    if (query?.data) checkIsCategoryEmpty(query?.data);
  }, []);

  useEffect(() => {
    if (category?.type === 'food') {
      local_product_category_search(searchKey?.searchKey, query?.data?.data?.productsGroupByCategory || []);
    } else {
      local_product_category_subCategory_search(searchKey?.searchKey, query?.data?.data?.productsGroupByCategory || []);
    }
    setRender((prev) => !prev);
  }, [query?.data, searchKey?.searchKey]);

  return (
    <SidebarContainer title={category?.category?.name} onClose={onClose}>
      <Box pb={5}>
        <Box pt={1} pb={5}>
          <SearchBar
            searchPlaceHolder="Search"
            searchDebounceTime={10}
            showFilters={{
              search: true,
            }}
            queryParams={searchKey}
            setQueryParams={setSearchKey}
          />
        </Box>
        {query.isLoading && <RestaurantsSkeleton />}
        {!query.isLoading && isCategoryEmpty && (
          <Box paddingTop="150px">
            <Typography variant="body2" color="text.secondary2" textAlign="center">
              Category is empty
            </Typography>
          </Box>
        )}
        {!query.isLoading && !isCategoryEmpty && (
          <Box>
            {query?.data?.data?.productsGroupByCategory?.map((category) => (
              <CategoryItem key={category?.category?._id} category={category} />
            ))}
          </Box>
        )}
      </Box>
    </SidebarContainer>
  );
}
