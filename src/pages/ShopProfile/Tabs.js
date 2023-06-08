import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../components/Common/TabPanel';
import OrderDetail from '../../components/Shared/OrderDetail';
import Banking from '../ShopFinancials/Banking';
import FlagTable from './FlagTable';
import Invoices from './Invoices';
import ShopOrders from './Orders';
import ShopReviews from './Review';
import ShopTransactions from './Transactions';

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
            <Tab label="Orders" />
            <Tab label="Financials" />
            <Tab label="Invoices" />
            <Tab label="Banking" />
          </Tabs>
          <Box pt={6}>
            <TabPanel index={0} value={currentTab} noPadding>
              <FlagTable filteredData={shop?.flags || []} currentTab={currentTab} />
            </TabPanel>
            <TabPanel index={1} noPadding value={currentTab}>
              <ShopReviews reviews={shop?.reviews || []} onViewDetail={onViewDetail} />
            </TabPanel>
            <TabPanel index={2} noPadding value={currentTab}>
              <ShopOrders onViewDetail={onViewDetail} shop={shop} />
            </TabPanel>
            <TabPanel index={3} noPadding value={currentTab}>
              <ShopTransactions shop={shop} />
            </TabPanel>
            <TabPanel index={4} noPadding value={currentTab}>
              <Invoices />
            </TabPanel>
            <TabPanel index={5} noPadding value={currentTab}>
              <Banking shop={shop} />
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
