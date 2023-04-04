/* eslint-disable no-unused-vars */
// thrid pary
import { West } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

// project import
import BreadCrumbs from '../../../components/Common/BreadCrumb2';
import PageButton from '../../../components/Common/PageButton';
import Wrapper from '../../../components/Wrapper';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CommonFilters from '../CommonFilters';
import AddContainer from './AddContainer';
import ListTable from './ListTable';

const breadcrumbItems = [
  { label: 'Display', to: '/display' },
  { label: 'List Contianer', to: '#' },
];

const typeToTabIndexMap = {
  0: 'food',
  1: 'grocery',
  2: 'pharmacy',
};

const filtersInit = {
  searchKey: '',
  status: '',
  date: {
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().endOf('month').format('YYYY-MM-DD'),
  },
};

export default function ListContainers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [filters, setFilters] = useState(filtersInit);

  // lis query
  const listQuery = useQuery(
    [
      'list-containers',
      {
        status: filters.status,
        searchKey: filters.searchKey,
        startDate: filters.date.start,
        endDate: filters.date.end,
        shopType: typeToTabIndexMap[currentTab],
      },
    ],
    () =>
      AXIOS.get(Api.GET_ALL_LIST_CONTAINERS, {
        params: {
          page: 1,
          pageSize: 500,
          sortBy: 'asc',
          status: filters.status,
          searchKey: filters.searchKey,
          startDate: filters.date.start,
          endDate: filters.date.end,
          shopType: typeToTabIndexMap[currentTab],
        },
      })
  );

  const items = listQuery.data?.data?.listContainer || [];

  // list sorting
  const listSortingMutation = useMutation((data) => AXIOS.post(Api.SORT_LIST_CONTAINERS, data));

  const dropSort = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;

    const item = items.splice(removedIndex, 1);
    items.splice(addedIndex, 0, item[0]);

    listSortingMutation.mutate({
      list: items.map((item, index) => ({
        id: item?._id,
        sortingOrder: index + 1,
      })),
    });
  };

  // list edit
  const [currentItem, setCurrentItem] = useState({});

  // three dot handler
  const threeDotHandler = (menu, item) => {
    if (menu === 'edit') {
      setCurrentItem(item);
      setSidebarOpen(true);
    }
  };

  return (
    <Wrapper
      sx={{
        paddingTop: 0,
      }}
    >
      <Box className="page-content2" sx={{ height: '100vh', overflowY: 'scroll' }}>
        <Box pt={9}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <PageButton label="Back to Display" to="/display" startIcon={<West />} />
            <Button
              color="secondary"
              variant="contained"
              sx={{
                borderRadius: '8px',
              }}
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              Create
            </Button>
          </Stack>
          <BreadCrumbs
            items={breadcrumbItems}
            sx={{
              pt: 6.5,
            }}
          />
        </Box>
        <Box>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
          >
            <Tab label="Food" />
            <Tab label="Grocery" />
            <Tab label="Pharmacy" />
          </Tabs>
          <Box pt={7}>
            <CommonFilters
              filtersValue={filters}
              setFiltersValue={setFilters}
              searchPlaceHolder={`Search ${listQuery.data?.data?.listContainer?.length || 0} items`}
            />
            {/* table */}
            <ListTable
              items={items}
              loading={listQuery.isLoading}
              onDrop={dropSort}
              handleMenuClick={threeDotHandler}
            />
          </Box>
        </Box>
      </Box>
      {/* sidebar */}
      <Drawer anchor="right" open={sidebarOpen}>
        <AddContainer
          shopType={typeToTabIndexMap[currentTab]}
          editContainer={currentItem}
          onClose={() => {
            setSidebarOpen(false);
            setCurrentItem({});
          }}
        />
      </Drawer>
    </Wrapper>
  );
}
