/* eslint-disable no-unused-vars */
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import TablePagination from '../../components/Common/TablePagination';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import useQueryParams from '../../helpers/useQueryParams';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import ProductList from './ProductList';
import ProductPageSkeleton from './ProductPageSkeleton';
import { shopType } from './helpers';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '#',
  },
  {
    label: 'Products',
    to: '#',
  },
];

export const queryParamsInit = {
  currentTab: 0,
  status: 'active',
  sortBy: 'DESC',
  searchKey: '',
};

function Product() {
  const { currentUser } = useGlobalContext();
  const [queryParams, setQueryParams] = useQueryParams(queryParamsInit);

  const queryClient = useQueryClient();
  const url = currentUser.userType === 'admin' ? API_URL.ALL_PRODUCT : '';

  const getAllProduct = useQuery([url, queryParams], () =>
    AXIOS.get(url, {
      params: queryParams,
    })
  );

  const updateStatusQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_PRODUCT, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(url);
      }
    },
  });

  const { general } = useGlobalContext();
  const getCurrentCurrency = general?.currency;

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Box marginBottom="20px">
        <Tabs
          value={Number(queryParams?.currentTab)}
          onChange={(event, newValue) => {
            setQueryParams((prev) => ({ ...prev, type: shopType[newValue], currentTab: newValue }));
          }}
        >
          <Tab label="Food"></Tab>
          <Tab label="Grocery"></Tab>
          <Tab label="Pharmacy"></Tab>
        </Tabs>
      </Box>

      <Box marginBottom="30px">
        <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} />
      </Box>
      {getAllProduct?.isLoading ? (
        <Box
          sx={{
            padding: '20px',
          }}
        >
          <ProductPageSkeleton />
        </Box>
      ) : (
        <Box mb={80 / 4}>
          <ProductList
            data={getAllProduct?.data?.data?.products}
            getCurrentCurrency={getCurrentCurrency}
            updateStatusQuery={updateStatusQuery}
          />

          <TablePagination
            currentPage={Number(queryParams?.page)}
            totalPage={getAllProduct?.data?.data?.paginate?.metadata?.page?.totalPage}
            lisener={(page) => setQueryParams((prev) => ({ ...prev, page }))}
          />
        </Box>
      )}
    </Box>
  );
}

export default Product;
