/* eslint-disable no-unused-vars */
// third party
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import PageTop from '../../../components/Common/PageTop';

// project import
import ChartBox from '../../../components/StyledCharts/ChartBox';
import IncreaseDecreaseTag from '../../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import StyledAreaChartfrom from '../../../components/StyledCharts/StyledAreaChart';
import StyledBarChart from '../../../components/StyledCharts/StyledBarChart';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MSettingsModal from '../MSettingsModal';
import MarketingSettings from '../Settings';
import PageSkeleton from './PageSkeleton';
import ProductsInfoList from './ProductsInfoList';
import { ViewMoreTag, dateRangeItit } from './helpers';
import { ProductsInfoListData } from './mock';

const mTypeMap = {
  double_menu: 'Buy 1, Get 1 Free',
  percentage: 'Discounted Items',
  free_delivery: '$0 Delivery fee',
  reward: 'Loyalty',
  featured: 'Featured',
};

export default function MarketingDashboard({ viewUserType }) {
  const params = useParams();
  const history = useHistory();

  // const shop = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { shop, userType } = currentUser;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState(shop);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  const oData = generateGraphData(
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

  const cData = generateGraphData(
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

  const aData = generateGraphData(
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

  // loyalty points
  const [loyalityRange, setLoyalityRange] = useState({ ...dateRangeItit });

  const loyalityGraphQuery = useQuery(
    [`marketing-graph-amount-${params?.id}-${loyalityRange.start}-${loyalityRange.end}`],
    () =>
      AXIOS.get(Api.GET_MARKETING_DASHBOARD_LOYALTY_POINTS_GRAPH, {
        params: {
          marketingId: params?.id,
          startDate: loyalityRange.start,
          endDate: loyalityRange.end,
        },
      })
  );

  const pData = generateGraphData(
    loyalityGraphQuery?.data?.data?.info || [],
    (item) => item.amountSpent,
    (item) => moment(item?.date).format('MMMM DD')
  );

  const pGraphData = {
    labels: pData.labels,
    datasets: [
      {
        label: 'Amount',
        data: pData.data,
        backgroundColor: '#15BFCA',
      },
    ],
  };

  const breadCrumbItems = [
    {
      label: 'Marketing',
      to: params?.shopId ? `/shops/marketing/${params?.shopId}` : '/marketing',
    },
    {
      label: `${mTypeMap[params?.type]}`,
      to: '#',
    },
  ];

  // loading
  const __loading =
    loyalityGraphQuery.isLoading ||
    amountGraphQuery.isLoading ||
    customerGraphQuery.isLoading ||
    ordersGraphQuery.isLoading ||
    singleShopQuery.isLoading ||
    marketingInfoQuery.isLoading;

  useEffect(() => {
    if (!__loading) {
      setIsInitialLoad(false);
    }
  }, [__loading]);

  const getBackToUrl = (viewUserType) => {
    if (viewUserType === 'shop' && userType === 'shop') return '/marketing';
    if (viewUserType === 'shop' && userType === 'seller') return `/shop/dashboard/${params?.shopId}/marketing`;
    if (viewUserType === 'admin') return `/shops/marketing/${params?.shopId}`;
    return '';
  };

  return (
    <Box>
      <PageTop
        breadcrumbItems={breadCrumbItems}
        backButtonLabel="Back to Marketing"
        // backTo={viewUserType ? `/shops/marketing/${params?.shopId}` : '/marketing'}
        backTo={getBackToUrl(viewUserType)}
        addButtonLabel="Manage Promotions"
        onAdd={() => {
          setIsModalOpen(true);
        }}
      />
      {__loading && isInitialLoad ? (
        <PageSkeleton />
      ) : (
        <Grid container spacing={6.5} pb={3}>
          <InfoCard
            title="Ongoing Promotions on Items"
            value={marketingInfoQuery?.data?.data?.summary?.totalPromotionItems || 0}
            Tag={<ViewMoreTag />}
            sm={6}
            md={4}
            lg={4}
          />
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
            sm={6}
            md={4}
            lg={4}
          />
          <InfoCard
            title="Customer Increase with Discounts"
            value={`${Math.round(marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentage || 0)}%`}
            Tag={
              <IncreaseDecreaseTag
                status={
                  marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentageLastMonth > 0
                    ? 'increase'
                    : 'decrease'
                }
                amount={`${Math.round(
                  marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentageLastMonth || 0
                )}%`}
              />
            }
            sm={6}
            md={4}
            lg={4}
          />
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
              <ChartBox
                chartHeight={325}
                dateRange={loyalityRange}
                setDateRange={setLoyalityRange}
                loading={loyalityGraphQuery.isLoading}
                title="Loyalty points usage"
                sm={12}
                md={12}
                lg={7}
              >
                <StyledBarChart data={pGraphData} />
              </ChartBox>
            </>
          )}
          <ChartBox
            chartHeight={245}
            dateRange={orderRange}
            setDateRange={setOrderRange}
            title="Orders"
            sm={12}
            loading={ordersGraphQuery.isLoading}
          >
            <StyledAreaChartfrom data={oGraphData} />
          </ChartBox>
          <ChartBox
            chartHeight={325}
            dateRange={customerRange}
            setDateRange={setCustomerRange}
            loading={customerGraphQuery.isLoading}
            title="Customers"
            sm={12}
            md={12}
            lg={6}
          >
            <StyledBarChart data={cGraphData} />
          </ChartBox>
          <ChartBox
            chartHeight={325}
            dateRange={amountRange}
            setDateRange={setAmountRange}
            loading={amountGraphQuery.isLoading}
            title="Amount spent"
            sm={12}
            md={12}
            lg={6}
          >
            <StyledAreaChartfrom data={aGraphData} />
          </ChartBox>
        </Grid>
      )}

      <MSettingsModal open={Boolean(isModalOpen)}>
        <MarketingSettings
          shop={currentShop}
          creatorType={params?.shopId ? 'admin' : 'shop'}
          marketingType={params?.type}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onDelete={() => {
            if (params?.shopId) {
              history.push(`/shops/marketing/${currentShop?._id}`);
            } else {
              history.push(`/marketing`);
            }
          }}
        />
      </MSettingsModal>
    </Box>
  );
}
