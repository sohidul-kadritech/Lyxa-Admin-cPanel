// thrid pary
import { West } from '@mui/icons-material';
import { Box, Button, Drawer, Stack, Tab, Tabs } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
// project import
import BreadCrumbs from '../../../components/Common/BreadCrumb2';
import PageButton from '../../../components/Common/PageButton';
import FilterDate from '../../../components/Filter/FilterDate';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import Wrapper from '../../../components/Wrapper';
import { listData } from '../mock';
import AddContainer from './AddContainer';
import ListTable from './ListTable';

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

export default function ListContainers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));

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
              <StyledSearchBar fullWidth placeholder="Search 24 items" />
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
            <ListTable items={listData} />
          </Box>
        </Box>
      </Box>
      <Drawer anchor="right" open={sidebarOpen}>
        <AddContainer
          shopType={typeToTabIndexMap[currentTab]}
          onClose={() => {
            setSidebarOpen(false);
          }}
        />
      </Drawer>
    </Wrapper>
  );
}
