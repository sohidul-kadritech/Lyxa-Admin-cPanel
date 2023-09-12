/* eslint-disable prettier/prettier */
import React, { useMemo, useState } from 'react';

import { Box, Grid, Stack, Tab, Tabs } from '@mui/material';
import jsPDF from 'jspdf';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
import PageTop from '../../../components/Common/PageTop';
import Overview from '../../../components/Shared/FinancialsOverview';
import PayoutList from '../../../components/Shared/Payout';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import DateRange from '../../../components/StyledCharts/DateRange';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { AddMenuButton } from '../../Faq2';
import { dateRangeInit } from '../../Faq2/helpers';
import FinancialsTableForSellerAndShop from '../FinancialsTableForSellerAndShop';

const getBreadCrumbItems = (searchUrl) => {
  const breadcrumbItems = [
    {
      label: 'Financials',
      to: '/financials',
    },
    {
      label: 'Sellers List',
      to: '/app-wallet/seller-transactions',
    },
    {
      label: 'Shops List',
      to: `/app-wallet/seller/shops-transactions?sellerId=${searchUrl.get('sellerId')}&companyName=${searchUrl.get(
        // eslint-disable-next-line prettier/prettier
        'companyName',
      )}`,
    },
  ];

  return breadcrumbItems;
};

// used as whole page or just table

function ShopsFinancialsSpecificSellers({ viewUserType = 'admin', customSellerId }) {
  const [range, setRange] = useState({ ...dateRangeInit });
  const [searchKey, setSearchKey] = useState('');
  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const sellerId = viewUserType === 'admin' ? searchParams.get('sellerId') : customSellerId;

  const getSellerShopsTnx = useQuery(
    [API_URL.SELLER_TRX, { searchKey, startDate: range.start, endDate: range.end, sellerId }],
    () =>
      AXIOS.get(API_URL.SELLER_TRX, {
        params: { sellerId, searchKey, startDate: range.start, endDate: range.end },
      }),
  );

  const [currentTab, setCurrentTab] = useState(0);

  // console.log('sellerId', sellerId);
  // console.log('query data', getSellerShopsTnx?.data);

  // GENERATE PDF
  const downloadPdf = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape
    // eslint-disable-next-line new-cap
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const title = 'Seller Transactions';
    const headers = [
      ['Seller', 'Total Orders', 'Order amount', 'Delivery fee', 'Lyxa earning', 'Unsettled amount', 'Seller earning'],
    ];

    const marginLeft = 40;

    const data = getSellerShopsTnx?.data?.data?.shops.map((trx) => [
      trx?.company_name,
      trx?.summary.totalOrder,
      trx?.summary.orderValue?.productAmount.toFixed(2),
      trx?.summary.orderValue?.deliveryFee,
      trx?.summary.totalDropGet.toFixed(2),
      trx?.summary.totalShopUnsettle.toFixed(2),
      trx?.summary.totalShopEarning,
    ]);

    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${searchParams.get('companyName')} sellerTransactions.pdf`);
  };

  return (
    <Box>
      {viewUserType === 'admin' && (
        <PageTop
          isBreadCrumbsTitleShow
          breadCrumbsTitle={searchParams.get('companyName')}
          backButtonLabel="Back to Financials"
          breadcrumbItems={getBreadCrumbItems(searchParams)}
          backTo="/financials"
        />
      )}

      <Box marginBottom={7.5}>
        <Tabs value={currentTab}>
          <Tab onClick={() => setCurrentTab(0)} label="Profit Breakdown" />
          <Tab onClick={() => setCurrentTab(1)} label="Payouts" />
        </Tabs>
      </Box>

      {currentTab === 0 && (
        <Box>
          <Grid sm={12}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <DateRange range={range} setRange={setRange} />
            </Stack>
            {/* from shop console */}

            <Overview
              viewUserType="admin"
              adminParams={{ id: sellerId, type: 'seller' }}
              adminPaymentDetailsRange={{ start: range?.start, end: range?.end }}
            />
          </Grid>

          <Box>
            <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
              <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
              <AddMenuButton
                title="Download"
                icon={<DownloadIcon />}
                onClick={() => {
                  downloadPdf();
                }}
              />
            </Stack>
          </Box>

          <Box marginBottom="30px">
            <FinancialsTableForSellerAndShop
              paramsProps={{ sellerId, startDate: range?.start, endDate: range?.end }}
              showFor="seller"
            />
          </Box>
        </Box>
      )}

      {currentTab === 1 && <PayoutList payaoutParams={{ sellerId: searchParams.get('sellerId') || customSellerId }} />}
    </Box>
  );
}

export default ShopsFinancialsSpecificSellers;
