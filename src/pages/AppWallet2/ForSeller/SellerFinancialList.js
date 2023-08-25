import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import jsPDF from 'jspdf';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
import PayoutDetails from '../../../components/Shared/FinancialsOverview/PayoutDetails';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import DateRange from '../../../components/StyledCharts/DateRange';
import IncreaseDecreaseTag from '../../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import { useGlobalContext } from '../../../context';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { AddMenuButton } from '../../Faq2';
import SellerFinancialsTable from './SellerFinancialsTable';

const queryParamsInit = {
  page: 1,
  pageSize: 15,
  endDate: moment(),
  startDate: getFirstMonday('week'),
  searchKey: '',
};

export default function SellerFinancialList() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  const { general } = useGlobalContext();
  const currency = general?.currency;

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

    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save('seller-transactions.pdf');
  };

  return (
    <Grid container spacing={7.5} pb={3}>
      <Grid sm={12}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <DateRange startKey="startDate" endKey="endDate" range={queryParams} setRange={setQueryParams} />
        </Stack>
      </Grid>
      <InfoCard
        title="Total Profit"
        value={`${currency?.symbol} ${(0).toFixed(2)}`}
        Tag={<IncreaseDecreaseTag status="increase" amount={`${0}% last ${0}`} />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Orders"
        value={`${0}`}
        Tag={<IncreaseDecreaseTag status={Math.round(0) >= 0 ? 'increase' : 'decrement'} amount={`${0}% last ${0}`} />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title=" Marketing Spent"
        value={`${currency?.symbol} ${0}`}
        Tag={<IncreaseDecreaseTag status="increase" amount={`${0}% last ${0}`} />}
        sm={6}
        md={4}
        lg={4}
      />
      <PayoutDetails paymentDetails={{}} />
      <Grid sm={12}>
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
        <SellerFinancialsTable
          loading={query?.isLoading}
          data={query?.data?.data?.sellers}
          currentPage={queryParams?.page}
          setPage={(page) => setQueryParams((prev) => ({ ...prev, page }))}
          totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
        />
      </Grid>
    </Grid>
  );
}
