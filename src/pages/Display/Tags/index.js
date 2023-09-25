// thrid pary
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// project import
import ConfirmModal from '../../../components/Common/ConfirmModal';
import PageTop from '../../../components/Common/PageTop';
import { successMsg } from '../../../helpers/successMsg';
import useQueryParams from '../../../helpers/useQueryParams';
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

const queryParamsInit = {
  searchKey: '',
  status: '',
  page: 1,
  pageSize: 20,
  sortBy: 'asc',
  shopType: 'food',
  tab: 0,
};

export default function TagsAndCusines() {
  const queryClient = useQueryClient();

  // const [currentTab, setCurrentTab] = useState(0);
  const [, setRender] = useState(false);
  const [sidebar, setSidebar] = useState(null);
  const [currentTag, setCurrentTag] = useState({});

  // query
  const [queryParams, setQueryParams] = useQueryParams({ ...queryParamsInit });

  const tagsQuery = useQuery([Api.GET_ALL_TAGS_AND_CUSINES, queryParams], () =>
    AXIOS.get(Api.GET_ALL_TAGS_AND_CUSINES, {
      params: queryParams,
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

  // delete
  const [confirmModal, setConfrimModal] = useState(false);

  const tagDeleteMutation = useMutation((data) => AXIOS.post(Api.DELETE_TAGS_AND_CUSINES, data), {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries([Api.GET_ALL_TAGS_AND_CUSINES]);
        successMsg(data.message, 'success');
        setConfrimModal(false);
        setCurrentTag({});
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  return (
    <Box pb={6 + 6}>
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
            value={Number(queryParams?.tab)}
            onChange={(event, newValue) => {
              // setCurrentTab(newValue);
              setQueryParams((prev) => ({ ...prev, shopType: typeToTabIndexMap[newValue], page: 1, tab: newValue }));
            }}
          >
            <Tab label="Food" />
            <Tab label="Grocery" />
            <Tab label="Pharmacy" />
          </Tabs>
          {/* panels */}
          <Box pt={7}>
            <CommonFilters
              filtersValue={queryParams}
              setFiltersValue={setQueryParams}
              searchPlaceHolder={`Search${items.length ? ` ${items.length}` : ''} items`}
            />
            {tagsQuery.isLoading ? (
              <ListPageSkeleton pageType="tags" />
            ) : (
              <Box>
                <TagsTable
                  items={items}
                  shopType={typeToTabIndexMap[Number(queryParams?.tab)]}
                  onDrop={dropSort}
                  loading={tagsQuery.isLoading}
                  page={Number(queryParams.page)}
                  setPage={(page) => {
                    setQueryParams({ ...queryParams, page });
                  }}
                  totalPage={tagsQuery?.data?.data?.paginate?.metadata?.page?.totalPage}
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
            shopType={typeToTabIndexMap[Number(queryParams?.tab)]}
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
