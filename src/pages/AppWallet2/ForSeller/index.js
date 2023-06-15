import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
import PageTop from '../../../components/Common/PageTop';
import TabPanel from '../../../components/Common/TabPanel';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import DateRange from '../../../components/StyledCharts/DateRange';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { AddMenuButton } from '../../Faq2';
import { dateRangeInit } from '../../Faq2/helpers';
import TablePageSkeleton from '../../Notification2/TablePageSkeleton';
import SellerFinancialsTable from './SellerFinancialsTable';

const breadcrumbItems = [
  {
    label: 'Financials',
    to: '/financials',
  },
  {
    label: 'For Sellers',
    to: '#',
  },
];
function FinancialsForSeller() {
  const [currentTab, setCurrentTab] = useState(0);
  const [range, setRange] = useState({ ...dateRangeInit });

  const [searchKey, setSearchKey] = useState('');

  //   const [open, setOpen] = useState(false);
  const getSellerTnx = useQuery([API_URL.SELLERS_TRX, { searchKey, startDate: range.start, endDate: range.end }], () =>
    AXIOS.get(API_URL.SELLERS_TRX, {
      params: { searchKey, startDate: range.start, endDate: range.end },
      // eslint-disable-next-line prettier/prettier
    }),
  );

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

    const data = getSellerTnx?.data?.data?.sellers.map((trx) => [
      trx?.company_name,
      trx?.summary.totalOrder,
      trx?.summary.orderValue?.productAmount.toFixed(2),
      trx?.summary.orderValue?.deliveryFee,
      trx?.summary.totalDropGet.toFixed(2),
      trx?.summary.totalSellerUnsettle.toFixed(2),
      trx?.summary.totalSellerEarning,
    ]);

    console.log('downloadPdf before ==>', getSellerTnx?.data?.data?.sellers);
    console.log('downloadPdf after ==>', data);
    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save('sellerTransactions.pdf');
  };

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Financials"
        breadcrumbItems={breadcrumbItems}
        backTo="/financials"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
        >
          <Tab label="Seller LIst"></Tab>
          <Tab label="Invoices"></Tab>
        </Tabs>
      </Box>
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
        <TabPanel index={0} value={currentTab} noPadding>
          {getSellerTnx?.isLoading ? (
            <TablePageSkeleton row={8} column={7} />
          ) : (
            <SellerFinancialsTable loading={getSellerTnx?.isLoading} data={getSellerTnx?.data?.data?.sellers} />
          )}
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <Typography>Invoices</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default FinancialsForSeller;
