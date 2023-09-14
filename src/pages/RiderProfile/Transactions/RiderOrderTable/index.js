/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

import { useQuery } from 'react-query';
import TablePagination from '../../../../components/Common/TablePagination';
import TableSkeleton from '../../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../../context';
import * as API_URL from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import { getCurrencyValue } from '../../../AppWallet2/ForRider/Table';
import { convertDate } from '../../../AppWallet2/ForSeller/helpers';

export const getValueByCurrencyType = (baseCurrency, secondaryAmount, type, value) => {
  const currencyValue = type === 'baseCurrency' ? (value || 0).toFixed(2) : Math.round(value || 0);

  if (type === 'baseCurrency') {
    return `${baseCurrency} ${currencyValue}`;
  }

  return `${secondaryAmount} ${currencyValue}`;
};

export const queryParamsInit = {
  page: 1,
  pageSize: 10,
  sortBy: 'DESC',
  type: 'all',
  searchKey: '',
  paidCurrency: '',
};

function RiderOrderTable({ currencyType = 'secondaryCurrency', riderParams, loading }) {
  const { general } = useGlobalContext();
  const [queryParams, setQueryParams] = useState({
    ...queryParamsInit,
    ...riderParams,
    paidCurrency: currencyType === 'secondaryCurrency' ? 'secondaryCurrency' : 'baseCurrency',
  });
  const [totalPage, setTotalPage] = useState(1);
  const theme = useTheme();
  const baseCurrency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;
  const currency = currencyType !== 'secondaryCurrency' ? baseCurrency : secondaryCurrency;
  const routeMatch = useRouteMatch();
  const history = useHistory();

  const query = useQuery(
    [API_URL.GET_RIDER_ORDER_PROFIT_BREAKDOWN, { ...queryParams, ...riderParams }],
    () =>
      AXIOS.get(API_URL.GET_RIDER_ORDER_PROFIT_BREAKDOWN, {
        params: {
          ...queryParams,
          ...riderParams,
          startDate: convertDate(riderParams?.startDate),
          endDate: convertDate(riderParams?.endDate),
        },
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage || 1);
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  console.log('query', query?.data?.data?.orders);

  const allColumns = [
    {
      id: 3,
      field: 'orderId',
      headerName: `ORDER ID`,
      flex: 1,
      minWidth: 100,
      renderCell: ({ value }) => <Typography variant="body1">{value}</Typography>,
    },
    {
      id: 2,
      headerName: `TOTAL DELIVERY FEES (${secondaryCurrency})`,
      // headerName: <HeaderWithToolTips title="ORDERS" tooltip="Number of orders" />,
      field: 'order',
      flex: 1,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textTransform: 'capitalize' }}
            >
              {getValueByCurrencyType(
                baseCurrency,
                secondaryCurrency,
                currencyType,
                params?.row?.profitBreakdown?.totalDeliveryFee,
              )}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 3,
      field: 'delivery_fee',
      headerName: `LXYA DELIVERY CUT (${secondaryCurrency})`,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1" sx={{ color: 'danger.main' }}>
          {getValueByCurrencyType(
            baseCurrency,
            secondaryCurrency,
            currencyType,
            -params?.row?.profitBreakdown?.adminDeliveryProfit,
          )}
        </Typography>
      ),
    },
    {
      id: 4,
      field: 'lyxa_profit',
      headerName: `RIDER TIPS (${secondaryCurrency})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {getValueByCurrencyType(
            baseCurrency,
            secondaryCurrency,
            currencyType,
            params?.row?.profitBreakdown?.riderTips,
          )}
        </Typography>
      ),
    },

    {
      id: 6,
      field: 'cash_order',
      headerName: `RIDER PAYOUTS (${secondaryCurrency})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {getValueByCurrencyType(
            baseCurrency,
            secondaryCurrency,
            currencyType,
            params?.row?.profitBreakdown?.riderPayout,
          )}
        </Typography>
      ),
    },
    {
      id: 6,
      field: 'settled_cash',
      align: 'right',
      headerAlign: 'right',
      headerName: `CASH IN HAND`,

      sortable: false,
      flex: 1.3,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {
            getCurrencyValue(
              baseCurrency,
              secondaryCurrency,
              params?.row?.profitBreakdown?.cashInHand?.baseCurrency_CashInHand,
              params?.row?.profitBreakdown?.cashInHand?.secondaryCurrency_CashInHand,
            ).joinAmount
          }
        </Typography>
      ),
    },
  ];

  if (query?.isLoading) return <TableSkeleton columns={['text', 'text', 'text', 'text', 'text', 'text']} rows={5} />;
  return (
    <>
      <Box
        sx={{
          padding: '7.5px 16px  2px',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
        }}
      >
        <StyledTable
          columns={allColumns}
          rows={query?.data?.data?.orders || []}
          getRowId={(row) => row?._id}
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: 'pointer',
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {query?.isLoading ? 'Loading...' : 'No Order Found'}
              </Stack>
            ),
          }}
        />
      </Box>
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
    </>
  );
}

export default RiderOrderTable;
