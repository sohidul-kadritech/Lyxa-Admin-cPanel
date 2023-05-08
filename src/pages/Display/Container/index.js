// thrid pary
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// project import
import ConfirmModal from '../../../components/Common/ConfirmModal';
import PageTop from '../../../components/Common/PageTop';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CommonFilters from '../CommonFilters';
import ListPageSkeleton from '../ListPageSkeleton';
import Restaurants from '../Restaurants';
import AddContainer from './AddContainer';
import ContainerTable from './ContainerTable';

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

export default function ContainerList({ containerType }) {
  const [currentTab, setCurrentTab] = useState(0);

  let itemsQueryKey = `list-container-${typeToTabIndexMap[currentTab]}`;
  let itemsQueryApi = Api.GET_ALL_LIST_CONTAINERS;
  let itemsSortingApi = Api.SORT_LIST_CONTAINERS;
  let itemEditApi = Api.UPDATE_LIST_CONTAINERS;
  let itemDeleteApi = Api.DELETE_LIST_CONTAINERS;
  let breadcrumbItems = [
    { label: 'Display', to: '/display' },
    { label: 'List Contianer', to: '#' },
  ];

  // switch keys
  if (containerType === 'filter') {
    itemsQueryKey = `filter-container-${typeToTabIndexMap[currentTab]}`;
    itemsQueryApi = Api.GET_ALL_FILTER_CONTAINERS;
    itemsSortingApi = Api.SORT_FILTER_CONTAINERS;
    itemEditApi = Api.UPDATE_FILTER_CONTAINERS;
    itemDeleteApi = Api.DELETE_FILTER_CONTAINERS;
    breadcrumbItems = [
      { label: 'Display', to: '/display' },
      { label: 'Filter Contianer', to: '#' },
    ];
  }

  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(null);
  const [filters, setFilters] = useState(filtersInit);

  // list query
  const listQuery = useQuery(
    [
      itemsQueryKey,
      {
        status: filters.status,
        searchKey: filters.searchKey,
        startDate: filters.date.start,
        endDate: filters.date.end,
        shopType: typeToTabIndexMap[currentTab],
      },
    ],
    () =>
      AXIOS.get(itemsQueryApi, {
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

  const items =
    containerType === 'list' ? listQuery.data?.data?.listContainer || [] : listQuery.data?.data?.filterContainer || [];

  // list sorting
  const listSortingMutation = useMutation((data) => AXIOS.post(itemsSortingApi, data));

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

  // edit
  const listEditMutation = useMutation((data) => AXIOS.post(itemEditApi, data));

  // delete
  const [confirmModal, setConfrimModal] = useState(false);

  const listDeleteMutation = useMutation((data) => AXIOS.post(itemDeleteApi, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries([itemsQueryKey]);
        successMsg(data.message, 'success');
        setConfrimModal(false);
        setCurrentItem({});
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  // three dot handler
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const threeDotHandler = (menu, item) => {
    if (menu === 'edit') {
      setCurrentItem(item);
      setSidebarOpen('add-item');
    }

    if (menu === 'status') {
      item.status = item?.status === 'active' ? 'inactive' : 'active';
      setRender((prev) => !prev);
      listEditMutation.mutate({
        id: item?._id,
        status: item.status,
      });
    }

    if (menu === 'delete') {
      setCurrentItem(item);
      setConfrimModal(true);
    }
  };

  return (
    <Box pb={8.5}>
      <Box>
        <PageTop
          backButtonLabel="Back to Display"
          backTo="/display"
          addButtonLabel="Create"
          onAdd={() => {
            setSidebarOpen('add-item');
          }}
          breadcrumbItems={breadcrumbItems}
        />
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
              searchPlaceHolder={`Search${
                listQuery.data?.data?.listContainer?.length ? ` ${listQuery.data?.data?.listContainer?.length}` : ''
              } items`}
            />
            {listQuery.isLoading ? (
              <ListPageSkeleton pageType={containerType} />
            ) : (
              <Box>
                {/* table */}
                <ContainerTable
                  items={items}
                  loading={listQuery.isLoading}
                  onDrop={dropSort}
                  // handleMenuClick={threeDotHandler}
                  containerType={containerType}
                  minWidth={containerType === 'list' ? '950px' : '900px'}
                  onDelete={(item) => {
                    setCurrentItem(item);
                    setConfrimModal(true);
                  }}
                  onEdit={(item) => {
                    setCurrentItem(item);
                    setSidebarOpen('add-item');
                  }}
                  onViewShops={(item) => {
                    setCurrentItem(item);
                    setSidebarOpen('resturants');
                  }}
                  onStatusChange={(item) => {
                    item.status = item?.status === 'active' ? 'inactive' : 'active';
                    setRender((prev) => !prev);
                    listEditMutation.mutate({
                      id: item?._id,
                      status: item.status,
                    });
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {/* sidebar */}
      <Drawer anchor="right" open={Boolean(sidebarOpen)}>
        {sidebarOpen === 'add-item' ? (
          <AddContainer
            shopType={typeToTabIndexMap[currentTab]}
            editContainer={currentItem}
            containerType={containerType}
            onClose={() => {
              setSidebarOpen(null);
              setCurrentItem({});
            }}
          />
        ) : (
          <Restaurants
            id={currentItem?._id}
            onClose={() => {
              setSidebarOpen(null);
              setCurrentItem({});
            }}
            type={containerType}
          />
        )}
      </Drawer>
      {/* confirmModal */}
      <ConfirmModal
        isOpen={confirmModal}
        onCancel={() => {
          setConfrimModal(false);
          setCurrentItem({});
        }}
        blurClose
        loading={listDeleteMutation.isLoading}
        message="Are you sure you want to delete this item ?"
        onConfirm={() => {
          listDeleteMutation.mutate({
            id: currentItem?._id,
          });
        }}
      />
    </Box>
  );
}
