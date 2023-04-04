// thrid pary
import { West } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

// project import
import BreadCrumbs from '../../../components/Common/BreadCrumb2';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import PageButton from '../../../components/Common/PageButton';
import Wrapper from '../../../components/Wrapper';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CommonFilters from '../CommonFilters';
import { deals } from '../mock';
import AddTag from './AddTag';
import Restaurants from './Restaurants';
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
        currentTab,
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

  // edit
  const tagsMutation = useMutation((data) =>
    AXIOS.post(Api.UPDATE_TAGS_AND_CUSINES, {
      ...data,
      id: data?._id,
    })
  );

  const items = tagsQuery.data?.data?.tags || [];

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
                setSidebar('add');
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
          {/* panels */}
          <Box pt={7}>
            <CommonFilters
              filtersValue={filters}
              setFiltersValue={setFilters}
              searchPlaceHolder={`Search ${items.length || 0} items`}
            />
            <Box position="relative">
              {tagsQuery.isLoading && <LoadingOverlay />}
              <TagsTable
                items={items}
                onDrop={dropSort}
                onStatusChange={(value, item) => {
                  item.status = value;
                  setRender((prev) => !prev);
                  tagsMutation.mutate(item);
                }}
                onEdit={(item) => {
                  setCurrentTag(item);
                  setSidebar('add');
                }}
                onViewShops={() => {
                  setSidebar('restaurants');
                }}
                onVisibilityChange={(value, item) => {
                  item.visibility = value;
                  setRender((prev) => !prev);
                  tagsMutation.mutate(item);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Drawer anchor="right" open={sidebar !== null}>
        {sidebar === 'add' && (
          <AddTag
            shopType={typeToTabIndexMap[currentTab]}
            tag={currentTag}
            deals={deals}
            onClose={() => {
              setSidebar(null);
              setCurrentTag({});
            }}
          />
        )}
        {sidebar === 'restaurants' && (
          <Restaurants
            onClose={() => {
              setSidebar(null);
              setCurrentTag({});
            }}
          />
        )}
      </Drawer>
    </Wrapper>
  );
}
