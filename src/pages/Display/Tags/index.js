// thrid pary
import { West } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';

// project import
import BreadCrumbs from '../../../components/Common/BreadCrumb2';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import PageButton from '../../../components/Common/PageButton';
import FilterDate from '../../../components/Filter/FilterDate';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import Wrapper from '../../../components/Wrapper';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { deals } from '../mock';
import AddTag from './AddTag';
import TagsTable from './TagsTable';

const breadcrumbItems = [
  { label: 'Display', to: '/display' },
  { label: 'List Contianer', to: '#' },
];

const listFilterOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

const typeToTabIndexMap = {
  0: 'food',
  1: 'grocery',
  2: 'pharmacy',
};

export default function TagsAndCusines() {
  const [currentTab, setCurrentTab] = useState(0);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  // eslint-disable-next-line no-unused-vars
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
  const [searchKey, setSearchKey] = useState('');

  // query
  const tagsQuery = useQuery([`tags-cusines`, { searchKey, currentTab, startDate, endDate }], () =>
    AXIOS.get(Api.GET_ALL_TAGS_AND_CUSINES, {
      params: {
        page: 1,
        pageSize: 500,
        searchKey,
        sortBy: 'asc',
        shopType: typeToTabIndexMap[currentTab],
        status,
        startDate,
        endDate,
      },
    })
  );

  // console.log(tagsQuery.data);

  // current tag
  const [sidebarOpen, setSidebarOpen] = useState();
  const [currentTag, setCurrentTag] = useState({});

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
          {/* panels */}
          <Box pt={7}>
            <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
              <StyledSearchBar
                fullWidth
                placeholder="Search 24 items"
                value={searchKey}
                onChange={(e) => {
                  setSearchKey(e.target.value);
                }}
              />
              {/* start date */}
              <FilterDate
                tooltip="Start Date"
                value={startDate}
                size="sm"
                onChange={(e) => {
                  setStartDate(e._d);
                }}
              />
              {/* end date */}
              <FilterDate
                tooltip="End Date"
                value={endDate}
                size="sm"
                onChange={(e) => {
                  setEndDate(e._d);
                }}
              />
              {/* end date */}
              <FilterSelect
                items={listFilterOptions}
                value={status}
                placeholder="Status"
                tooltip="Status"
                size="sm"
                sx={{
                  minWidth: 'auto',
                }}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              />
            </Stack>
            <Box position="relative">
              {tagsQuery.isLoading && <LoadingOverlay />}
              <TagsTable
                items={tagsQuery.data?.data?.tags || []}
                onEdit={(item) => {
                  setCurrentTag(item);
                  setSidebarOpen(true);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Drawer anchor="right" open={sidebarOpen}>
        <AddTag
          shopType={typeToTabIndexMap[currentTab]}
          tag={currentTag}
          deals={deals}
          onClose={() => {
            setSidebarOpen(false);
            setCurrentTag({});
          }}
        />
      </Drawer>
    </Wrapper>
  );
}
