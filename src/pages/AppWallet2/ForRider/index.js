import { Box, Stack, Tab, Tabs } from '@mui/material';
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
import TablePageSkeleton from '../../Notification2/TablePageSkeleton';
import { dateRangeInitFinancial } from '../ForSeller/helpers';
import RiderInvoice from './Invoices';
import RiderFinancialsTable from './Table';

const breadcrumbItems = [
  {
    label: 'Financials',
    to: '/financials',
  },
  {
    label: 'For Riders',
    to: '#',
  },
];
function RidersTransaction() {
  const [currentTab, setCurrentTab] = useState(0);
  const [range, setRange] = useState({ ...dateRangeInitFinancial });

  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');

  const getDeliveryTnx = useQuery(
    [API_URL.DELIVERY_TRX, { searchKey, startDate: range.start, endDate: range.end }],
    () =>
      AXIOS.get(API_URL.DELIVERY_TRX, {
        params: { pageSize: 50, searchKey, startDate: range.start, endDate: range.end },
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

    const title = `Delivery Boys Transactions`;
    const headers = [
      [
        'Name',
        'Total Orders',
        'Delivery fee',
        'Lyxa earning',
        'Unsettled amount',
        'Delivery earning',
        'Cash in hand',
        'Settled cash',
      ],
    ];
    const marginLeft = 40;

    const data = getDeliveryTnx?.data?.data?.deliveryBoy.map((trx) => [
      trx?.name,
      trx?.summary?.orderValue?.count ?? 0,
      trx?.summary?.totalDeliveyFee,
      trx?.summary?.dropEarning,
      trx?.summary?.totalUnSettleAmount,
      trx?.summary?.riderEarning,
      trx?.summary.totalCashInHand,
      trx?.summary.settleAmount,
    ]);

    console.log('===>data', data);
    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`DeliveryBoysTransactions.pdf`);
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
          <Tab label="Rider LIst"></Tab>
          <Tab label="Invoices"></Tab>
        </Tabs>
      </Box>

      {currentTab !== 1 && (
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
      )}

      <Box sx={{ marginBottom: '30px' }}>
        <TabPanel index={0} value={currentTab} noPadding>
          {getDeliveryTnx?.isLoading ? (
            <TablePageSkeleton row={8} column={7} />
          ) : (
            <RiderFinancialsTable loading={getDeliveryTnx?.isLoading} data={getDeliveryTnx?.data?.data?.deliveryBoy} />
          )}
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <RiderInvoice />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default RidersTransaction;
