import { Box, Stack, Tab, Tabs } from '@mui/material';
import jsPDF from 'jspdf';
import moment from 'moment';
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
import SellerInvoice from './Invoices';
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

const queryParamsInit = {
  page: 1,
  pageSize: 15,
  endDate: moment(),
  startDate: moment().subtract(7, 'd'),
  searchKey: '',
};

function FinancialsForSeller() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [currentTab, setCurrentTab] = useState(0);

  const query = useQuery([API_URL.SELLERS_TRX, queryParams], () =>
    AXIOS.get(API_URL.SELLERS_TRX, {
      params: queryParams,
    })
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

    const data = query?.data?.data?.sellers.map((trx) => [
      trx?.company_name,
      trx?.summary.totalOrder,
      trx?.summary.orderValue?.productAmount.toFixed(2),
      trx?.summary.orderValue?.deliveryFee,
      trx?.summary.totalDropGet.toFixed(2),
      trx?.summary.totalSellerUnsettle.toFixed(2),
      trx?.summary.totalSellerEarning,
    ]);

    console.log('downloadPdf before ==>', query?.data?.data?.sellers);
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
      <PageTop backButtonLabel="Back to Financials" breadcrumbItems={breadcrumbItems} backTo="/financials" />
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
      {currentTab !== 1 && (
        <Box>
          <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
            <StyledSearchBar
              sx={{ flex: '1' }}
              placeholder="Search"
              onChange={(e) => setQueryParams((prev) => ({ ...prev, searchKey: e.target.value }))}
            />
            <DateRange startKey="startDate" endKey="endDate" range={queryParams} setRange={setQueryParams} />
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
      <Box sx={{ marginBottom: '35px' }}>
        <TabPanel index={0} value={currentTab} noPadding>
          {query?.isLoading ? (
            <TablePageSkeleton row={8} column={7} />
          ) : (
            <SellerFinancialsTable
              loading={query?.isLoading}
              data={query?.data?.data?.sellers}
              currentPage={queryParams?.page}
              setPage={(page) => setQueryParams((prev) => ({ ...prev, page }))}
              totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
            />
          )}
        </TabPanel>
        <TabPanel index={1} value={currentTab} noPadding>
          <SellerInvoice />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default FinancialsForSeller;
