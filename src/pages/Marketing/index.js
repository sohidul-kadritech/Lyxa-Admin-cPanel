/* eslint-disable no-unused-vars */
// third party
import { Box, Button, Paper, Stack, Tab, Tabs, Unstable_Grid2 as Grid } from '@mui/material';
import { useState } from 'react';

// icons
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import StarIcon from '@mui/icons-material/Star';

// project import
import BreadCrumbs from '../../components/Common/BreadCrumb2';
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

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/marketing',
    label: 'Marketing',
  },
];

export default function Marketing() {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <GlobalWrapper padding>
      <div className="page-content">
        <Grid container spacing={0}>
          {/* left */}
          <Grid md={isRightBarOpen ? 6 : 12}>
            <Box>
              <Grid container spacing={6}>
                <Grid xs={12}>
                  <BreadCrumbs
                    items={breadcrumbItems}
                    sx={{
                      pb: 10,
                    }}
                  />
                </Grid>
                <Grid md={isRightBarOpen ? 6 : 4}>
                  <MarketingTypeCard
                    title="Deals"
                    Icon={LocalOfferIcon}
                    onVeiwDetails={() => {
                      setIsRightBarOpen(true);
                      setCurrentTab(0);
                    }}
                    addNew
                    onAddnew={() => {}}
                  />
                </Grid>
                <Grid md={isRightBarOpen ? 6 : 4}>
                  <MarketingTypeCard
                    title="Featured"
                    Icon={StarIcon}
                    onVeiwDetails={() => {
                      setIsRightBarOpen(true);
                      setCurrentTab(1);
                    }}
                    addNew
                    onAddnew={() => {}}
                  />
                </Grid>
                <Grid md={isRightBarOpen ? 6 : 4}>
                  <MarketingTypeCard
                    title="Loyalty"
                    Icon={MilitaryTechIcon}
                    onVeiwDetails={() => {
                      setIsRightBarOpen(true);
                      setCurrentTab(2);
                    }}
                    addNew
                    onAddnew={() => {}}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* right */}
          <Grid className={`${isRightBarOpen ? '' : 'd-none'}`} xs={isRightBarOpen ? 6 : 12} spacing={3}>
            <Grid md={12}>
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
