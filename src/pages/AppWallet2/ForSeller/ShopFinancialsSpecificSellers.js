import React, { useMemo, useState } from 'react';

import { Box, Stack } from '@mui/material';
import jsPDF from 'jspdf';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
import PageTop from '../../../components/Common/PageTop';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import DateRange from '../../../components/StyledCharts/DateRange';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { AddMenuButton } from '../../Faq2';
import { dateRangeInit } from '../../Faq2/helpers';
import TablePageSkeleton from '../../Notification2/TablePageSkeleton';
import ShopFinancialsTable from './ShopFinancialsTable';

const getBreadCrumbItems = (searchUrl) => {
  const breadcrumbItems = [
    {
      label: 'Financials',
      to: '/financials',
    },
    {
      label: 'Sellers List',
      to: '/add-wallet/seller-transactions2',
    },
    {
      label: 'Shop List',
      to: `/app-wallet/seller/shops-transactions2?sellerId=${searchUrl.get('sellerId')}&companyName=${searchUrl.get(
        // eslint-disable-next-line prettier/prettier
        'companyName',
      )}`,
    },
  ];

  return breadcrumbItems;
};

function ShopFinancialsSpecificSellers() {
  const [range, setRange] = useState({ ...dateRangeInit });

  const [searchKey, setSearchKey] = useState('');
  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const getSellerShopsTnx = useQuery(
    [
      API_URL.SELLER_TRX,
      { searchKey, startDate: range.start, endDate: range.end, sellerId: searchParams.get('sellerId') },
    ],
    () =>
      AXIOS.get(API_URL.SELLER_TRX, {
        params: { sellerId: searchParams.get('sellerId'), searchKey, startDate: range.start, endDate: range.end },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  console.log('sellers Shop: ', getSellerShopsTnx?.data?.data);
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

    console.log('downloadPdf before ==>', getSellerShopsTnx?.data?.data?.sellers);
    console.log('downloadPdf after ==>', data);
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
      <PageTop
        isBreadCrumbsTitleShow
        breadCrumbsTitle={searchParams.get('companyName')}
        backButtonLabel="Back to Financials"
        breadcrumbItems={getBreadCrumbItems(searchParams)}
        backTo="/financials"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Box>
        <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
          <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
          <DateRange range={range} setRange={setRange} />
          <AddMenuButton
            title="Download"
            icon={<DownloadIcon />}
            onClick={() => {
              downloadPdf();
            }}
          />
        </Stack>
      </Box>
      <Box sx={{ marginBottom: '30px' }}>
        {getSellerShopsTnx.isLoading ? (
          <TablePageSkeleton row={3} column={7} />
        ) : (
          <ShopFinancialsTable loading={getSellerShopsTnx?.isLoading} data={getSellerShopsTnx?.data?.data?.shops} />
        )}
      </Box>
    </Box>
  );
}

export default ShopFinancialsSpecificSellers;
