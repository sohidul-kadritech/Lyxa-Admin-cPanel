// project import
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import StyledTable from '../../../components/Styled/StyledTable3';

export const getTrxType = (type) => {
  let newType = '';
  if (type === 'adminSettlebalanceShop') {
    newType = 'Settle shop';
  } else if (type === 'adminAddBalanceShop') {
    newType = 'Add shop credit';
  } else if (type === 'sellerCashInHandAdjust') {
    newType = 'Adjust hand cash';
  } else if (type === 'adminRemoveBalanceShop') {
    newType = 'Remove shop credit';
  } else if (type === 'deliveryBoyAmountSettle') {
    newType = 'Settle Rider';
  } else if (type === 'deliveryBoyAdminAmountReceivedCash') {
    newType = 'Received rider cash';
  } else if (type === 'deliveryBoyOrderDeliveredCash') {
    newType = 'Order Delivered Cash';
  } else {
    newType = 'Unknown';
  }

  return newType;
};

export default function TransactionsTable({ rows = [], onRowClick }) {
  const columns = [
    {
      id: 1,
      headerName: 'TRANSACTION ID',
      field: 'autoGenId',
      flex: 1,
      sortable: false,
      minWidth: 270,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 2,
      headerName: 'AMOUNT',
      field: 'amount',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 3,
      headerName: 'TYPE',
      field: 'type',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{getTrxType(value)}</Typography>,
    },
    {
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
      id: 5,
      headerName: 'ADMIN',
      field: 'adminBy',
      flex: 0.7,
      minWidth: 100,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value?.name}</Typography>,
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
      <StyledTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row?._id}
        rowHeight={71}
        onRowClick={onRowClick}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No transactions found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
