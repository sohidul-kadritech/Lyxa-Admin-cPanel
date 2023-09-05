/* eslint-disable prettier/prettier */
import { Box, Stack } from '@mui/material';
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
  const columns = [
    {
      id: 1,
      type: ['order'],
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
            // onClick: () => {
            //   history.push({
            //     pathname: `/shop/profile/${row?.shop?._id}`,
            //     state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
            //   });
            // },
          }}
        />
      ),
    },
    {
      id: 1,
      type: ['delivery'],
      headerName: `RIDERS`,
      sortable: false,
      field: 'shopName',
      flex: 1,

      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => (
        <UserAvatar
          imgAlt="shop-image"
          imgUrl="https://storage.googleapis.com/dropnode/download-lyxa-07062394509-72.png"
          imgFallbackCharacter={value?.charAt(0)}
          name={value}
          subTitle="#5465465"
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            // onClick: () => {
            //   history.push({
            //     pathname: `/shop/profile/${row?.shop?._id}`,
            //     state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
            //   });
            // },
          }}
        />
      ),
    },
    {
      id: 2,
      type: ['delivery'],
      headerName: `ORDER DELIVERY AMOUNT`,
      sortable: false,
      field: 'orderAmount',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.financialBreakdown;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={financialBreakdown?.baseCurrency_orderAmount}
                  valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                showIfZero
                label="Cash"
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_cash}
                value={financialBreakdown?.baseCurrency_orderAmount_cash}
              />
              <SummaryItem
                label="Online"
                currencyType={currencyType}
                showIfZero
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_online}
                value={financialBreakdown?.baseCurrency_orderAmount_online}
              />
              {/* <SummaryItem
                label="Discount"
                currencyType={currencyType}
                showIfZero
                isNegative
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_discount}
                value={financialBreakdown?.baseCurrency_orderAmount_discount}
              />
              <SummaryItem
                label="Buy 1 Get 1"
                showIfZero
                isNegative
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_buy1Get1}
                value={financialBreakdown?.baseCurrency_orderAmount_buy1Get1}
              />
              <SummaryItem
                label="Loyalty points"
                isNegative
                showIfZero
                currencyType={currencyType}
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_loyaltyPoints}
                value={financialBreakdown?.baseCurrency_orderAmount_loyaltyPoints}
              /> */}
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
      headerName: `TOTAL PAYOUTS`,
      sortable: false,
      field: 'totalPayouts',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => {
        const financialBreakdown = row?.profitBreakdown;
        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              hideIcon={financialBreakdown?.payout?.totalPayout === 0}
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={Math.abs(financialBreakdown?.payout?.totalPayout)}
                  valueSecondary={Math.abs(financialBreakdown?.payout?.totalPayout)}
                  isNegative={financialBreakdown?.payout?.totalPayout > 0}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                label="Free delivery by shop"
                value={financialBreakdown?.payout?.freeDeliveryByShop}
                valueSecondary={financialBreakdown?.payout?.freeDeliveryByShop}
                isNegative
              />
              <SummaryItem
                currencyType={currencyType}
                label="Shop customer refund"
                value={financialBreakdown?.payout?.shopCustomerRefund}
                valueSecondary={financialBreakdown?.payout?.shopCustomerRefund}
                isNegative
              />
              <SummaryItem
                currencyType={currencyType}
                label="Shop point cashback"
                value={financialBreakdown?.payout?.pointsCashback}
                valueSecondary={financialBreakdown?.payout?.pointsCashback}
                isNegative
              />
              <SummaryItem
                currencyType={currencyType}
                label="Payout"
                value={financialBreakdown?.payout?.payout}
                valueSecondary={financialBreakdown?.payout?.payout}
                isNegative
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 3,
      type: ['delivery'],
      headerName: `RIDERS PAYOUTS`,
      sortable: false,
      field: 'shopCut',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={Math.abs(row?.financialBreakdown?.baseCurrency_lyxaFees)}
          valueSecondary={Math.abs(row?.financialBreakdown?.secondaryCurrency_lyxaFees)}
          isNegative
          showIfZero
        />
      ),
    },
    {
      id: 4,
      type: ['delivery'],
      headerName: `DELIVERY PROFIT`,
      sortable: false,
      field: 'totalVat',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const financialBreakdown = row?.financialBreakdown;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={financialBreakdown?.baseCurrency_orderAmount}
                  valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount}
                  showIfZero
                />
              }
            >
              <SummaryItem
                currencyType={currencyType}
                showIfZero
                label="Cash"
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_cash}
                value={financialBreakdown?.baseCurrency_orderAmount_cash}
              />
              <SummaryItem
                label="Online"
                currencyType={currencyType}
                showIfZero
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_online}
                value={financialBreakdown?.baseCurrency_orderAmount_online}
              />
              <SummaryItem
                label="Rider Cut"
                currencyType={currencyType}
                showIfZero
                isNegative
                valueSecondary={financialBreakdown?.secondaryCurrency_orderAmount_discount}
                value={financialBreakdown?.baseCurrency_orderAmount_discount}
              />
            </TableAccordion>
          </Box>
        );
      },
    },
    {
      id: 5,
      type: ['order'],
      headerName: `TOTAL FEATURED AMOUNT`,
      sortable: false,
      field: 'featured',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <SummaryItem
          title
          pb={0}
          currencyType={currencyType}
          value={row?.profitBreakdown?.featuredAmont}
          valueSecondary={row?.profitBreakdown?.featuredAmont}
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
      flex: 1.3,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const otherPayments = row?.profitBreakdown?.otherPayments;

        return (
          <Box position="relative" sx={{ width: '100%', height: '100%' }}>
            <TableAccordion
              hideIcon={otherPayments?.totalOtherPayments === 0}
              titleComponent={
                <SummaryItem
                  title
                  pb={0}
                  currencyType={currencyType}
                  value={otherPayments?.totalOtherPayments}
                  valueSecondary={otherPayments?.totalOtherPayments}
                  isNegative
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
                label="Customer refund"
                currencyType={currencyType}
                isNegative
                value={otherPayments?.customerRefund}
                valueSecondary={otherPayments?.customerRefund}
              />

              <SummaryItem
                label="Free delivery by shop (Lyxa riders)"
                currencyType={currencyType}
                isNegative
                value={otherPayments?.freeDeliveryByShop}
                valueSecondary={otherPayments?.freeDeliveryByShop}
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
      headerName: `TOTAL LYXA DELIVERY PROFIT`,
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
          value={row?.financialBreakdown?.baseCurrency_totalProfit}
          valueSecondary={row?.financialBreakdown?.secondaryCurrency_totalProfit}
          showIfZero
        />
      ),
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
    </>
  );
}
