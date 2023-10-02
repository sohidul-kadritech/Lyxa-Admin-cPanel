/* eslint-disable no-unused-vars */
import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import TablePagination from '../../components/Common/TablePagination';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { sortOptions } from '../Faq2/helpers';
import ProductList from './ProductList';
import ProductPageSkeleton from './ProductPageSkeleton';
import { shopType, statusTypeOptions } from './helpers';

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

function Product() {
  const { currentUser } = useGlobalContext();
  console.log(currentUser);

  const [currentTab, setCurrentTab] = useState(0);

  const [status, setStatus] = useState('active');

  const [sort, setSort] = useState('asc');

  const [type, setType] = useState('food');

  const [page, setPage] = useState(1);

  const [searchKey, setSearchKey] = useState('');

  const queryClient = useQueryClient();
  const url = currentUser.userType === 'admin' ? API_URL.ALL_PRODUCT : '';

  const getAllProduct = useQuery([url, { status, type, sort, searchKey, page }], () =>
    AXIOS.get(url, {
      params: {
        status,
        sort,
        type,
        searchKey,
        pageSize: 10,
        page,
      },
      // eslint-disable-next-line prettier/prettier
    }),
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
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(() => {
              setType(shopType[newValue]);
              setPage(1);
              return newValue;
            });
          }}
        >
          <Tab label="Food"></Tab>
          <Tab label="Grocery"></Tab>
          <Tab label="Pharmacy"></Tab>
        </Tabs>
      </Box>

      <Box marginBottom="30px">
        <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
          <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'sort',
              placeholder: 'Sort',
              value: sort,
              items: sortOptions,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setSort(e.target.value),
            }}
          />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'status',
              placeholder: 'Status',
              value: status,
              items: statusTypeOptions,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setStatus(e.target.value),
            }}
          />
          {/* <AddMenuButton onClick={() => setOpen(true)} /> */}
        </Stack>
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
            currentPage={page}
            totalPage={getAllProduct?.data?.data?.paginate?.metadata?.page?.totalPage}
            lisener={(page) => setPage(page)}
          />
        </Box>
      )}
    </Box>
  );
}

export default Product;
