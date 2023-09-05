/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import DateRange from '../../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { AddMenuButton } from '../../Faq2';
import RiderPayoutBreakDown from './RiderPayoutBreakDown';
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

  const query = useQuery([Api.DELIVERY_TRX, queryParams], () =>
    AXIOS.get(Api.DELIVERY_TRX, {
      params: queryParams,
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

    const data = query?.data?.data?.deliveryBoy.map((trx) => [
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
    <Grid container spacing={7.5} pb={12} pt={7.5}>
      <Grid sm={12}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <DateRange range={queryParams} setRange={setQueryParams} startKey="startDate" endKey="endDate" />
        </Stack>
      </Grid>

      <RiderPayoutBreakDown />
      {/* <InfoCard
        title="Total Riders Profit"
        value={`${currency} ${(0).toFixed(2)}`}
        Tag={<IncreaseDecreaseTag status="increase" amount={`${0}% last ${0}`} />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Total Lyxa Profit"
        value={`${0}`}
        Tag={<IncreaseDecreaseTag status={Math.round(0) >= 0 ? 'increase' : 'decrement'} amount={`${0}% last ${0}`} />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="NO. Orders"
        value={`${currency} ${0}`}
        Tag={<IncreaseDecreaseTag status="increase" amount={`${0}% last ${0}`} />}
        sm={6}
        md={4}
        lg={4}
      />
      <PayoutDetails paymentDetails={{}} /> */}
      <Grid sm={12}>
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
          data={query?.data?.data?.deliveryBoy}
          currentPage={queryParams?.page}
          setCurrentPage={(page) => {
            setQueryParams((prev) => ({ ...prev, page }));
          }}
          totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
        />
      </Grid>
    </Grid>
  );
}
