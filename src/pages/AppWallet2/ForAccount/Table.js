/* eslint-disable prettier/prettier */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
// eslint-disable-next-line import/no-named-as-default
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import TablePagination from '../../../components/Common/TablePagination';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';

// eslint-disable-next-line no-unused-vars
const getStyleForAmount = (value) => {
  if (value?.row?.type === 'userBalanceAddAdmin' || value?.row?.type === 'userCancelOrderGetWallet')
    return { color: 'green' };

  if (value?.row?.type === 'userBalanceWithdrawAdmin') return { color: 'red' };

  return null;
};

function AccountTable({ data = [], loading, currentPage, setCurrentPage, totalPage }) {
  const { general } = useGlobalContext();
  const appSettings = general?.appSetting;
  const { baseCurrency, secondaryCurrency } = appSettings;

  const currency = baseCurrency?.symbol;

  const getCurrency = (value, type) => {
    const currencyAmount = Number(value);
    const currency = {
      baseCurrency: {
        symbol: baseCurrency?.symbol,
        amount: (currencyAmount || 0).toFixed(2),
      },
      secondaryCurrency: {
        symbol: secondaryCurrency?.code,
        amount: Math.round(currencyAmount || 0),
      },
    };

    return currency[type];
  };

  const theme = useTheme();
  const routeMatch = useRouteMatch();
  const history = useHistory();

  const allColumns = [
    {
      id: 1,
      headerName: `ACCOUNT NAME`,
      field: 'name',
      sortable: false,
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
                  pathname: `/users/${params?.row?.user?._id}`,
                  state: { from: routeMatch?.path, backToLabel: 'Back to Lyxa Pay' },
                });
              }}
            >
              {params?.row?.user?.name}
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
      id: 4,
      field: 'amount',
      headerName: `AMOUNT`,
      sortable: false,
      flex: 1,
      minWidth: 100,

      renderCell: ({ row }) => {
        const sign =
          row?.type === 'userBalanceAddAdmin' || row?.type === 'userCancelOrderGetWallet'
            ? '+'
            : row?.type === 'userBalanceWithdrawAdmin'
            ? '-'
            : '';
        const value = getCurrency(
          row?.paidCurrency === 'baseCurrency' ? row?.amount : row?.secondaryCurrency_amount,
          row?.paidCurrency,
        );

        console.log('value==>', value);

        return (
          <Typography variant="body4">
            {sign} {value?.symbol} {value?.amount}
          </Typography>
        );
      },
    },
    {
      id: 5,
      field: 'email',
      headerName: `E-MAIL`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <Typography variant="body1">{params?.row?.user?.email || ''}</Typography>,
    },
    {
      id: 6,
      field: 'deposite',
      headerName: `DEPOSIT BY`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1">
          {params?.row?.type === 'userPayAfterReceivedOrderByCard' ? 'Card' : 'Lyxa'}
        </Typography>
      ),
    },
    {
      id: 6,
      field: 'date',
      headerName: `DATE`,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Stack gap={1.5}>
          <Typography variant="body4">{moment(row?.createdAt)?.format('MMM DD, YYYY')}</Typography>
          <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
            {moment(row?.createdAt)?.format('hh:mm A')}
          </Typography>
        </Stack>
      ),
    },
  ];
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
          rows={data}
          onRowClick={({ row }) => {
            history?.push({
              pathname: `/users/${row?.user?._id}`,
              search: 'financials=user',
              state: { from: routeMatch?.path, backToLabel: 'Back to Lyxa Pay' },
            });
          }}
          getRowId={(row) => row?._id}
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {loading ? 'Loading...' : 'No Transaction Found'}
              </Stack>
            ),
          }}
        />
      </Box>
      <TablePagination
        currentPage={currentPage}
        lisener={(page) => {
          setCurrentPage(page);
        }}
        totalPage={totalPage}
      />
    </>
  );
}

export default AccountTable;
