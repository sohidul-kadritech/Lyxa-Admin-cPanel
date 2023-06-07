import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
// import Review from '../../components/Shared/OrderDetail/Review';
import OrderDetail from '../../components/Shared/OrderDetail';
import FlagTable from './FlagTable';
import ShopReviews from './Review';

export default function ShopProfileTabs({ shop }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  const onViewDetail = (order) => {
    setCurrentOrder(order);
    setOpen(true);
  };

  return (
    <>
      <Box sx={{ marginTop: '53px' }}>
        <Box sx={{ paddingBottom: '40px' }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
          >
            <Tab label="Flagged" />
            <Tab label="Reviews" />
          </Tabs>
          <Box pt={6}>
            <TabPanel index={0} value={currentTab} noPadding>
              <FlagTable filteredData={shop?.flags || []} currentTab={currentTab} />
            </TabPanel>
            <TabPanel index={1} noPadding value={currentTab}>
              <ShopReviews reviews={shop?.reviews || []} onViewDetail={onViewDetail} />
            </TabPanel>
          </Box>
        </Box>
      </Box>
      <Drawer open={open} anchor="right">
        <OrderDetail
          order={currentOrder}
          hideIssues
          onClose={() => {
            setOpen(false);
            setCurrentOrder({});
          }}
        />
      </Drawer>
    </>
  );
}
