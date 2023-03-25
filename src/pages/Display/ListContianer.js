// thrid pary
import { West } from '@mui/icons-material';
import { Box, Button, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

// project import
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import PageButton from '../../components/Common/PageButton';
import TabPanel from '../../components/Common/TabPanel';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import Wrapper from '../../components/Wrapper';

const breadcrumbItems = [
  { label: 'Display', to: '/display' },
  { label: 'List Contianer', to: '#' },
];

export default function ListContainers() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Wrapper
      sx={{
        paddingTop: 0,
      }}
    >
      <Box className="page-content2" sx={{ height: '100vh', overflowY: 'scroll' }}>
        <Box pb={7.5} pt={9}>
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
              <Box>
                <StyledSearchBar fullWidth />
              </Box>
            </TabPanel>
            <TabPanel index={1} value={currentTab}></TabPanel>
            <TabPanel index={2} value={currentTab}></TabPanel>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
}
