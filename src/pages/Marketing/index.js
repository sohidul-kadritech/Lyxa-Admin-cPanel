/* eslint-disable no-unused-vars */
// third party
import { Box, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { useState } from 'react';

// icons
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import StarIcon from '@mui/icons-material/Star';

// project import
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import GlobalWrapper from '../../components/GlobalWrapper';
import MarketingCard from './MarketingCard';

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

// dynamic sidebar ttitle
export default function Marketing() {
  const theme = useTheme();

  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <GlobalWrapper padding>
      <div className="page-content">
        <Grid container spacing={0} sx={{ height: 'calc(100vh - 130px)', overflowY: 'hidden' }}>
          {/* left */}
          <Grid md={isRightBarOpen ? 8 : 12} pr={isRightBarOpen ? 10 : 0}>
            <Box>
              <Grid container spacing={6}>
                <Grid xs={12}>
                  <BreadCrumbs
                    items={breadcrumbItems}
                    sx={{
                      pb: 5,
                    }}
                  />
                </Grid>
                <Grid md={isRightBarOpen ? 6 : 4}>
                  <MarketingCard
                    title="Deals"
                    Icon={LocalOfferIcon}
                    onVeiwDetails={() => {
                      setIsRightBarOpen('deals');
                      setCurrentTab(0);
                    }}
                    addNew
                    onAddnew={() => {}}
                  />
                </Grid>
                <Grid md={isRightBarOpen ? 6 : 4}>
                  <MarketingCard
                    title="Featured"
                    Icon={StarIcon}
                    onVeiwDetails={() => {
                      setIsRightBarOpen('featured');
                      setCurrentTab(1);
                    }}
                    addNew
                    onAddnew={() => {}}
                  />
                </Grid>
                <Grid md={isRightBarOpen ? 6 : 4}>
                  <MarketingCard
                    title="Loyalty"
                    Icon={MilitaryTechIcon}
                    onVeiwDetails={() => {
                      setIsRightBarOpen('loyalty');
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
          <Grid
            md={4}
            spacing={3}
            className={`${isRightBarOpen ? '' : 'd-none'}`}
            pl={10}
            sx={{
              borderLeft: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <Grid md={12}></Grid>
          </Grid>
        </Grid>
      </div>
    </GlobalWrapper>
  );
}
