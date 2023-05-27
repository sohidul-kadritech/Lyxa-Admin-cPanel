// project import
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import StyledTable from '../../../components/Styled/StyledTable3';

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
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      headerName: `DATE`,
      sortable: false,
      field: 'createdAt',
      flex: 2,
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
      field: 'admin',
      flex: 0.7,
      minWidth: 100,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
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
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Order found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
