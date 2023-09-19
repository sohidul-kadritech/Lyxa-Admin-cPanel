/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
// third party
import { Box, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';

// local
import { useQuery } from 'react-query';
import DateRange from '../../components/StyledCharts/DateRange';

import PageTop from '../../components/Common/PageTop';
import { dateRangeItit, getTotalProfitForLyxa } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';
import { useGlobalContext } from '../../context';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { calculateDateDifference } from '../ShopDashboard/helper';
import ButlerOrderPayoutDetails from './ButlerOrderPayoutDetails';
import ButlerOrderPayoutDetailsTable from './ButlerOrderPayoutDetailsTable';
import { convertDate } from './OrderFinancials';
import { bothCurrencyProfitbreakDown } from './helpers';

const breadcrumbItems = [
  {
    label: 'Lyxa Financials',
    to: '/financials/lyxa',
  },
  {
    label: 'Lyxa Butler Financials',
    to: '#',
  },
];

export default function LyxaButlerOrderFinancials() {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });

  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  const getFinancialsDashBoard = useQuery(
    [
      API_URL.GET_ADMIN_BUTLER_FINANCIALS_DASHBOARD,
      { startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end },
    ],
    () =>
      AXIOS.get(API_URL.GET_ADMIN_BUTLER_FINANCIALS_DASHBOARD, {
        params: {
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  // admin/financial/butler

  console.log('getFinancialsDashBoard for butler', getFinancialsDashBoard?.data?.data);

  const summary = getFinancialsDashBoard?.data?.data;

  const profitBreakdown = summary?.profitBreakdown;

  return (
    <Box>
      <PageTop backTo="/financials/lyxa" backButtonLabel="Back to Lyxa Financials" breadcrumbItems={breadcrumbItems} />
      <Grid container spacing={7.5} pb={7.5}>
        <Grid xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
            <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
          </Stack>
        </Grid>
        <InfoCard
          title="Total Lyxa Profit"
          valueComponent={
            <Stack direction="column" alignItems="baseline" gap={2}>
              <Typography
                variant="h2"
                sx={{
                  lineHeight: '24px',
                  fontSize: '40px',
                }}
              >
                {currency} {(profitBreakdown?.adminButlerProfit || 0).toFixed(2)}
              </Typography>

              {profitBreakdown?.adminButlerProfit ? (
                <Typography
                  variant="inherit"
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  {
                    getTotalProfitForLyxa(
                      currency,
                      secondaryCurrency,
                      bothCurrencyProfitbreakDown(profitBreakdown, 'butler'),
                      true,
                    ).printConditionally
                  }
                </Typography>
              ) : null}
            </Stack>
          }
          // value={profitBreakdown?.adminButlerProfit || 0}
          // value={profitBreakdown?.adminButlerProfit || 0}
          Tag={
            <IncreaseDecreaseTag
              status="increase"
              amount={`${Math.round(
                Math.abs(summary?.adminButlerProfitAvgInPercentage || 0),
              )}% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
            />
          }
          sm={6}
          md={6}
          lg={6}
        />
        <InfoCard
          title="Total Orders"
          value={summary?.totalDeliveredOrder || 0}
          Tag={
            <IncreaseDecreaseTag
              status="increase"
              amount={`${Math.round(
                Math.abs(summary?.totalDeliveredOrderAvgInPercentage || 0),
              )}% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
            />
          }
          sm={6}
          md={6}
          lg={6}
        />
        <ButlerOrderPayoutDetails paymentDetails={profitBreakdown} />
        <Grid xs={12}>
          <ButlerOrderPayoutDetailsTable paymentDetailsRange={paymentDetailsRange} />
        </Grid>
      </Grid>
    </Box>
  );
}
