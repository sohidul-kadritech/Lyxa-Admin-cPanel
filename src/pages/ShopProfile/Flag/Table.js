/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import StyledTable from '../../../components/Styled/StyledTable3';
import TablePageSkeleton from '../../Notification2/TablePageSkeleton';

export const getFlaggedItems = (type) => {
  if (type === 'missing-item') return 'Missing item';
  if (type === 'wrong-item') return 'Wrong item';

  return 'unknown';
};

export default function FlagTable({ flags, onViewDetail, showFor, loading = true }) {
  const columns = [
    {
      id: 1,
      showFor: ['Reviews', 'Flagged'],
      headerName: 'ORDER ID',
      field: 'orderId',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Typography
          variant="body4"
          sx={{ cursor: 'pointer', color: `primary.main` }}
          onClick={() => {
            onViewDetail(row?.orderId || {});
          }}
        >
          {row?.orderId?.orderId}
        </Typography>
      ),
    },
    {
      id: 1,
      showFor: ['Reviews', 'Flagged'],
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
    {
      showFor: ['Reviews'],
      id: 2,
      headerName: 'COMMENT',
      field: 'comment',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-dots" color={!row?.comment ? '#a7a7a7' : undefined}>
          {row?.comment || 'empty'}
        </Typography>
      ),
    },
    {
      showFor: ['Flagged'],
      id: 2,
      headerName: 'FLAGGED REASON',
      field: 'flaggedReason',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-dots" color={!row?.flaggedReason ? '#a7a7a7' : undefined}>
          {row?.otherReason ? row?.otherReason : getFlaggedItems(row?.flaggedReason) || 'empty'}
        </Typography>
      ),
    },
  ];

  if (loading) {
    return <TablePageSkeleton row={5} column={3} />;
  }

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
        columns={columns.filter((item) => item?.showFor?.includes(showFor))}
        rows={flags}
        getRowId={(row) => row?._id}
        rowHeight={71}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'default',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No flags found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
