/* eslint-disable max-len */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
// third party
import { Box, Button, Unstable_Grid2 as Grid, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../../components/Common/PageTop';

// project import
import ChartBox from '../../../components/StyledCharts/ChartBox';
import IncreaseDecreaseTag from '../../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import StyledAreaChartfrom from '../../../components/StyledCharts/StyledAreaChart';
import StyledBarChart from '../../../components/StyledCharts/StyledBarChart';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MSettingsModal from '../MSettingsModal';
import MarketingSettings from '../Settings';
import PageSkeleton from './PageSkeleton';
import {
  dateRangeItit,
  getDataForOngoingPromotionItem,
  getMarketingTypeTitle,
  getPercentageMarketingCreatorType,
  isVisibleOngoingPromotionItem,
  marketingDurationTime,
} from './helpers';

const mTypeMap = {
  double_menu: 'Buy 1, Get 1 Free',
  percentage: 'Discounted Items',
  free_delivery: '$0 Delivery fee',
  reward: 'Loyalty',
  featured: 'Featured',
};

const tabIndex = (userType, value) => {
  const template = {
    0: 'admin',
    1: 'shop',
    admin: 0,
    shop: 1,
  };

  if (userType === 'shop') {
    template['0'] = 'shop';
    template.shop = 0;
    template['1'] = 'admin';
    template.admin = 1;
  }
  console.log('template', template, value);
  return template[value];
};

export const percentageMarketingExistOrNot = (mData) => {
  console.log('is exist or not', { mData });

  const marketingData = mData?.isMarketing ? mData?.data?.marketings : mData?.marketings;

  const existingMarketing = marketingData?.find(
    (mrkting) => mrkting?.creatorType === 'admin' || mrkting?.creatorType === 'shop',
  );

  return !!existingMarketing;
};

export const getMarketingId = (mData, userType, returnObject = false) => {
  const marketingData = mData?.isMarketing ? mData?.data?.marketings : mData?.marketings;

  const existingMarketing = marketingData?.find(
    (mrkting) => mrkting?.creatorType === 'admin' || mrkting?.creatorType === 'shop',
  );

  if (!existingMarketing) {
    return undefined;
  }

  const marketingForAdmin = marketingData?.find((mrkting) => mrkting?.creatorType === 'admin');
  const marketingForShop = marketingData?.find((mrkting) => mrkting?.creatorType === 'shop');

  let marketing = {};

  if (userType === 'admin' && marketingForAdmin) {
    marketing = marketingForAdmin;
  } else if (userType === 'shop' && marketingForShop) {
    marketing = marketingForShop;
  }

  if (returnObject) return marketing;
  return marketing?._id;
};

export const replaceLastSlugPath = (path, replaceSlug) => {
  // Regular expression to match the last part of the URL
  const regex = /\/[^/]+$/;
  // Replace the last part of the URL with the new slug
  const newUrl = path.replace(regex, replaceSlug);
  return newUrl;
};

export default function MarketingDashboard({ viewUserType }) {
  const params = useParams();
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const { search, pathname } = useLocation();
  const theme = useTheme();

  const queryClient = useQueryClient();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { currentUser, general } = useGlobalContext();
  const { shop, userType } = currentUser;
  const { currency } = general;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState(shop);
  console.log('marketing settings', { shop, currentUser }, searchParams.get('tab'));
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [currentTab, setCurrentTab] = useState(searchParams.get('tab'));

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
    },
  );

  const marketingQuery = useQuery(
    [
      `marketing-settings`,
      {
        creatorType: searchParams.get('creator'),
        shop: params?.shopId || searchParams.get('shopId') || shop?._id,
        currentTab,
      },
    ],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: {
          creatorType: viewUserType,
          type: params?.type,
          shop: params?.shopId || searchParams.get('shopId') || shop?._id,
        },
      }),
    {
      onSuccess: (data) => {
        // marketing does not exist
        if (!data?.status) {
          history?.goForward();
        }
      },

      onError: (error) => {
        console.log(error);
        history?.goForward();
      },
    },
  );

  const marketingDuration = marketingDurationTime(
    marketingQuery?.data?.data?.marketing?.duration?.start,
    marketingQuery?.data?.data?.marketing?.duration?.end,
  );

  const marketingInfoQuery = useQuery(
    [`marketing-dashboard-${params?.id}`],
    () =>
      AXIOS.get(Api.GET_MARKETING_DASHBOARD_INFO, {
        params: {
          marketingId: params?.id,
        },
      }),
    {
      enabled: params?.id !== 'undefined',
    },
  );

  // orders graph
  const [orderRange, setOrderRange] = useState({ ...dateRangeItit });

  const ordersGraphQuery = useQuery(
    [`marketing-graph-orders-${params?.id}-${orderRange.start}-${orderRange.end}`],
    () =>
      AXIOS.get(Api.GET_MARKETING_DASHBOARD_ORDER_GRAPH, {
        params: {
          marketingId: params?.id,
          startDate: moment(orderRange.start).format('YYYY-MM-DD'),
          endDate: moment(orderRange.end).format('YYYY-MM-DD'),
        },
        // eslint-disable-next-line prettier/prettier
      }),
    {
      enabled: params?.id !== 'undefined',
    },
  );

  const oData = generateGraphData(
    ordersGraphQuery?.data?.data?.info || [],
    (item) => item.order,
    // eslint-disable-next-line prettier/prettier
    (item) => moment(item?.date).format('MMMM DD'),
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
          startDate: moment(customerRange.start).format('YYYY-MM-DD'),
          endDate: moment(customerRange.end).format('YYYY-MM-DD'),
        },
      }),
    {
      enabled: params?.id !== 'undefined',
    },
  );

  const cData = generateGraphData(
    customerGraphQuery?.data?.data?.info || [],
    (item) => item.customer,
    (item) => moment(item?.date).format('MMMM DD'),
  );

  const cGraphData = {
    labels: cData.labels,
    datasets: [
      {
        label: 'Customer',
        data: cData.data,
        backgroundColor: '#15BFCA',
      },
    ],
  };

  // amount spent
  const [amountRange, setAmountRange] = useState({ ...dateRangeItit });

  const amountGraphApi =
    params?.type === 'reward'
      ? Api.GET_MARKETING_DASHBOARD_LOYALTY_POINTS_AMOUNT_SPENT_GRAPH
      : Api.GET_MARKETING_DASHBOARD_AMOUNT_SPENT_GRAPH;

  const amountGraphQuery = useQuery(
    [`marketing-graph-amount-${params?.id}-${amountRange.start}-${amountRange.end}`],
    () =>
      AXIOS.get(amountGraphApi, {
        params: {
          marketingId: params?.id,
          startDate: moment(amountRange.start).format('YYYY-MM-DD'),
          endDate: moment(amountRange.end).format('YYYY-MM-DD'),
        },
        // eslint-disable-next-line prettier/prettier
      }),
    {
      enabled: params?.id !== 'undefined',
    },
  );

  const aData = generateGraphData(
    amountGraphQuery?.data?.data?.info || [],
    params?.type === 'reward'
      ? (item) => ({ shopAmountSpent: item.shopAmountSpent, adminAmountSpent: item.adminAmountSpent })
      : (item) => item.amountSpent,
    (item) => moment(item?.date).format('MMMM DD'),
  );

  const aGraphData = {
    labels: aData.labels,
    datasets:
      params?.type === 'reward'
        ? [
            {
              label: `Amount(Shop) (${currency?.symbol})`,
              data: aData?.data.map((amount) => amount?.shopAmountSpent),
              borderColor: 'rgba(221, 91, 99, 1)',
              backgroundColor: 'rgba(21, 191, 202, 0)',
              borderWidth: 1,
            },
            {
              label: `Amount(Lxya) (${currency?.symbol})`,
              data: aData?.data.map((amount) => amount?.adminAmountSpent),
              borderColor: 'rgba(21, 11, 202, 1)',
              backgroundColor: 'rgba(21, 191, 202, 0)',
              borderWidth: 1,
            },
          ]
        : [
            {
              label: `Amount (${currency?.symbol})`,
              data: aData.data,
              borderColor: 'rgba(21, 191, 202, 1)',
              backgroundColor: 'rgba(21, 191, 202, 0)',
              borderWidth: 1,
            },
          ],
  };

  const breadCrumbItems = [
    {
      label: 'Marketings',
      to: params?.shopId ? `/shop/dashboard/${params?.shopId}/marketing` : '/marketing',
    },
    {
      label: `${getMarketingTypeTitle(params?.type)}`,
      to:
        searchParams.get('user') && searchParams.get('tab')
          ? `${routeMatch?.url}?user=${searchParams.get('user')}&tab=${searchParams.get('tab')}`
          : '#',
    },
  ];

  // loading
  const __loading =
    // loyalityGraphQuery.isLoading ||
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

  useEffect(() => {
    if (params?.type === 'percentage') {
      // get marketing data
      const getMarketing = getMarketingId(
        marketingQuery?.data,
        searchParams.get('tab') ? searchParams.get('tab') : viewUserType,
        true,
      );

      // store search params
      const searchValue = `user=${searchParams.get('user') ? searchParams.get('user') : viewUserType}&tab=${
        searchParams.get('tab') ? searchParams.get('tab') : viewUserType
      }`;

      // make route object
      const route = {
        pathname: replaceLastSlugPath(pathname, `/${getMarketing?._id}`),
        search: searchValue,
      };

      // change current tab value
      setCurrentTab(searchParams.get('tab') ? searchParams.get('tab') : viewUserType);
      // change route
      history.push(route);
    }
  }, [marketingQuery?.data]);

  const getBackToUrl = (viewUserType) => {
    const routeSeg = routeMatch?.url?.split('/');

    routeSeg?.pop();
    routeSeg?.pop();
    routeSeg?.pop();

    console.log({ routeSeg });
    return routeSeg?.join('/');
  };

  return (
    <Box>
      <PageTop
        breadcrumbItems={breadCrumbItems}
        backButtonLabel="Back to Marketing"
        backTo={getBackToUrl(viewUserType)}
        addButtonLabel="Manage Promotion"
        onAdd={() => {
          if (
            (viewUserType === 'shop' && userType === 'admin') ||
            marketingQuery?.data?.isNotEligible ||
            marketingQuery.isLoading
          )
            return;
          setIsModalOpen(true);
        }}
        onAddDisabled={
          (viewUserType === 'shop' && userType === 'admin') ||
          marketingQuery?.data?.isNotEligible ||
          marketingQuery.isLoading ||
          (params?.type === 'percentage' && viewUserType !== currentTab)
        }
      />

      {params?.type === 'percentage' && (
        <Tabs
          value={tabIndex(searchParams.get('user'), currentTab)}
          onChange={(event, newValue) => {
            const route = {
              pathname: replaceLastSlugPath(
                pathname,
                `/${getMarketingId(marketingQuery?.data, tabIndex(searchParams.get('user'), newValue))}`,
              ),
              search: `user=${searchParams.get('user')}&tab=${tabIndex(searchParams.get('user'), newValue)}`,
            };

            history.push(route);

            setCurrentTab((prev) => tabIndex(searchParams.get('user'), newValue));
          }}
          sx={{
            paddingBottom: 5,
            '& .MuiTab-root': {
              padding: '8px 12px',
              textTransform: 'none',
            },
          }}
        >
          {searchParams.get('user') === 'shop' && <Tab tabIndex="shop" label="Shop" />}
          <Tab tabIndex="admin" label="Admin" />
          {searchParams.get('user') === 'admin' && <Tab tabIndex="shop" label="Shop" />}
        </Tabs>
      )}

      {__loading && isInitialLoad ? (
        <PageSkeleton />
      ) : (
        <Stack>
          {params?.id !== 'undefined' ? (
            <Grid container spacing={6.5} pb={3}>
              {isVisibleOngoingPromotionItem(params?.type) && (
                <InfoCard
                  title={`${params?.type === 'featured' ? 'Amount Spent' : 'Ongoing Promotions on Items'}`}
                  value={getDataForOngoingPromotionItem(
                    params?.type,
                    marketingInfoQuery?.data?.data?.summary,
                    currency,
                  )}
                  sm={6}
                  md={4}
                  lg={4}
                />
              )}
              <InfoCard
                title={`Order Increase with ${getMarketingTypeTitle(params?.type)}`}
                value={`${Math.round(marketingInfoQuery?.data?.data?.summary?.orderIncreasePercentage || 0)}%`}
                Tag={
                  <IncreaseDecreaseTag
                    status={
                      marketingInfoQuery?.data?.data?.summary?.orderIncreasePercentage -
                        marketingInfoQuery?.data?.data?.summary?.orderIncreasePercentageLastMonth >=
                      0
                        ? 'increase'
                        : 'decrease'
                    }
                    amount={`${Math.round(
                      marketingInfoQuery?.data?.data?.summary?.orderIncreasePercentage -
                        marketingInfoQuery?.data?.data?.summary?.orderIncreasePercentageLastMonth || 0,
                    )}% in ${marketingDuration}`}
                  />
                }
                sm={isVisibleOngoingPromotionItem(params?.type) ? 6 : 6}
                md={isVisibleOngoingPromotionItem(params?.type) ? 4 : 6}
                lg={isVisibleOngoingPromotionItem(params?.type) ? 4 : 6}
              />
              <InfoCard
                title={`Customer Increase with ${getMarketingTypeTitle(params?.type)}`}
                value={`${Math.round(marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentage || 0)}%`}
                Tag={
                  <IncreaseDecreaseTag
                    status={
                      marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentage -
                        marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentageLastMonth >=
                      0
                        ? 'increase'
                        : 'decrease'
                    }
                    amount={`${Math.round(
                      marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentage -
                        marketingInfoQuery?.data?.data?.summary?.customerIncreasePercentageLastMonth || 0,
                    )}% in ${marketingDuration}`}
                  />
                }
                sm={isVisibleOngoingPromotionItem(params?.type) ? 6 : 6}
                md={isVisibleOngoingPromotionItem(params?.type) ? 4 : 6}
                lg={isVisibleOngoingPromotionItem(params?.type) ? 4 : 6}
              />
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
                lg={params?.type !== 'featured' ? 6 : 12}
              >
                <StyledBarChart data={cGraphData} />
              </ChartBox>
              {params?.type !== 'featured' && (
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
              )}
            </Grid>
          ) : (
            <Stack
              sx={{
                width: '100%',
                background: 'rgba(177,177,177,0.1)',
                padding: '10px 10px',
                height: 'max(350px,40vh)',
                borderRadius: '10px',
                justifyContent: 'center',
                alignContent: 'center',
                border: `1px solid ${theme?.palette?.custom?.border}`,
              }}
            >
              <Stack justifyContent="center" alignItems="center" gap={6}>
                <Typography variant="h6" sx={{ fontSize: '28px' }}>
                  No Marketing Found
                </Typography>
                <Button
                  variant="contained"
                  // size="small"
                  disabled={viewUserType !== currentTab}
                  sx={{
                    borderRadius: '8px',
                    padding: '11px 30px',
                  }}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Add Marketing
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
      <MSettingsModal open={Boolean(isModalOpen)}>
        <MarketingSettings
          shop={currentShop}
          // creatorType={params?.shopId ? 'admin' : 'shop'}
          creatorType={getPercentageMarketingCreatorType(params, currentTab)}
          marketingType={params?.type}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onDelete={() => {
            history.replace(getBackToUrl(viewUserType));
          }}
          onSuccessHandler={async (data) => {
            if (data?.status) {
              Promise.all([
                queryClient.invalidateQueries(`marketing-settings`),
                queryClient.invalidateQueries(`marketing-dashboard-${params?.id}`),
                queryClient.invalidateQueries(
                  `marketing-graph-orders-${params?.id}-${orderRange.start}-${orderRange.end}`,
                ),
                queryClient.invalidateQueries(
                  `marketing-graph-customer-${params?.id}-${customerRange.start}-${customerRange.end}`,
                ),
                queryClient.invalidateQueries(
                  `marketing-graph-amount-${params?.id}-${amountRange.start}-${amountRange.end}`,
                ),
              ]);

              // console.log('marketing data', { data }, data?.data?.marketing?._id);

              if (params?.type === 'percentage') {
                const route = {
                  pathname: replaceLastSlugPath(pathname, `/${data?.data?.marketing?._id}`),
                  search: `user=${searchParams.get('user')}`,
                };

                history.push(route);
              }
            }
          }}
        />
      </MSettingsModal>
    </Box>
  );
}
