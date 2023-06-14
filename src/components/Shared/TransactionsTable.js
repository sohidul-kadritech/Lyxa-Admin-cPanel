import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../Common/LoadingOverlay';
import StyledCheckbox from '../Styled/StyledCheckbox';
import StyledTable from '../Styled/StyledTable3';
//
export const getTrxType = (trxType) => {
  let typeLabel = 'Unknown';
  if (trxType === 'adminSettlebalanceShop') typeLabel = 'Settle shop';
  if (trxType === 'adminAddBalanceShop') typeLabel = 'Add shop credit';
  if (trxType === 'sellerCashInHandAdjust') typeLabel = 'Adjust hand cash';
  if (trxType === 'adminRemoveBalanceShop') typeLabel = 'Remove shop credit';
  if (trxType === 'deliveryBoyAmountSettle') typeLabel = 'Settle Rider';
  if (trxType === 'deliveryBoyAdminAmountReceivedCash') typeLabel = 'Received rider cash';
  if (trxType === 'deliveryBoyOrderDeliveredCash') typeLabel = 'Order Delivered Cash';
  if (trxType === 'userBalanceAddAdmin') typeLabel = 'Lyxa';
  if (trxType === 'userBalanceWithdrawAdmin') typeLabel = 'Lyxa';
  if (trxType === 'userPayAfterReceivedOrderByCard') typeLabel = 'Card';
  return typeLabel;
};

export default function TransactionsTable({ rows = [], type, loading, queryParams = {} }) {
  const [allSelected, setAllSelected] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (type === 'cashOrderList') {
      setAllSelected(false);
      rows?.forEach((row) => {
        row.selected = false;
      });
    }
  }, [queryParams]);

  const columns = [
    {
      type: ['transactions', 'cashOrderList', 'user-transactions'],
      id: 1,
      headerName: 'TRANSACTION ID',
      field: 'autoGenId',
      flex: 1,
      sortable: false,
      minWidth: 270,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      type: ['transactions', 'cashOrderList', 'user-transactions'],
      id: 2,
      headerName: 'AMOUNT',
      field: type === 'cashOrderList' ? 'receivedAmount' : 'amount',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ value, row }) => {
        if (type === 'user-transactions') {
          const sign =
            row?.type === 'userBalanceAddAdmin' || row?.type === 'userCancelOrderGetWallet'
              ? '+'
              : row?.type === 'userBalanceWithdrawAdmin'
              ? '-'
              : '';

          return (
            <Typography variant="body4">
              {sign}
              {value}
            </Typography>
          );
        }

        return <Typography variant="body4">{value}</Typography>;
      },
    },
    {
      type: ['transactions', 'cashOrderList', 'user-transactions'],
      id: 3,
      headerName: 'TYPE',
      field: 'type',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{getTrxType(value)}</Typography>,
    },
    {
      type: ['transactions', 'cashOrderList', 'user-transactions'],
      id: 4,
      headerName: `DATE`,
      sortable: false,
      field: 'createdAt',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Stack gap={1.5}>
          <Typography variant="body4">{moment(row?.createdAt)?.format('MMM DD, YYYY')}</Typography>
          <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
            {moment(row?.createdAt)?.format('hh:mm A')}
          </Typography>
        </Stack>
      ),
    },
    {
      type: ['transactions'],
      id: 5,
      headerName: 'ADMIN',
      field: 'adminBy',
      flex: 0.7,
      minWidth: 100,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value?.name}</Typography>,
    },
    {
      type: ['cashOrderList'],
      id: 6,
      renderHeader: () => (
        <Stack
          direction="row"
          alignItems="center"
          onClick={() => {
            if (allSelected) {
              rows?.forEach((row) => {
                row.selected = false;
              });
              setAllSelected(false);
            } else {
              rows?.forEach((row) => {
                row.selected = true;
              });
              setAllSelected(true);
            }
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Typography variant="inherit" fontSize="14px" lineHeight="17px" fontWeight={600} color="#737373">
            {allSelected ? 'UNSELECT' : 'SELECT'}
          </Typography>
          <StyledCheckbox
            checked={allSelected}
            sx={{
              '& .MuiSvgIcon-root': {
                color: '#9f9f9f!important',
              },
            }}
          />
        </Stack>
      ),
      field: 'selected',
      align: 'right',
      headerAlign: 'right',
      flex: 0.7,
      minWidth: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <StyledCheckbox
          checked={Boolean(row?.selected)}
          onChange={() => {
            row.selected = !row.selected;
            setRender(!render);
          }}
          sx={{
            '& .MuiSvgIcon-root': {
              color: '#9f9f9f!important',
            },
          }}
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        pr: 5,
        pl: 3.5,
        pt: 1,
        pb: 1,
        border: '1px solid #EEEEEE',
        borderRadius: '7px',
        background: '#fff',
      }}
    >
      {loading && <LoadingOverlay />}
      <StyledTable
        columns={columns.filter((col) => col.type.includes(type))}
        rows={rows}
        getRowId={(row) => row?._id}
        rowHeight={71}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No transactionss found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
