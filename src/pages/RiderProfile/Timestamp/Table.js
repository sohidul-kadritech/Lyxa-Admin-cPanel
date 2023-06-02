// project import
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import StyledTable from '../../../components/Styled/StyledTable3';
import { calcActiveTime } from './helper';

export default function ActivityTable({ rows = [] }) {
  const columns = [
    {
      id: 1,
      headerName: 'ACTIVE TIME',
      field: 'activeTotal',
      flex: 2,
      sortable: false,
      minWidth: 270,
      renderCell: ({ row }) => <Typography variant="body4">{calcActiveTime(row?.activeTotal)}</Typography>,
    },
    {
      id: 2,
      headerName: 'TIME IN',
      field: 'timeIn',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack gap={1.5}>
          <Typography variant="body4">{moment(row?.timeIn).format('h:mm a')}</Typography>
          <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
            {moment(row?.timeIn).format('MMMM D, YYYY')}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: `TIME OUT`,
      sortable: false,
      field: 'timeOut',
      flex: 2,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Stack gap={1.5}>
          <Typography variant="body4">{moment(row?.timeOut).format('h:mm a')}</Typography>
          <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
            {moment(row?.timeOut).format('MMMM D, YYYY')}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 4,
      headerName: 'DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1,
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
