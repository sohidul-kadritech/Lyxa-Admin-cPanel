// thrid pary
import { West } from '@mui/icons-material';
import { Box, Button, Stack, Tab, Tabs, Tooltip } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';

// project import
// import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import BreadCrumbs from '../../../components/Common/BreadCrumb2';
import PageButton from '../../../components/Common/PageButton';
import TabPanel from '../../../components/Common/TabPanel';
import FilterDate from '../../../components/Filter/FilterDate';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import Wrapper from '../../../components/Wrapper';
import ListTable from './ListTable';
import { listData } from './mock';

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

export default function ListContainers() {
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
            aria-label="basic tabs example"
          >
            <Tab label="Food" />
            <Tab label="Grocery" />
            <Tab label="Pharmacy" />
          </Tabs>
          {/* panels */}
          <Box>
            <TabPanel index={0} value={currentTab}>
              <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
                <StyledSearchBar fullWidth placeholder="Search 24 items" />
                {/* start date */}
                <Tooltip title="Start Date">
                  <Box>
                    <FilterDate
                      value={startDate}
                      size="md"
                      onChange={(e) => {
                        setStartDate(e._d);
                      }}
                    />
                  </Box>
                </Tooltip>
                {/* end date */}
                <Tooltip title="Status">
                  <Box>
                    <FilterSelect
                      items={listFilterOptions}
                      value={status}
                      placeholder="Status"
                      size="md"
                      sx={{
                        minWidth: 'auto',
                      }}
                      onChange={(e) => {
                        setStatus(e.target.value);
                      }}
                    />
                  </Box>
                </Tooltip>
              </Stack>
              <ListTable items={listData} />
              {/* <Box height={50}> */}
              {/* </Box> */}
            </TabPanel>
            <TabPanel index={1} value={currentTab}></TabPanel>
            <TabPanel index={2} value={currentTab}></TabPanel>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
}
