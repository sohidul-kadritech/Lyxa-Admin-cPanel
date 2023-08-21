/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import StyledTabs2 from '../../Styled/StyledTab2';
import StyledTable from '../../Styled/StyledTable3';
import StyledBox from '../../StyledCharts/StyledBox';

export const typeOptions = [
  { label: 'Base', value: 'baseCurrency' },
  { label: 'Secondary', value: 'secondaryCurrency' },
];

const queryParamsInit = (props) => ({
  page: 1,
  pageSize: 20,
  sortBy: 'DESC',
  startDate: moment().startOf('month').format('YYYY/MM/DD'),
  endDate: moment().format('YYYY/MM/DD'),
  orderType: 'all',
  model: 'order',
  paidCurrency: 'baseCurrency',
  ...props,
});

export default function PayoutDetailsTable() {
  const { currentUser, general } = useGlobalContext();
  const { shop } = currentUser;

  const [queryParams, setQueryParams] = useState(queryParamsInit({ shop: shop?._id }));

  const baseCurrency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.symbol;
  const currency = queryParams?.paidCurrency === 'baseCurrency' ? baseCurrency : secondaryCurrency;
  const isBase = queryParams?.paidCurrency === 'baseCurrency';

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
      id: 1,
      headerName: `ORDER AMOUNT`,
      sortable: false,
      field: 'orderAmount',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency}{' '}
          {isBase
            ? `${
                row?.summary?.baseCurrency_totalAmount +
                row?.summary?.baseCurrency_vat +
                row?.summary?.baseCurrency_riderTip -
                row?.summary?.baseCurrency_discount -
                row?.summary?.reward?.baseCurrency_amount -
                row?.summary?.baseCurrency_couponDiscountAmount
              }`
            : `${
                row?.summary?.secondaryCurrency_totalAmount +
                row?.summary?.secondaryCurrency_vat +
                row?.summary?.secondaryCurrency_riderTip -
                row?.summary?.secondaryCurrency_discount -
                row?.summary?.reward?.secondaryCurrency_amount -
                row?.summary?.secondaryCurrency_couponDiscountAmount
              }`}
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: `LYXA FEES`,
      sortable: false,
      field: 'lyxaFess',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency}{' '}
          {isBase
            ? `${row?.adminCharge?.baseCurrency_adminChargeFromOrder}`
            : `${row?.adminCharge?.secondaryCurrency_adminChargeFromOrder}`}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: `TOTAL VAT`,
      sortable: false,
      field: 'totalVat',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency}{' '}
          {isBase ? `${row?.vatAmount?.baseCurrency_vatForShop}` : `${row?.vatAmount?.secondaryCurrency_vatForShop}`}
        </Typography>
      ),
    },
    {
      id: 5,
      headerName: `OTHER PAYMENTS`,
      sortable: false,
      field: 'otherPayments',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: () => (
        <Typography variant="body4">
          {currency} {0}
        </Typography>
      ),
    },
    {
      id: 6,
      headerName: `TOTAL PROFIT`,
      sortable: false,
      field: 'totalProfit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency}{' '}
          {isBase
            ? `${row?.baseCurrency_shopEarnings - row?.vatAmount?.baseCurrency_vatForShop}`
            : `${row?.secondaryCurrency_shopEarnings - row?.vatAmount?.secondaryCurrency_vatForShop}`}
        </Typography>
      ),
    },
  ];

  const query = useQuery([Api.ORDER_LIST, queryParams], () =>
    AXIOS.get(Api.ORDER_LIST, {
      params: queryParams,
    })
  );

  return (
    <Box>
      <StyledTabs2
        options={typeOptions}
        value={queryParams?.paidCurrency}
        onChange={(value) => {
          setQueryParams((prev) => ({ ...prev, paidCurrency: value }));
        }}
      />
      <StyledBox
        padding
        sx={{
          marginTop: '20px',
          paddingTop: '3px',
          paddingBottom: '10px',
          overflowX: 'auto',
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
            rows={query?.data?.data?.orders || []}
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
    </Box>
  );
}
