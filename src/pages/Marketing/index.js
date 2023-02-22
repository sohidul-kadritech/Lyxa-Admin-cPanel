/* eslint-disable no-unused-vars */
// third party
import { Box, Button, Paper, Stack, Tab, Tabs, Unstable_Grid2 as Grid } from '@mui/material';
import { useState } from 'react';

// icons
import AltRouteIcon from '@mui/icons-material/AltRoute';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import PercentIcon from '@mui/icons-material/Percent';

// project import
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import TabPanel from '../../components/TabPanel';
import MarketingTypeCard from './marketingTypeCard';

const cardIconSx = {
  height: '100px',
  width: 'auto',
};

const tabPanelSx = {
  padding: '24px 16px',
};

export default function Marketing() {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Breadcrumb
          maintitle="Lyxa"
          breadcrumbItem="Marketing"
          isAddNew
          loading={false}
          addNewHandler={() => {
            setCurrentTab(4);
            isRightBarOpen(true);
          }}
          callList={() => {}}
        />
        <Grid container spacing={3}>
          <Grid container xs={isRightBarOpen ? 6 : 12} spacing={3}>
            <Grid md={isRightBarOpen ? 6 : 3}>
              <MarketingTypeCard
                title="Double deals"
                Icon={AnalyticsIcon}
                onVeiwDetails={() => {
                  setIsRightBarOpen(true);
                  setCurrentTab(0);
                }}
              />
            </Grid>
            <Grid md={isRightBarOpen ? 6 : 3}>
              <MarketingTypeCard
                title="Percentage deals"
                Icon={PercentIcon}
                onVeiwDetails={() => {
                  setIsRightBarOpen(true);
                  setCurrentTab(1);
                }}
              />
            </Grid>
            <Grid md={isRightBarOpen ? 6 : 3}>
              <MarketingTypeCard
                title="Free delivery"
                Icon={DeliveryDiningIcon}
                onVeiwDetails={() => {
                  setIsRightBarOpen(true);
                  setCurrentTab(2);
                }}
              />
            </Grid>
            <Grid md={isRightBarOpen ? 6 : 3}>
              <MarketingTypeCard
                title="Others"
                Icon={AltRouteIcon}
                onVeiwDetails={() => {
                  setIsRightBarOpen(true);
                  setCurrentTab(3);
                }}
              />
            </Grid>
          </Grid>
          <Grid className={`${isRightBarOpen ? '' : 'd-none'}`} container xs={isRightBarOpen ? 6 : 12} spacing={3}>
            <Grid xs={12}>
              <Paper>
                <Stack direction="row" justifyContent="space-between" alignItems="center" pr={2}>
                  <Tabs
                    value={currentTab}
                    onChange={(event, value) => {
                      setCurrentTab(value);
                    }}
                  >
                    <Tab label="Double Deals" />
                    <Tab label="Percentage Deals" />
                    <Tab label="Free Delivery" />
                    <Tab label="Others" />
                    <Tab label="Add New" />
                  </Tabs>
                  <Button
                    disableElevation
                    variant="contained"
                    onClick={() => {
                      setIsRightBarOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </Stack>
                <TabPanel index={0} value={currentTab} containerSx={tabPanelSx}>
                  <Box>Double Deals</Box>
                </TabPanel>
                <TabPanel index={1} value={currentTab} containerSx={tabPanelSx}>
                  <Box>Percentage Deals</Box>
                </TabPanel>
                <TabPanel index={2} value={currentTab} containerSx={tabPanelSx}>
                  <Box>Free Deals</Box>
                </TabPanel>
                <TabPanel index={3} value={currentTab} containerSx={tabPanelSx}>
                  <Box>Others</Box>
                </TabPanel>
                <TabPanel index={4} value={currentTab} containerSx={tabPanelSx}>
                  <Box>Add New</Box>
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </GlobalWrapper>
  );
}
