/* eslint-disable no-unused-vars */
import { Box, Stack } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CategoryItem from './CategoryItem';
import ProductItem from './ProductItem';

const searchItem = (subCategories, qString) => {
  subCategories?.forEach((subCategory) => {
    let name = (subCategory.subCategory?.name || '').toUpperCase();

    if (name.search(qString.toUpperCase()) === -1) {
      subCategory.hidden = true;

      subCategory?.sortedProducts?.forEach((product) => {
        name = (product?.name || '').toUpperCase();
        if (name.search(qString.toUpperCase()) !== -1) {
          subCategory.hidden = false;
          product.hidden = false;
        } else {
          product.hidden = true;
        }
      });
    } else {
      subCategory.hidden = false;
      subCategory?.sortedProducts?.forEach((product) => {
        name = (product?.name || '').toUpperCase();

        if (name.search(qString.toUpperCase()) !== -1) {
          product.hidden = false;
        } else {
          product.hidden = true;
        }
      });
    }
  });
};

export default function ViewCategory({ onClose, category }) {
  const [searchKey, setSearchKey] = useState({ searchKey: '' });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const query = useQuery(
    [Api.CATEGORY_PRODUCTS, { categoryId: category?._id }],
    () =>
      AXIOS.get(Api.CATEGORY_PRODUCTS, {
        params: {
          categoryId: category?._id,
        },
      }),
    {
      onSuccess: (data) => {
        if (category?.type === 'food') {
          const items = data?.data?.productsGroupByCategory?.length
            ? query?.data?.data?.productsGroupByCategory[0]?.sortedProducts
            : [];
          setProducts(items);
        } else {
          const items = data?.data?.productsGroupByCategory?.length
            ? query?.data?.data?.productsGroupByCategory[0]?.subCategories
            : [];
          setCategories(items);
        }
      },
    }
  );

  useMemo(() => searchItem(categories, searchKey?.searchKey), [searchKey?.searchKey]);

  return (
    <SidebarContainer title={category?.category?.name} onClose={onClose}>
      <Box pb={5}>
        <Box pt={1} pb={5}>
          <SearchBar
            searchPlaceHolder="Search"
            hideFilters={{
              button: true,
              startDate: true,
              endDate: true,
              status: true,
              sort: true,
            }}
            queryParams={searchKey}
            setQueryParams={setSearchKey}
          />
        </Box>
        {category?.type !== 'food' && (
          <Stack>
            {categories?.map((subCategory) =>
              subCategory?.hidden ? null : <CategoryItem category={subCategory} key={subCategory?.subCategory?._id} />
            )}
          </Stack>
        )}
        {category?.type === 'food' && (
          <Stack pt={3}>
            {products?.map((product, i, { length: l }) =>
              product?.hidden ? null : (
                <ProductItem product={product} key={product._id} isLast={i === l - 1} isFirst={i === 0} isCategory />
              )
            )}
          </Stack>
        )}
      </Box>
    </SidebarContainer>
  );
}
