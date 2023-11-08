/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TabPanel from '../../components/Common/TabPanel';
import OrderDetail from '../../components/Shared/OrderDetail';
import PayoutList from '../../components/Shared/Payout';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import Banking from '../ShopFinancials/Banking';
import ShopFlags from './Flag';
import ShopOrders from './Orders';
import ShopReviews from './Review';
import ShopTransactions from './Transactions';

export default function ShopProfileTabs({ shop, refetchShopData, loading }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  const onViewDetail = (order) => {
    setCurrentOrder(order);
    setOpen(true);
  };

  const shopQuery = useQuery([API_URL.SINGLE_SHOP, { id: shop?._id, currentTab }], () =>
    AXIOS.get(API_URL.SINGLE_SHOP, {
      params: {
        id: shop?._id,
      },
    }),
  );

  return (
    <>
      <Box sx={{ marginTop: '53px' }}>
        <Box sx={{ paddingBottom: '40px' }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
              // if (newValue === 1 || newValue === 2) refetchShopData();
            }}
          >
            <Tab label="Orders" />
            <Tab label="Reviews" />
            <Tab label="Flagged" />
            <Tab label="Financials" />
            <Tab label="Payouts" />
            {shop?.shopReceivePaymentBy === 'bank' && <Tab label="Banking" />}
          </Tabs>
          <Box pt={6}>
            <TabPanel index={0} noPadding value={currentTab}>
              <ShopOrders onViewDetail={onViewDetail} shop={shop} />
            </TabPanel>
            <TabPanel index={1} noPadding value={currentTab}>
              <ShopReviews
                loading={shopQuery?.isLoading}
                reviews={shopQuery?.data?.data?.shop?.reviews || []}
                onViewDetail={onViewDetail}
              />
            </TabPanel>
            <TabPanel index={2} value={currentTab} noPadding>
              <ShopFlags
                flags={shopQuery?.data?.data?.shop?.flags}
                onViewDetail={onViewDetail}
                loading={shopQuery?.isLoading}
              />
            </TabPanel>
            <TabPanel index={3} noPadding value={currentTab}>
              <ShopTransactions
                shop={shopQuery?.data?.data?.shop}
                loading={shopQuery?.isLoading}
                show={{
                  payout: false,
                  order: true,
                  transaction: true,
                }}
              />
            </TabPanel>
            <TabPanel index={4} noPadding value={currentTab}>
              <PayoutList marginTop="0px" showFor="specific" payaoutParams={{ shopId: shop?._id }} />
            </TabPanel>
            {shop?.shopReceivePaymentBy === 'bank' && (
              <TabPanel index={5} noPadding value={currentTab}>
                <Banking shop={shopQuery?.data?.data?.shop} />
              </TabPanel>
            )}
          </Box>
        </Box>
      </Box>
      <Drawer open={open} anchor="right">
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setOpen(false);
            setCurrentOrder({});
          }}
        />
      </Drawer>
    </>
  );
}
