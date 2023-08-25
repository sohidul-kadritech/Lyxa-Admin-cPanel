import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { dateRangeInit, sortOptions } from '../Faq2/helpers';
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
  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [range, setRange] = useState({ ...dateRangeInit });
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState('active');
  const [sort, setSort] = useState('asc');
  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState('food');
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const queryClient = useQueryClient();
  const url = currentUser.userType === 'admin' ? API_URL.ALL_PRODUCT : '';

  const getAllProduct = useQuery(
    [url, { status, type, sort, searchKey, startDate: range.start, endDate: range.end }],
    () =>
      AXIOS.get(url, {
        params: {
          status,
          sort,
          type,
          searchKey,
          startDate: range.start,
          endDate: range.end,
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  // eslint-disable-next-line no-unused-vars
  const updateStatusQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_PRODUCT, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(url);
      }
    },
  });

  console.log('data', getAllProduct?.data?.data?.products);

  // const getCurrentCurrency = JSON.parse(localStorage.getItem('currency'));
  const { general } = useGlobalContext();
  const getCurrentCurrency = general?.currency;

  console.log('currency', getCurrentCurrency);

  return (
    <Box>
      <PageTop
        // title="Zone"
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
              return newValue;
            });
            // setIsSideBarOpen(false);
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
        <ProductList
          data={getAllProduct?.data?.data?.products}
          getCurrentCurrency={getCurrentCurrency}
          updateStatusQuery={updateStatusQuery}
        />
      )}
    </Box>
  );
}

export default Product;
