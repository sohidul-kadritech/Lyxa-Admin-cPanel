/* eslint-disable prettier/prettier */
import { Box, Stack } from '@mui/material';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import SummaryItem from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable/SummaryItem';
import { getCurrencyValue } from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable/Table';
import TableAccordion from '../../../components/Shared/FinancialsOverview/PayoutDetailsTable/TableAccordion';
import { CommonOrderMarketingCashbackTooltipText } from '../../../components/Shared/FinancialsOverview/helpers';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../context';

export default function Table({ currencyType, loading, rows = [], page, setPage, totalPage, type = 'order' }) {
  const { general } = useGlobalContext();
  const appSetting = general?.appSetting;
  const baseCurrency = appSetting?.baseCurrency;
  const secondaryCurrency = appSetting?.secondaryCurrency;
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const columns = [
    {
      id: 1,
      type: ['order', 'delivery'],
      headerName: `SHOP`,
      sortable: false,
      field: 'shopName',
      flex: 1,

      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="shop-image"
          imgUrl={row?.shopLogo}
          imgFallbackCharacter={row?.shopName?.charAt(0)}
          name={row?.shopName}
          subTitle={row?.autoGenId}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push({
                pathname: `/shop/profile/${row?._id}`,
                state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
              });
            },
          }}
        />
      ),
    },
    {
      id: 2,
      type: ['delivery'],
      headerName: `TOTAL DELIVERY FEE`,
      sortable: false,
      field: 'orderAmount',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              hideIcon={financialBreakdown?.totalDeliveryFee === 0}
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={financialBreakdown?.totalDeliveryFee}
                  valueSecondary={financialBreakdown?.totalDeliveryFee}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Delivery Fees"
                valueSecondary={financialBreakdown?.users}
                value={financialBreakdown?.users}
              />
              <SummaryItem
                label="Free Delivery By shop"
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.freeDeliveryByShop}
                value={financialBreakdown?.freeDeliveryByShop}
              />
              <SummaryItem
                label="Free Delivery By Lyxa"
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.freeDeliveryByAdmin}
                value={financialBreakdown?.freeDeliveryByAdmin}
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 3,
      type: ['order'],
      headerName: `ORDER AMOUNT`,
      sortable: false,
      field: 'orderAmount',
      flex: 1.5,
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
      type: ['order'],
      headerName: `SHOP PAYOUTS`,
      sortable: false,
      field: 'totalPayouts',
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
            value={Math.abs(financialBreakdown?.payout?.totalPayout)}
            valueSecondary={Math.abs(financialBreakdown?.payout?.totalPayout)}
            isNegative={financialBreakdown?.payout?.totalPayout > 0}
            showIfZero
          />
        );
      },
    },
    {
      id: 3,
      type: ['delivery'],
      headerName: `RIDERS CUTS`,
      sortable: false,
      field: 'shopCut',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={Math.abs(row?.profitBreakdown?.riderPayout)}
          valueSecondary={Math.abs(row?.profitBreakdown?.riderPayout)}
          isNegative
          showIfZero
        />
      ),
    },

    {
      id: 6,
      type: ['order'],
      headerName: `OTHER PAYMENTS`,
      sortable: false,
      field: 'otherPayments',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const otherPayments = row?.profitBreakdown?.otherPayments;
        console.log('otherPayments?.shopCustomerRefund', otherPayments);

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              hideIcon={otherPayments?.totalOtherPayments === 0}
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={
                    otherPayments?.totalOtherPayments < 0
                      ? Math.abs(otherPayments?.totalOtherPayments)
                      : otherPayments?.totalOtherPayments
                  }
                  valueSecondary={
                    otherPayments?.totalOtherPayments < 0
                      ? Math.abs(otherPayments?.totalOtherPayments)
                      : otherPayments?.totalOtherPayments
                  }
                  isNegative={otherPayments?.totalOtherPayments >= 0}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Lyxa Marketing cashback"
                value={otherPayments?.adminMarketingCashback}
                valueSecondary={otherPayments?.adminMarketingCashback}
                isNegative
              />

              <SummaryItem
                label="Error Charge (Endure loss) by lyxa"
                currencyType={currencyType}
                isNegative
                value={otherPayments?.errorCharge}
                valueSecondary={otherPayments?.errorCharge}
              />

              <SummaryItem
                label="Customer refund by Lyxa"
                currencyType={currencyType}
                isNegative
                value={otherPayments?.customerRefund}
                valueSecondary={otherPayments?.customerRefund}
              />
              <SummaryItem
                label="Customer refund by Shop"
                currencyType={currencyType}
                isNegative
                value={otherPayments?.shopCustomerRefund}
                valueSecondary={otherPayments?.shopCustomerRefund}
              />

              <SummaryItem
                label="Replacement orders by Lyxa"
                currencyType={currencyType}
                isNegative
                value={otherPayments?.replacementOrderByAdmin}
                valueSecondary={otherPayments?.replacementOrderByAdmin}
              />

              <SummaryItem
                label="Free delivery by shop (Lyxa riders)"
                currencyType={currencyType}
                isNegative
                value={otherPayments?.freeDeliveryByShop}
                valueSecondary={otherPayments?.freeDeliveryByShop}
              />

              <SummaryItem
                label="Shop VAT"
                currencyType={currencyType}
                value={otherPayments?.shopVat}
                valueSecondary={otherPayments?.shopVat}
              />
              <SummaryItem
                label="Shop self delivery"
                currencyType={currencyType}
                value={otherPayments?.shopDeliveryFee}
                valueSecondary={otherPayments?.shopDeliveryFee}
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 8,
      type: ['order'],
      headerName: `TOTAL PROFIT`,
      sortable: false,
      field: 'totalProfit',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={row?.profitBreakdown?.totalAdminProfit}
          valueSecondary={row?.profitBreakdown?.totalAdminProfit}
          showIfZero
        />
      ),
    },
    {
      id: 8,
      type: ['delivery'],
      headerName: `FREE DELIVERY BY LYXA`,
      sortable: false,
      field: 'freeDeliveryByLyxa',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={row?.profitBreakdown?.freeDeliveryByAdmin}
          valueSecondary={row?.profitBreakdown?.freeDeliveryByAdmin}
          isNegative
          showIfZero
        />
      ),
    },

    {
      id: 8,
      type: ['delivery'],
      headerName: `Delivery Refund`,
      sortable: false,
      field: 'deliveryRefund',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={row?.profitBreakdown?.deliveryRefund}
          valueSecondary={row?.profitBreakdown?.deliveryRefund}
          isNegative
          showIfZero
        />
      ),
    },
    {
      id: 8,
      type: ['delivery'],
      headerName: `LYXA DELIVERY PROFIT`,
      sortable: false,
      field: 'totalProfit',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={row?.profitBreakdown?.adminDeliveryProfit}
          valueSecondary={row?.profitBreakdown?.adminDeliveryProfit}
          showIfZero
        />
      ),
    },
  ];

  if (loading) return <TableSkeleton columns={['avatar', 'text', 'text', 'text', 'text', 'text']} rows={5} />;

  return (
    <Box sx={{ marginBottom: '60px' }}>
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
            columns={columns.filter((col) => col.type.includes(type))}
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
    </Box>
  );
}
