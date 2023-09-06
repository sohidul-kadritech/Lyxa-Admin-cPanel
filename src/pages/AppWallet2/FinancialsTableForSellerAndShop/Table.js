/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { isNumber } from 'lodash';
import { useMemo } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import TablePagination from '../../../components/Common/TablePagination';
import TableAccordion from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable/TableAccordion';
import { CommonOrderMarketingCashbackTooltipText } from '../../../components/Shared/FinancialsOverview/helpers';

import SummaryItem from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable/SummaryItem';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../context';

export const getCurrencyValue = (currencyType, value) => {
  const numberValue = isNumber(Number(value)) ? Number(value) : 0;

  if (currencyType === 'baseCurrency') {
    return (numberValue || 0).toFixed(2);
  }

  return Math.round(numberValue || 0);
};

// eslint-disable-next-line no-unused-vars
export default function Table({ currencyType, loading, rows = [], page, setPage, totalPage, showFor }) {
  const { general } = useGlobalContext();

  const appSetting = general?.appSetting;

  const baseCurrency = appSetting?.baseCurrency?.symbol;

  const secondaryCurrency = appSetting?.secondaryCurrency?.code;

  const currency = currencyType === 'baseCurrency' ? baseCurrency : secondaryCurrency;

  const { search } = useLocation();

  const history = useHistory();

  const routeMatch = useRouteMatch();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const theme = useTheme();

  const gotToShopTrxs = (id, name, showFor) => {
    if (showFor === 'seller') {
      history.push({
        pathname: `/app-wallet/shop-transactions`,
        search: `?shopId=${id}&shopName=${name}&sellerId=${searchParams.get('sellerId')}&companyName=${searchParams.get(
          'companyName',
        )}`,
      });

      return;
    }
    history.push({
      pathname: `/app-wallet/seller/shops-transactions`,
      search: `?sellerId=${id}&companyName=${name}`,
    });
  };

  const columns = [
    {
      showFor: ['allSeller'],
      id: 1,
      headerName: `SELLER NAME`,
      field: 'title',
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{
                color: theme.palette.primary.main,
                textTransform: 'capitalize',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                history?.push({
                  pathname: `/seller/list/${params?.row?._id}`,
                  state: { from: routeMatch?.path, backToLabel: 'Back to Seller Transactions' },
                });
              }}
            >
              {params?.row?.company_name}
            </Typography>
            <Typography
              variant="body3"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: '1.5' }}
            >
              {params?.row?.autoGenId}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      showFor: ['seller'],
      id: 1,
      headerName: `SHOP NAME`,
      field: 'title',
      flex: 1,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{
                color: theme.palette.primary.main,
                textTransform: 'capitalize',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                history?.push({
                  pathname: `/shop/profile/${params?.row?._id}`,
                  state: { from: routeMatch?.path, backToLabel: 'Back to Seller Transactions' },
                });
              }}
            >
              {params?.row?.shopName || 'Shop name'}
            </Typography>
            <Typography
              variant="body3"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: '1.5' }}
            >
              {params?.row?.autoGenId}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      showFor: ['shop'],
      id: 1,
      headerName: `ORDER ID`,
      sortable: false,
      field: 'orderId',
      flex: 1,

      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      showFor: ['seller', 'shop', 'allSeller'],
      id: 2,
      headerName: `ORDER AMOUNT (${currency})`,
      sortable: false,
      field: 'orderAmount',
      flex: 1.4,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              hideIcon={financialBreakdown?.orderAmount === 0}
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={financialBreakdown?.orderAmount}
                  valueSecondary={financialBreakdown?.orderAmount}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Cash"
                tooltipIconStyle={{ width: '14px', height: '14px', fontSize: '10px' }}
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    typoSx={{ fontSize: '10px' }}
                    containerSx={{ minWidth: '180px', padding: '0px 10px', margin: '0px 0px' }}
                    value={[
                      {
                        label: 'Original Order Amount',
                        value: `${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.cash?.originalOrderAmount_cash,
                        )}`,
                      },
                      {
                        label: 'Discount',
                        value: `-${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.cash?.discount_cash,
                        )}`,
                      },

                      {
                        label: 'Buy 1 Get 1',
                        value: `-${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.cash?.buy1Get1_cash,
                        )}`,
                      },
                      {
                        label: 'Loyalty Points',
                        value: `-${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.cash?.loyaltyPoints_cash,
                        )}`,
                      },
                      {
                        label: 'Coupons',
                        value: `-${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.cash?.couponDiscount_cash,
                        )}`,
                      },
                    ]}
                  />
                }
                valueSecondary={financialBreakdown?.cash?.totalCash}
                value={financialBreakdown?.cash?.totalCash}
              />
              <SummaryItem
                currencyType={currencyType}
                label="Online"
                tooltipIconStyle={{ width: '14px', height: '14px', fontSize: '10px' }}
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    typoSx={{ fontSize: '10px' }}
                    containerSx={{ minWidth: '180px', padding: '0px 10px', margin: '0px 0px' }}
                    value={[
                      {
                        label: 'Original Order Amount',
                        value: `${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.online?.originalOrderAmount_online,
                        )}`,
                      },
                      {
                        label: 'Discount',
                        value: `-${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.online?.discount_online,
                        )}`,
                      },

                      {
                        label: 'Buy 1 Get 1',
                        value: `-${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.online?.buy1Get1_online,
                        )}`,
                      },
                      {
                        label: 'Loyalty Points',
                        value: `-${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.online?.loyaltyPoints_online,
                        )}`,
                      },
                      {
                        label: 'Coupons',
                        value: `-${currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code} ${
                          financialBreakdown?.online?.couponDiscount_online
                        }`,
                      },
                    ]}
                  />
                }
                valueSecondary={financialBreakdown?.online?.totalOnline}
                value={financialBreakdown?.online?.totalOnline}
              />
              <SummaryItem
                currencyType={currencyType}
                label="Lyxa Marketing Cashback"
                tooltipIconStyle={{ width: '14px', height: '14px', fontSize: '10px' }}
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    title="Lyxa Marketing Cashback"
                    titleSx={{ padding: '0px 10px', marginBottom: '0', minWidth: '100px' }}
                    typoSx={{ fontSize: '10px' }}
                    containerSx={{ minWidth: '150px', padding: '0px 10px', margin: '0px 0px' }}
                    // listSx={{ listStyle: 'none' }}
                    value={[
                      {
                        label: 'Discount',
                        value: `${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.AdminMarketingCashback?.discount_amc,
                        )}`,
                      },

                      {
                        label: 'Buy 1 Get 1',
                        value: `${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.AdminMarketingCashback?.buy1Get1_amc,
                        )}`,
                      },
                      {
                        label: 'Loyalty Points',
                        value: `${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.AdminMarketingCashback?.couponDiscount_amc,
                        )}`,
                      },
                      {
                        label: 'Coupons',
                        value: `${currency} ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.AdminMarketingCashback?.couponDiscount_amc,
                        )}`,
                      },
                    ]}
                  />
                }
                valueSecondary={financialBreakdown?.AdminMarketingCashback?.adminMarketingCashback}
                value={financialBreakdown?.AdminMarketingCashback?.adminMarketingCashback}
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      showFor: ['seller', 'shop', 'allSeller'],
      id: 3,
      headerName: `LYXA FEES (${currency})`,
      sortable: false,
      field: 'lyxaFess',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={Math.abs(financialBreakdown?.adminFees)}
            valueSecondary={Math.abs(financialBreakdown?.adminFees)}
            isNegative={financialBreakdown?.adminFees > 0}
            showIfZero
          />
        );
      },
    },
    {
      showFor: ['seller', 'shop', 'allSeller'],
      id: 4,
      headerName: `TOTAL VAT (${currency})`,
      sortable: false,
      field: 'totalVat',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={financialBreakdown?.totalVat}
            valueSecondary={financialBreakdown?.totalVat}
            showIfZero
          />
        );
      },
    },
    {
      showFor: ['seller', 'shop', 'allSeller'],
      id: 5,
      headerName: `OTHER PAYMENTS (${currency})`,
      sortable: false,
      field: 'otherPayments',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              hideIcon={financialBreakdown?.otherPayments?.totalOtherPayments === 0}
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={Math.abs(financialBreakdown?.otherPayments?.totalOtherPayments)}
                  valueSecondary={Math.abs(financialBreakdown?.otherPayments?.totalOtherPayments)}
                  isNegative={financialBreakdown?.otherPayments?.totalOtherPayments > 0}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Promotion: Free delivery"
                value={financialBreakdown?.otherPayments?.freeDeliveryByShop}
                valueSecondary={financialBreakdown?.otherPayments?.freeDeliveryByShop}
                isNegative
              />

              <SummaryItem
                label="Refunded Amount"
                currencyType={currencyType}
                isNegative={financialBreakdown?.otherPayments?.customerRefund > 0}
                value={financialBreakdown?.otherPayments?.customerRefund}
                valueSecondary={Math.abs(financialBreakdown?.otherPayments?.customerRefund)}
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      showFor: ['seller', 'shop', 'allSeller'],
      id: 7,
      headerName: `DELIVERY FEE (${currency})`,
      sortable: false,
      field: 'deliveryFee',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;
        const deliveryFee = financialBreakdown?.deliveryFee;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              hideIcon={deliveryFee?.deliveryFee === 0}
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={deliveryFee?.deliveryFee}
                  valueSecondary={deliveryFee?.deliveryFee}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Cash"
                value={deliveryFee?.cash}
                valueSecondary={deliveryFee?.cash}
              />

              <SummaryItem
                label="Online"
                currencyType={currencyType}
                value={deliveryFee?.online}
                valueSecondary={deliveryFee?.online}
              />

              <SummaryItem
                label="Rider tip"
                currencyType={currencyType}
                value={deliveryFee?.riderTip_online}
                valueSecondary={deliveryFee?.riderTip_online}
                isRejected
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      showFor: ['seller', 'shop', 'allSeller'],
      id: 7,
      headerName: `POINTS CASHBACK (${currency})`,
      sortable: false,
      field: 'pointsCashback',
      flex: 1,
      align: 'left',
      headerAlign: 'left',

      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={financialBreakdown?.pointsCashback}
            valueSecondary={financialBreakdown?.pointsCashback}
            showIfZero
          />
        );
      },
    },
    {
      showFor: ['seller', 'shop', 'allSeller'],
      id: 8,
      headerName: `TOTAL PAYOUTS (${currency})`,
      sortable: false,
      field: 'totalProfit',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <SummaryItem
            title
            pb={0}
            currencyType={currencyType}
            value={financialBreakdown?.totalPayout}
            valueSecondary={financialBreakdown?.totalPayout}
            showIfZero
          />
        );
      },
    },
  ];

  if (loading) return <TableSkeleton columns={['text', 'text', 'text', 'text', 'text', 'text']} rows={5} />;

  return (
    <>
      <StyledBox
        padding
        sx={{
          marginTop: '30px',
          paddingTop: '3px',
          paddingBottom: '10px',
          overflow: 'visible',
          scrollbarWidth: 'thin',
          scrollbarHeight: 'thin',

          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
        }}
      >
        <Box
          sx={{
            minWidth: '1070px',
          }}
        >
          <StyledTable
            autoHeight
            columns={columns.filter((column) => column?.showFor?.includes(showFor))}
            getRowId={(row) => row?._id}
            sx={{
              cursor: 'pointer',

              '& .MuiDataGrid-columnHeaders': {
                position: 'sticky',
                top: '-2px',
                backgroundColor: theme?.palette?.primary?.contrastText,
                zIndex: theme.zIndex.mobileStepper - 1,
              },

              '& .MuiDataGrid-main': {
                overflow: 'visible !important',
              },

              '& .MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell': {
                overflow: 'visible',
              },

              '& .MuiDataGrid-virtualScroller': {
                overflow: 'visible !important',
                marginTop: '0 !important',
              },
            }}
            rows={rows}
            onRowClick={({ row }) => {
              if (showFor === 'seller') {
                gotToShopTrxs(row?._id, row?.shopName, showFor);
                return;
              }
              gotToShopTrxs(row?._id, row?.company_name, showFor);
            }}
            rowHeight={71}
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  No data found
                </Stack>
              ),
            }}
          />
        </Box>
      </StyledBox>
      <TablePagination currentPage={page} lisener={setPage} totalPage={totalPage} />
    </>
  );
}
