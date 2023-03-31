/* eslint-disable no-unused-vars */
// third party
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Button, Unstable_Grid2 as Grid, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// project import
import BreadCrumbs from '../../../components/Common/BreadCrumb2';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import PageButton from '../../../components/Common/PageButton';
import FilterDate from '../../../components/Filter/FilterDate';
import StyledSelect2 from '../../../components/Styled/StyledSelect2';
import StyledAreaChartfrom from '../../../components/StyledCharts/StyledAreaChart';
import StyledBarChart from '../../../components/StyledCharts/StyledBarChart';
import Wrapper from '../../../components/Wrapper';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MSettingsModal from '../MSettingsModal';
import MarketingSettings from '../Settings';
import InfoCard from './InfoCard';
import { ProductsInfoListData } from './mock';
import ProductsInfoList from './ProductsInfoList';
import { IncreaseDecreaseTag, ViewMoreTag } from './Tags';

const breadCrumbItems = [
  {
    label: 'Marketing',
    to: '/marketing',
  },
  {
    label: ' Loyalty Points',
    to: '/unknown',
  },
];

function StyledBox({ children, loading, padding }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: '#fff',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
        position: 'relative',
        overflow: 'hidden',
        padding: padding ? '18px 18px 23px 20px' : '0px',
      }}
    >
      {loading && <LoadingOverlay />}
      {children}
    </Box>
  );
}

const selectMockOptions = [
  {
    label: 'Week',
    value: 'week',
  },
  {
    label: 'Month',
    value: 'month',
  },
  {
    label: 'Year',
    value: 'year',
  },
];

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

const gData = (items, getData, getLabel) => {
  const labels = [];
  const data = [];

  items.forEach((item) => {
    // labels.push();
    labels.push(getLabel(item));
    data.push(getData(item));
  });

  return { labels, data };
};

function DateRange({ range, setRange }) {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <FilterDate
        value={range?.start}
        tooltip="Start Date"
        size="sm"
        onChange={(e) => {
          setRange((prev) => ({ ...prev, start: e._d }));
        }}
      />
      <FilterDate
        value={range?.end}
        tooltip="End Date"
        size="sm"
        onChange={(e) => {
          setRange((prev) => ({ ...prev, end: e._d }));
        }}
      />
    </Stack>
  );
}

export default function MarketingDashboard() {
  const params = useParams();
  const adminShop = useSelector((store) => store.Login.admin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState(adminShop);

  const singleShopQuery = useQuery(
    [`single-shop-${params?.shopId}`],
    () =>
      AXIOS.get(Api.SINGLE_SHOP, {
        params: {
          id: params?.shopId,
        },
      }),
    {
      enabled: !!params?.shopId,
      onSuccess: (data) => {
        if (data?.status) {
          setCurrentShop(data?.data?.shop);
        }
      },
    }
  );

  const marketingInfoQuery = useQuery([`marketing-dashboard-${params?.id}`], () =>
    AXIOS.get(Api.GET_MARKETING_DASHBOARD_INFO, {
      params: {
        marketingId: params?.id,
      },
    })
  );

  // orders graph
  const [orderRange, setOrderRange] = useState({ ...dateRangeItit });

  const ordersGraphQuery = useQuery(
    [`marketing-graph-orders-${params?.id}-${orderRange.start}-${orderRange.end}`],
    () =>
      AXIOS.get(Api.GET_MARKETING_DASHBOARD_ORDER_GRAPH, {
        params: {
          marketingId: params?.id,
          startDate: orderRange.start,
          endDate: orderRange.end,
        },
      })
  );

  const oData = gData(
    ordersGraphQuery?.data?.data?.info || [],
    (item) => item.order,
    (item) => moment(item?.date).format('MMMM DD')
  );

  const oGraphData = {
    labels: oData.labels,
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: oData.data,
        borderColor: 'rgba(21, 191, 202, 1)',
        borderWidth: 1,
        backgroundColor: 'rgba(21, 191, 202, .3)',
      },
    ],
  };

  // customer data
  const [customerRange, setCustomerRange] = useState({ ...dateRangeItit });

  const customerGraphQuery = useQuery(
    [`marketing-graph-customer-${params?.id}-${customerRange.start}-${customerRange.end}`],
    () =>
      AXIOS.get(Api.GET_MARKETING_DASHBOARD_CUSTOMER_GRAPH, {
        params: {
          marketingId: params?.id,
          startDate: customerRange.start,
          endDate: customerRange.end,
        },
      })
  );

  const cData = gData(
    customerGraphQuery?.data?.data?.info || [],
    (item) => item.customer,
    (item) => moment(item?.date).format('MMMM DD')
  );

  const cGraphData = {
    labels: cData.labels,
    datasets: [
      {
        label: 'Amount',
        data: cData.data,
        backgroundColor: '#15BFCA',
      },
    ],
  };

  // amount spent
  const [amountRange, setAmountRange] = useState({ ...dateRangeItit });

  const amountGraphQuery = useQuery(
    [`marketing-graph-amount-${params?.id}-${amountRange.start}-${amountRange.end}`],
    () =>
      AXIOS.get(Api.GET_MARKETING_DASHBOARD_AMOUNT_SPENT_GRAPH, {
        params: {
          marketingId: params?.id,
          startDate: amountRange.start,
          endDate: amountRange.end,
        },
      })
  );

  const aData = gData(
    amountGraphQuery?.data?.data?.info || [],
    (item) => item.amount,
    (item) => moment(item?.date).format('MMMM DD')
  );

  const aGraphData = {
    labels: aData.labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: aData.data,
        borderColor: 'rgba(21, 191, 202, 1)',
        backgroundColor: 'rgba(21, 191, 202, 0)',
        borderWidth: 1,
      },
    ],
  };

  // export const lineChartData =

  return (
    <Wrapper
      sx={{
        paddingTop: '70px',
        paddingBottom: '110px',
        background: '#FBFBFB !important',
        height: '100%',
        overflowY: 'scroll',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" pt={8}>
        <PageButton label="Back to Marketing" to="/marketing" startIcon={<KeyboardBackspaceIcon />} />
        <Button
          variant="contained"
          color="secondary"
          disabled={singleShopQuery.isLoading}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Manage Promotions
        </Button>
      </Stack>
      <BreadCrumbs items={breadCrumbItems} />
      <Grid container spacing={6.5} pb={3}>
        <Grid sm={6} md={4} lg={4}>
          <StyledBox>
            <InfoCard
              title="Ongoing Promotions on Items"
              value={marketingInfoQuery?.data?.data?.summary?.totalPromotionItems || 0}
              Tag={<ViewMoreTag />}
            />
          </StyledBox>
        </Grid>
        <Grid sm={6} md={4} lg={4}>
          <StyledBox>
            <InfoCard
              title="Order Increase with Discounts"
              value={`${Math.round(marketingInfoQuery?.data?.data?.summary?.orderIncreasePercentage || 0)}%`}
              Tag={
                <IncreaseDecreaseTag
                  status={
                    marketingInfoQuery?.data?.data?.summary?.orderIncreasePercentageLastMonth > 0
                      ? 'increase'
                      : 'decrease'
                  }
                  amount={`${Math.round(
                    marketingInfoQuery?.data?.data?.summary?.orderIncreasePercentageLastMonth || 0
                  )}%`}
                />
              }
            />
          </StyledBox>
        </Grid>
        <Grid sm={6} md={4} lg={4}>
          <StyledBox>
            <InfoCard
              title="Customer Increase with Discounts"
              value={`${Math.round(marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentage || 0)}%`}
              Tag={
                <IncreaseDecreaseTag
                  status="decrease"
                  amount={`${Math.round(
                    marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentageLastMonth || 0
                  )}%`}
                />
              }
            />
          </StyledBox>
        </Grid>
        {params?.type === 'reward' && (
          <>
            <Grid sm={12} md={12} lg={5}>
              <StyledBox>
                <ProductsInfoList
                  items={ProductsInfoListData}
                  onVeiwMore={() => {
                    console.log('Clicked');
                  }}
                />
              </StyledBox>
            </Grid>
            <Grid sm={12} md={12} lg={7}>
              <StyledBox padding>
                <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
                  <Typography variant="body1" fontWeight={600}>
                    Loyalty points usage
                  </Typography>
                  <StyledSelect2 items={selectMockOptions} defaultValue="week" />
                </Stack>
                <Box
                  sx={{
                    height: '325px',
                  }}
                >
                  <StyledBarChart data={oGraphData} />
                </Box>
              </StyledBox>
            </Grid>
          </>
        )}
        <Grid sm={12}>
          <StyledBox padding loading={ordersGraphQuery.isLoading}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
              <Typography variant="body1" fontWeight={600}>
                Orders
              </Typography>
              <DateRange range={orderRange} setRange={setOrderRange} />
            </Stack>
            <Box
              sx={{
                height: '245px',
              }}
            >
              <StyledAreaChartfrom data={oGraphData} />
            </Box>
          </StyledBox>
        </Grid>
        <Grid sm={12} md={12} lg={6}>
          <StyledBox padding loading={customerGraphQuery.isLoading}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
              <Typography variant="body1" fontWeight={600}>
                Customers
              </Typography>
              <DateRange range={customerRange} setRange={setCustomerRange} />
            </Stack>
            <Box
              sx={{
                height: '325px',
              }}
            >
              <StyledBarChart data={cGraphData} />
            </Box>
          </StyledBox>
        </Grid>
        <Grid sm={12} md={12} lg={6}>
          <StyledBox padding loading={amountGraphQuery.isLoading}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
              <Typography variant="body1" fontWeight={600}>
                Amount spent
              </Typography>
              <DateRange range={amountRange} setRange={setAmountRange} />
            </Stack>
            <Box
              sx={{
                height: '325px',
              }}
            >
              <StyledAreaChartfrom data={aGraphData} />
            </Box>
          </StyledBox>
        </Grid>
      </Grid>
      <MSettingsModal open={Boolean(isModalOpen)}>
        <MarketingSettings
          shop={currentShop}
          creatorType={params?.shopId ? 'admin' : 'shop'}
          marketingType={params?.type}
          closeModal={() => {
            setIsModalOpen(false);
          }}
        />
      </MSettingsModal>
    </Wrapper>
  );
}
