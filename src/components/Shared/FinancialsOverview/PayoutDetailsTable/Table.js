/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import { isNumber } from 'lodash';
import { useGlobalContext } from '../../../../context';
import TablePagination from '../../../Common/TablePagination';
import TableSkeleton from '../../../Skeleton/TableSkeleton';
import StyledTable from '../../../Styled/StyledTable3';
import StyledBox from '../../../StyledCharts/StyledBox';
import { CommonOrderMarketingCashbackTooltipText } from '../helpers';
import SummaryItem from './SummaryItem';
import TableAccordion from './TableAccordion';

export const getCurrencyValue = (currencyType, value) => {
  const numberValue = isNumber(Number(value)) ? Number(value) : 0;

  if (currencyType === 'baseCurrency') {
    return (numberValue || 0).toFixed(2);
  }

  return Math.round(numberValue || 0);
};

export default function Table({ currencyType, loading, rows = [], page, setPage, totalPage }) {
  const { general } = useGlobalContext();
  const appSetting = general?.appSetting;
  const baseCurrency = appSetting?.baseCurrency;
  const secondaryCurrency = appSetting?.secondaryCurrency;

  console.log('rows', rows);

  const columns = [
    {
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
      id: 2,
      headerName: `ORDER AMOUNT`,
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
                        value: `${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.cash?.originalOrderAmount_cash)}`,
                      },
                      {
                        label: 'Discount',
                        value: `-${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.cash?.discount_cash)}`,
                      },

                      {
                        label: 'Buy 1 Get 1',
                        value: `-${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.cash?.buy1Get1_cash)}`,
                      },
                      {
                        label: 'Loyalty Points',
                        value: `-${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.cash?.loyaltyPoints_cash)}`,
                      },
                      {
                        label: 'Coupons',
                        value: `-${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.cash?.couponDiscount_cash)}`,
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
                        value: `${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.online?.originalOrderAmount_online)}`,
                      },
                      {
                        label: 'Discount',
                        value: `-${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.online?.discount_online)}`,
                      },

                      {
                        label: 'Buy 1 Get 1',
                        value: `-${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.online?.buy1Get1_online)}`,
                      },
                      {
                        label: 'Loyalty Points',
                        value: `-${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.online?.loyaltyPoints_online)}`,
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
                        value: `${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.AdminMarketingCashback?.discount_amc)}`,
                      },

                      {
                        label: 'Buy 1 Get 1',
                        value: `${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(currencyType, financialBreakdown?.AdminMarketingCashback?.buy1Get1_amc)}`,
                      },
                      {
                        label: 'Loyalty Points',
                        value: `${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(
                          currencyType,
                          financialBreakdown?.AdminMarketingCashback?.couponDiscount_amc,
                        )}`,
                      },
                      {
                        label: 'Coupons',
                        value: `${
                          currencyType === 'baseCurrency' ? baseCurrency?.symbol : secondaryCurrency?.code
                        } ${getCurrencyValue(
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
      id: 3,
      headerName: `LYXA FEES`,
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
      id: 4,
      headerName: `TOTAL VAT`,
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
      id: 5,
      headerName: `OTHER PAYMENTS`,
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
      id: 7,
      headerName: `DELIVERY FEE`,
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
      id: 7,
      headerName: `POINTS CASHBACK`,
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
      id: 8,
      headerName: `TOTAL PAYOUTS`,
      sortable: false,
      field: 'totalProfit',
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
          marginTop: '20px',
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
            columns={columns}
            getRowId={(row) => row?._id}
            sx={{
              '& .MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell': {
                overflow: 'visible',
              },

              '& .MuiDataGrid-virtualScroller': {
                overflow: 'visible !important',
              },

              '& .MuiDataGrid-main': {
                overflow: 'visible !important',
              },
            }}
            rows={rows}
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
