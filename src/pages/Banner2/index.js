import { Box, Drawer, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

import moment from 'moment';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import SearchBar from '../../components/Common/CommonSearchbar';
import PageTop from '../../components/Common/PageTop';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';
import { successMsg } from '../../helpers/successMsg';
import useQueryParams from '../../helpers/useQueryParams';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { previewGenerator } from '../Sellers2/helpers';
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
  startDate: getFirstMonday('week').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  tab: 0,
  sortBy: 'DESC',
  status: 'active',
  type: 'home',

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
  // const [currentTab, setCurrentTab] = useState(0);
  // const [sortBy, setSortBy] = useState('desc');
  // const [status, setStatus] = useState('active');
  // const [type, setType] = useState('home');
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  // const [range, setRange] = useState({ ...dateRangeInit });
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');

  const queryClient = useQueryClient();

  const getBannerListQuery = useQuery([API_URL.BANNER_LIST, queryParams], () =>
    AXIOS.get(API_URL.BANNER_LIST, {
      params: queryParams,
    })
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

      <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={Number(queryParams?.tab)}
          onChange={(event, newValue) => {
            setQueryParams((prev) => ({ ...prev, tab: newValue, type: bannerTypeIndex[newValue] }));
            // setQueryParams
            // setCurrentTab(newValue);
            // setType(bannerTypeIndex[newValue]);
          }}
        >
          <Tab label="Home"></Tab>
          {/* <Tab label="Shop"></Tab> */}
          <Tab label="Food"></Tab>
          <Tab label="Pharmacy"></Tab>
          <Tab label="Grocery"></Tab>
        </Tabs>
      </Box>
      <Box sx={{ marginBottom: '30px' }}>
        <SearchBar
          showFilters={{
            search: true,
            date: true,
            sort: true,
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
        />
        {/* <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
          <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
          <DateRange range={range} setRange={setRange} />
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
              //   items: categories,
              onChange: (e) => setStatus(e.target.value),
            }}
          />
         <AddMenuButton
            onClick={() => {
              setRowData({});
              setOpen(true);
            }}
          />
        </Stack> */}
      </Box>
      <Box>
        {getBannerListQuery.isLoading ? (
          // <TablePageSkeleton row={5} column={4} />
          <BannerTableSkeleton row={5} column={4} />
        ) : (
          <AddBannerTable
            type={queryParams?.type}
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
          rowData={
            isEdit || isReadOnly
              ? {
                  ...rowData,
                  clickType: rowData?.clickType ? rowData?.clickType : 'link',
                  isClickable: rowData?.isClickable ? 'yes' : 'no',
                  image: previewGenerator(rowData?.image),
                }
              : undefined
          }
          addQuery={isEdit ? editBannerQuery : addBannerQuery}
          type={queryParams?.type}
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
