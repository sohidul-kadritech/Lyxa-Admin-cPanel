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
import AddTag from './AddTag';
import TagsTable from './TagsTable';

const breadcrumbItems = [
  { label: 'Display', to: '/display' },
  { label: 'Tags & Cusines', to: '#' },
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

export default function TagsAndCusines() {
  const queryClient = useQueryClient();

  const [currentTab, setCurrentTab] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [render, setRender] = useState(false);
  const [sidebar, setSidebar] = useState(null);
  const [currentTag, setCurrentTag] = useState({});

  // query
  const [filters, setFilters] = useState(filtersInit);
  const tagsQuery = useQuery(
    [
      `tags-cusines-${typeToTabIndexMap[currentTab]}`,
      {
        searchKey: filters.searchKey,
        shopType: typeToTabIndexMap[currentTab],
        startDate: filters.date.start,
        endDate: filters.date.end,
        status: filters.status,
      },
    ],
    () =>
      AXIOS.get(Api.GET_ALL_TAGS_AND_CUSINES, {
        params: {
          page: 1,
          pageSize: 500,
          searchKey: filters.searchKey,
          sortBy: 'asc',
          shopType: typeToTabIndexMap[currentTab],
          status: filters.status,
          startDate: filters.date.start,
          endDate: filters.date.end,
        },
      })
  );

  const items = tagsQuery.data?.data?.tags || [];

  // edit
  const tagsMutation = useMutation((data) =>
    AXIOS.post(Api.UPDATE_TAGS_AND_CUSINES, {
      ...data,
      id: data?._id,
    })
  );

  // sorting
  const tagsSortingMutation = useMutation((data) => AXIOS.post(Api.SORT_TAGS_AND_CUSINES, data));

  const dropSort = ({ removedIndex, addedIndex }) => {
    if (removedIndex === null || addedIndex === null) return;

    const item = items.splice(removedIndex, 1);
    items.splice(addedIndex, 0, item[0]);

    tagsSortingMutation.mutate({
      tags: items.map((item, index) => ({
        id: item?._id,
        sortingOrder: index + 1,
      })),
    });
  };

  // deltete
  const [confirmModal, setConfrimModal] = useState(false);

  const tagDeleteMutation = useMutation((data) => AXIOS.post(Api.DELETE_TAGS_AND_CUSINES, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries([`tags-cusines-${typeToTabIndexMap[currentTab]}`]);
        successMsg(data.message, 'success');
        setConfrimModal(false);
        setCurrentTag({});
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  return (
    <Box>
      <Box>
        <PageTop
          breadcrumbItems={breadcrumbItems}
          backButtonLabel="Back to Display"
          backTo="/display"
          addButtonLabel="Create"
          onAdd={() => {
            setSidebar('add');
          }}
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
          {/* panels */}
          <Box pt={7}>
            <CommonFilters
              filtersValue={filters}
              setFiltersValue={setFilters}
              searchPlaceHolder={`Search${items.length ? ` ${items.length}` : ''} items`}
            />
            {tagsQuery.isLoading ? (
              <ListPageSkeleton pageType="tags" />
            ) : (
              <Box>
                <TagsTable
                  items={items}
                  shopType={typeToTabIndexMap[currentTab]}
                  onDrop={dropSort}
                  loading={tagsQuery.isLoading}
                  onStatusChange={(value, item) => {
                    item.status = value;
                    setRender((prev) => !prev);
                    tagsMutation.mutate(item);
                  }}
                  onEdit={(item) => {
                    setCurrentTag(item);
                    setSidebar('add');
                  }}
                  onViewShops={(item) => {
                    setCurrentTag(item);
                    setSidebar('restaurants');
                  }}
                  onVisibilityChange={(value, item) => {
                    item.visibility = value;
                    setRender((prev) => !prev);
                    tagsMutation.mutate(item);
                  }}
                  onDelete={(item) => {
                    setCurrentTag(item);
                    setConfrimModal(true);
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Drawer anchor="right" open={sidebar !== null}>
        {sidebar === 'add' && (
          <AddTag
            shopType={typeToTabIndexMap[currentTab]}
            tag={currentTag}
            onClose={() => {
              setSidebar(null);
              setCurrentTag({});
            }}
          />
        )}
        {sidebar === 'restaurants' && (
          <Restaurants
            id={currentTag?._id}
            type="tag"
            onClose={() => {
              setCurrentTag({});
              setSidebar(null);
            }}
          />
        )}
      </Drawer>
      {/* confirmModal */}
      <ConfirmModal
        isOpen={confirmModal}
        onCancel={() => {
          setConfrimModal(false);
          setCurrentTag({});
        }}
        blurClose
        loading={tagDeleteMutation.isLoading}
        message="Are you sure you want to delete this item ?"
        onConfirm={() => {
          tagDeleteMutation.mutate({
            id: currentTag?._id,
          });
        }}
      />
    </Box>
  );
}
