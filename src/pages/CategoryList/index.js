import { Box, Drawer, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { statusTypeOptions } from '../CancelReason2/helper';
import { sortOptions } from '../Faq2/helpers';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
import CategoryTable from './CategoryTable';
import ViewCategory from './ViewCategory';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Category List',
    to: '#',
  },
];

const bannerTypeIndex = {
  0: 'food',
  1: 'pharmacy',
  2: 'grocery',
};

function CategoryList2() {
  const [currentTab, setCurrentTab] = useState(0);
  const [sortBy, setSortBy] = useState('desc');
  const [status, setStatus] = useState('active');
  const [type, setType] = useState('food');
  const [open, setOpen] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState({});

  //   const [range, setRange] = useState({ ...dateRangeInit });

  const [searchKey, setSearchKey] = useState('');

  // eslint-disable-next-line no-unused-vars
  const queryClient = useQueryClient();

  const getCategoryQuery = useQuery(
    [API_URL.GET_ALL_CATEGORY, { sortBy, searchKey, status, type, userType: 'admin' }],
    () =>
      // eslint-disable-next-line prettier/prettier
      AXIOS.get(API_URL.GET_ALL_CATEGORY, {
        params: { sortBy, status, searchKey, type, userType: 'admin' },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  const updateQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_CATEGORY, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.GET_ALL_CATEGORY);
      }
    },
  });

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

      <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
            setType(bannerTypeIndex[newValue]);
          }}
        >
          <Tab label="Food"></Tab>
          <Tab label="Pharmacy"></Tab>
          <Tab label="Grocery"></Tab>
        </Tabs>
      </Box>
      <Box>
        <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
          <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
          {/* <DateRange range={range} setRange={setRange} /> */}
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'sortBy',
              placeholder: 'sortBy',
              value: sortBy,
              items: sortOptions,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setSortBy(e.target.value),
            }}
          />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'status',
              placeholder: 'status',
              value: status,
              items: statusTypeOptions,
              size: 'sm2',
              onChange: (e) => setStatus(e.target.value),
            }}
          />
        </Stack>
      </Box>
      <Box>
        {getCategoryQuery.isLoading ? (
          <TablePageSkeleton row={5} column={4} />
        ) : (
          <CategoryTable
            setOpen={setOpen}
            setSelectedCategory={setSelectedCategory}
            updateQuery={updateQuery}
            data={getCategoryQuery?.data?.data?.categories}
            loading={getCategoryQuery?.isLoading}
            type={type}
          />
        )}
      </Box>

      <Drawer open={open} anchor="right">
        <ViewCategory
          onClose={() => {
            setOpen(false);
          }}
          selectedCategory={selectedCategory}
        />
      </Drawer>
    </Box>
  );
}

export default CategoryList2;
