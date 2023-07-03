/* eslint-disable no-unused-vars */
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

import { useMutation, useQuery } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddCategory from '../Menu/AddCategory';
import { AddMenuButton } from '../Menu/Searchbar';
import CategoryTable from './CategoryTable';
import ViewCategoryContent from './ViewCategoryContent';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Categories List',
    to: '#',
  },
];

const categoryTypeIndex = {
  0: 'food',
  1: 'pharmacy',
  2: 'grocery',
};

const menuOptions = [
  { label: 'Add Category', value: 'add-category' },
  // { label: 'Add Sub-Category', value: 'add-sub-category' },
];

const queryParamsInit = {
  page: 1,
  pageSize: 15,
  sortBy: 'DESC',
  type: 'food',
  searchKey: '',
  status: '',
  userType: 'admin',
};

export default function CategoryList2() {
  const [currentTab, setCurrentTab] = useState(0);
  const [open, setOpen] = useState(null);

  const [queryParams, setQueryParams] = useState(queryParamsInit);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState({});

  const query = useQuery(
    [API_URL.GET_ALL_CATEGORY, queryParams],
    () =>
      AXIOS.get(API_URL.GET_ALL_CATEGORY, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  const updateQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_CATEGORY, data));

  // menu handler
  const menuHandler = (menu) => {
    if (menu === 'add-category') {
      setOpen('add-category');
    }
  };

  return (
    <Box pb={10}>
      <PageTop backButtonLabel="Back to Settings" breadcrumbItems={breadcrumbItems} backTo="/settings" />
      <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
            setQueryParams((prev) => ({ ...prev, type: categoryTypeIndex[newValue], page: 1 }));
          }}
        >
          <Tab label="Food" />
          <Tab label="Pharmacy" />
          <Tab label="Grocery" />
        </Tabs>
      </Box>
      <Box pb={7.5}>
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          searchPlaceHolder="Search Category"
          MenuButton={AddMenuButton}
          menuItems={menuOptions?.filter((opt) => opt.value !== 'add-sub-category' || currentTab !== 0)}
          menuHandler={menuHandler}
          hideFilters={{
            button: true,
            startDate: true,
            endDate: true,
          }}
        />
      </Box>
      <Box>
        {query.isLoading ? (
          <TableSkeleton rows={7} columns={['avatar', 'text', 'text', 'text']} />
        ) : (
          <CategoryTable
            onViewContent={(category) => {
              setOpen('view-category');
              setSelectedCategory(category);
            }}
            updateQuery={updateQuery}
            data={query?.data?.data?.categories}
            loading={query?.isLoading}
            type={queryParams.type}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            totalPage={totalPage}
          />
        )}
      </Box>
      <Drawer open={Boolean(open)} anchor="right">
        {open === 'view-category' && (
          <ViewCategoryContent
            onClose={() => {
              setOpen(null);
              setSelectedCategory({});
            }}
            category={selectedCategory}
          />
        )}
        {open === 'add-category' && (
          <AddCategory
            newCategoryShopType={categoryTypeIndex[currentTab]}
            viewUserType="admin"
            onClose={() => {
              setOpen(null);
              setSelectedCategory({});
            }}
          />
        )}
      </Drawer>
    </Box>
  );
}
