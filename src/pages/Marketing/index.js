/* eslint-disable no-unused-vars */
// third party
import { Box, Button, Card, CardContent, Stack, Tab, Tabs, Unstable_Grid2 as Grid } from '@mui/material';
import { useState } from 'react';

// icons
import AltRouteIcon from '@mui/icons-material/AltRoute';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import PercentIcon from '@mui/icons-material/Percent';

// project import
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import MarketingTypeCard from './marketingTypeCard';
import TabPanel from './tabPanel';

const cardIconSx = {
  height: '100px',
  width: 'auto',
};

export default function Marketing() {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [rightBarTab, setRightBarTab] = useState(0);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Breadcrumb maintitle="Lyxa" breadcrumbItem="Marketing" loading={false} callList={() => {}} />
        <Grid container spacing={3}>
          <Grid container xs={isRightBarOpen ? 6 : 12} spacing={3}>
            <Grid md={isRightBarOpen ? 6 : 3}>
              <MarketingTypeCard
                title="Double deals"
                Icon={AnalyticsIcon}
                onVeiwDetails={() => {
                  setIsRightBarOpen(true);
                }}
              />
            </Grid>
            <Grid md={isRightBarOpen ? 6 : 3}>
              <MarketingTypeCard
                title="Percentage deals"
                Icon={PercentIcon}
                onVeiwDetails={() => {
                  setIsRightBarOpen(true);
                }}
              />
            </Grid>
            <Grid md={isRightBarOpen ? 6 : 3}>
              <MarketingTypeCard
                title="Free delivery"
                Icon={DeliveryDiningIcon}
                onVeiwDetails={() => {
                  setIsRightBarOpen(true);
                }}
              />
            </Grid>
            <Grid md={isRightBarOpen ? 6 : 3}>
              <MarketingTypeCard
                title="Others"
                Icon={AltRouteIcon}
                onVeiwDetails={() => {
                  setIsRightBarOpen(true);
                }}
              />
            </Grid>
          </Grid>
          <Grid className={`${isRightBarOpen ? '' : 'd-none'}`} container xs={isRightBarOpen ? 6 : 12} spacing={3}>
            <Grid xs={12}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Tabs
                      value={rightBarTab}
                      onChange={(event, value) => {
                        setRightBarTab(value);
                      }}
                    >
                      <Tab label="Double Deals" />
                      <Tab label="Percentage Deals" />
                      <Tab label="Free Delivery" />
                      <Tab label="Add New" />
                    </Tabs>
                    <Button
                      sx={{
                        dispaly: 'inline-flex',
                        justifyContent: 'space-between',
                        color: 'rgba(0, 0, 0, 0.87)',
                        border: '1px solid rgba(0, 0, 0, 0.87)',
                        '&:hover': {
                          backgroundColor: 'white',
                          border: '1px solid rgba(0, 0, 0, 0.87)',
                        },
                      }}
                      onClick={() => {
                        setIsRightBarOpen(false);
                      }}
                    >
                      Close
                    </Button>
                  </Stack>
                  <TabPanel index={0} value={rightBarTab}>
                    <Box>This is the rightbar</Box>
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </GlobalWrapper>
  );
}
