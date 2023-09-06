/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Stack } from '@mui/material';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
import RiderPayoutBreakDown from '../../../components/Shared/RiderFinancials/RiderPayoutBreakDown';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import DateRange from '../../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { AddMenuButton } from '../../Faq2';
import RiderFinancialsTable from './Table';

const queryParamsInit = {
  page: 1,
  pageSize: 15,
  endDate: moment(),
  startDate: getFirstMonday('week'),
  searchKey: '',
};

export default function RiderList() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  const query = useQuery([Api.GET_ALL_RIDER_ADMIN_ORDER_FINANCIALS_PROFITBREAKDOWN, queryParams], () =>
    AXIOS.get(Api.GET_ALL_RIDER_ADMIN_ORDER_FINANCIALS_PROFITBREAKDOWN, {
      params: queryParams,
    }),
  );

  console.log('query rider', query?.data);

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

    const data = query?.data?.data?.riders.map((trx) => [
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

  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" pb={7.5}>
        <DateRange range={queryParams} setRange={setQueryParams} startKey="startDate" endKey="endDate" />
      </Stack>

      <RiderPayoutBreakDown riderParams={{ start: queryParams?.startDate, end: queryParams.endDate }} />
      <Box>
        <Box>
          <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
            <StyledSearchBar
              sx={{ flex: '1' }}
              placeholder="Search"
              onChange={(e) => setQueryParams((prev) => ({ ...prev, searchKey: e.target.value }))}
            />
            <AddMenuButton
              title="Download"
              icon={<DownloadIcon />}
              onClick={() => {
                downloadPdf();
              }}
            />
          </Stack>
        </Box>
        <RiderFinancialsTable
          loading={query?.isLoading}
          data={query?.data?.data?.riders}
          currentPage={queryParams?.page}
          setCurrentPage={(page) => {
            setQueryParams((prev) => ({ ...prev, page }));
          }}
          totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
        />
      </Box>
    </Box>
  );
}
