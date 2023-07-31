/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import StyledTable from '../../../components/Styled/StyledTable3';

export default function FlagTable({ flags, onViewDetail }) {
  const columns = [
    {
      id: 1,
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
      showFor: ['Flagged', 'Reviews'],
      id: 2,
      headerName: 'COMMENT',
      field: 'comment',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-dots" color={!row?.comment ? '#a7a7a7' : undefined}>
          {row?.comment || 'empty'}
        </Typography>
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
