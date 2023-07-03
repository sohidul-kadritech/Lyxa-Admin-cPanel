import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import RestaurantsSkeleton from '../../Display/RestaurantsSkeleton';
import CategoryItem from './CategoryItem';
import ProductItem from './ProductItem';
import { searchProducts, searchSubCategoriesAndProduct } from './helper';

export default function ViewCategoryContent({ onClose, category }) {
  const [searchKey, setSearchKey] = useState({ searchKey: '' });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [, setRender] = useState(false);

  const setProductsAndCategory = (data) => {
    if (category?.type === 'food') {
      const items = [];
      data?.data?.productsGroupByCategory?.forEach((category) => {
        items.push(...(category?.sortedProducts || []));
      });
      setProducts(items);
    } else {
      const items = [];

      data?.data?.productsGroupByCategory?.forEach((category) => {
        items.push(...(category?.subCategories || []));
      });
      setCategories(items);
    }
  };

  const query = useQuery(
    [Api.CATEGORY_PRODUCTS_MULTIPLE, { categoryId: category?._id }],
    () =>
      AXIOS.post(Api.CATEGORY_PRODUCTS_MULTIPLE, {
        categoryIds: category?.ids,
      }),
    {
      onSuccess: (data) => {
        console.log({ data });
        setProductsAndCategory(data);
      },
    }
  );

  useEffect(() => {
    setProductsAndCategory(query?.data);
  }, []);

  useMemo(
    () => searchSubCategoriesAndProduct(categories, searchKey?.searchKey, setRender),
    [searchKey?.searchKey, categories]
  );

  useMemo(() => searchProducts(products, searchKey?.searchKey, setRender), [searchKey?.searchKey, products]);

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
              menu: true,
            }}
            queryParams={searchKey}
            setQueryParams={setSearchKey}
          />
        </Box>
        {query.isLoading && <RestaurantsSkeleton />}
        {!query.isLoading && !products.length && !categories.length && (
          <Box paddingTop="150px">
            <Typography variant="body2" color="text.secondary2" textAlign="center">
              Category is empty
            </Typography>
          </Box>
        )}
        {!query.isLoading && (
          <Box>
            {category?.type !== 'food' && (
              <Stack>
                {categories?.map((subCategory) =>
                  subCategory?.hidden ? null : (
                    <CategoryItem category={subCategory} key={subCategory?.subCategory?._id} />
                  )
                )}
              </Stack>
            )}
            {category?.type === 'food' && (
              <Stack pt={3}>
                {products?.map((product, i, { length: l }) =>
                  product?.hidden ? null : (
                    <ProductItem
                      product={product}
                      key={product._id}
                      isLast={i === l - 1}
                      isFirst={i === 0}
                      isCategory
                    />
                  )
                )}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </SidebarContainer>
  );
}
