/* eslint-disable consistent-return */
// third party
import { Box, Chip, Stack, Typography } from '@mui/material';

import TableLoader from './Common/TableLoader';

import StyledTable from './StyledTable';

// get flag types
const getFlagTypes = (flag) => {
  if (flag?.isAutomatic) {
    return 'Auto';
  }

  if (flag?.isRefused) {
    return 'Refused';
  }

  if (flag?.user) {
    return 'User';
  }

  if (flag?.delivery) {
    return 'Rider';
  }

  if (flag?.shop) {
    return 'Shop';
  }

  return '';
};

export default function FlaggedOrdersTable({ flagsList, flagsLoading, ...props }) {
  // columns,
  const columns = [
    {
      id: 1,
      headerName: 'Comment',
      field: 'comment',
      flex: 4,
      disableColumnFilter: true,
      sortable: false,
      renderCell: (params) => (
        <Stack width="100%" spacing={2}>
          <Typography variant="body1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            {params?.value}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'Created At',
      field: 'createdAt',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Stack width="100%" spacing={2} alignItems="center">
          <Typography variant="body1">{new Date(value).toLocaleDateString()}</Typography>
          <Typography variant="body3">{new Date(value).toLocaleTimeString()}</Typography>
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: 'Type',
      field: 'status',
      sortable: false,
      flex: 2,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Chip
          sx={{
            background: 'rgb(63,63,63)',
            color: '#fff',
            '&:hover': {
              background: 'rgb(78,78,78)',
            },
          }}
          label={getFlagTypes(row, 'order')}
          variant="contained"
        />
      ),
    },
    {
      id: 4,
      headerName: 'Resolved',
      field: 'isResolved',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip
          label={value ? 'True' : 'False'}
          sx={value ? { background: '#e1f4d0', color: '#56ca00' } : { background: '#ffcfce', color: '#ff0000' }}
          variant="contained"
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <StyledTable
        columns={columns}
        rows={flagsList}
        getRowId={(params) => params?._id}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'pointer',
          },
        }}
        rowHeight={60}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {flagsLoading ? '' : 'No Flags found'}
            </Stack>
          ),
        }}
        {...props}
      />
      {/* loading */}
      {flagsLoading ? <TableLoader /> : null}
    </Box>
  );
}
