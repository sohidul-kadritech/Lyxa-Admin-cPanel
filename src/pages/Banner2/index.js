/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box, Drawer } from '@mui/material';
import React, { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import { successMsg } from '../../helpers/successMsg';
import useQueryParams from '../../helpers/useQueryParams';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddBanner from './AddBanner';
import BannerTableSkeleton from './BannerTableSkeleton';
import AddBannerTable from './Table';

const breadcrumbItems = [
  {
    label: 'Display',
    to: '/display',
  },
  {
    label: 'Ads Banner',
    to: '#',
  },
];

const bannerTypeIndex = {
  0: 'home',
  1: 'food',
  2: 'pharmacy',
  3: 'grocery',
};

const queryParamsInit = {
  // startDate: getFirstMonday('week').format('YYYY-MM-DD'),
  // endDate: moment().format('YYYY-MM-DD'),
  tab: 0,
  sortBy: 'DESC',
  status: 'active',

  page: 1,
  pageSize: 5,
  searchKey: '',
};

// const bannerTypeIndex = {
//   0: 'home',
//   1: 'shop',
//   2: 'food',
//   3: 'pharmacy',
//   4: 'grocery',
// };

function AdBanner() {
  const [queryParams, setQueryParams] = useQueryParams({ ...queryParamsInit });

  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState({});

  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [searchKey, setSearchKey] = useState('');

  const queryClient = useQueryClient();

  const getBannerListQuery = useQuery([API_URL.BANNER_LIST, queryParams], () =>
    AXIOS.get(API_URL.BANNER_LIST, {
      params: { ...queryParams, type: 'home' },
    }),
  );

  const addBannerQuery = useMutation((data) => AXIOS.post(API_URL.ADD_BANNER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.BANNER_LIST);
        setOpen(false);
      }
    },
  });

  const editBannerQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_BANNER, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.BANNER_LIST);
        setOpen(false);
      }
    },
  });
  const deleteQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_BANNER, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL.BANNER_LIST);
        successMsg(data.message, 'success');
        setOpen(false);
        setIsConfirmModal(false);
      }
    },
  });

  const bannerSortQuery = useMutation((data) => AXIOS.post(API_URL.SORT_BANNER, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(API_URL.BANNER_LIST);
        setOpen(false);
        setIsConfirmModal(false);
      }
    },
  });

  const dropSort = ({ removedIndex, addedIndex }) => {
    console.log({ removedIndex, addedIndex });
    if (removedIndex === null || addedIndex === null) return;

    const item = getBannerListQuery?.data?.data?.banners.splice(removedIndex, 1);
    getBannerListQuery?.data?.data?.banners.splice(addedIndex, 0, item[0]);
    bannerSortQuery.mutate({
      banners: getBannerListQuery?.data?.data?.banners.map((item, index) => ({
        id: item._id,
        sortingOrder: index + 1,
      })),
    });
  };

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Display"
        breadcrumbItems={breadcrumbItems}
        backTo="/display"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      {/* <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={Number(queryParams?.tab)}
          onChange={(event, newValue) => {
            setQueryParams((prev) => ({ ...prev, tab: newValue, type: bannerTypeIndex[newValue] }));
          }}
        >
          <Tab label="Home"></Tab>

          <Tab label="Food"></Tab>
          <Tab label="Pharmacy"></Tab>
          <Tab label="Grocery"></Tab>
        </Tabs>
      </Box> */}

      <Box sx={{ marginBottom: '30px' }}>
        <SearchBar
          showFilters={{
            search: true,
            date: false,
            sort: false,
            status: true,
            button: true,
          }}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          buttonLabel="Add"
          onButtonClick={() => {
            setRowData({});
            setOpen(true);
          }}
          searchPlaceHolder="Search by Title"
          toolTips={{
            dateTooltip: 'Filter with date range',
            sortTooltip: 'Sort By Creation Date',
            statusTooltip: 'Status',
          }}
        />
      </Box>
      <Box pb={15}>
        {getBannerListQuery.isLoading ? (
          // <TablePageSkeleton row={5} column={4} />
          <BannerTableSkeleton row={5} column={4} />
        ) : (
          <AddBannerTable
            type="home"
            onDrop={dropSort}
            // type={queryParams?.type}
            updateQuery={editBannerQuery}
            setIsConfirmModal={setIsConfirmModal}
            isConfirmModal={isConfirmModal}
            deleteQuery={deleteQuery}
            setIsReadOnly={setIsReadOnly}
            setIsEdit={setIsEdit}
            setOpen={setOpen}
            setRowData={setRowData}
            data={getBannerListQuery?.data?.data?.banners}
            loading={getBannerListQuery?.isLoading}
          />
        )}
      </Box>
      <Drawer open={open} anchor="right">
        <AddBanner
          isReadOnly={isReadOnly}
          isEdit={isEdit}
          rowData={rowData}
          addQuery={isEdit ? editBannerQuery : addBannerQuery}
          type="home"
          // type={queryParams?.type}
          onClose={() => {
            setOpen(false);
            setIsReadOnly(false);
            setRowData({});
            setIsEdit(false);
          }}
        />
      </Drawer>
    </Box>
  );
}

export default AdBanner;
