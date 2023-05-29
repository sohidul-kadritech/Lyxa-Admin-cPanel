// project import
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import StyledTable from '../../../components/Styled/StyledTable3';

export default function FlagsTable({ rows = [], onRowClick }) {
  const columns = [
    {
      id: 1,
      headerName: 'COMMENT',
      field: 'comment',
      flex: 2,
      sortable: false,
      minWidth: 270,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 2,
      headerName: 'ORDER ID',
      field: 'orderId',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value?.orderId}</Typography>,
    },
    {
      id: 3,
      headerName: `DATE`,
      sortable: false,
      field: 'createdAt',
      flex: 1,
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
              No Flags found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
