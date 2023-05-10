import { Box, Stack } from '@mui/material';
import React from 'react';
import StyledTable from '../../components/Styled/StyledTable3';
import Typography from '../../theme/@components/Typography';

function ReviewViews({ reviewData = [], reviewViews }) {
  const columns = [
    {
      showFor: ['flagged', 'reviews'],
      id: 1,
      headerName: 'ORDER ID',
      field: 'order_id',
      sortable: false,
      minWidth: 270,
      renderCell: ({ row }) => <Typography>{row}</Typography>,
    },
    {
      showFor: ['flagged', 'reviews'],
      id: 1,
      headerName: 'COMMENT',
      field: 'comment',
      sortable: false,
      minWidth: 270,
      renderCell: ({ row }) => <Typography>{row}</Typography>,
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
        columns={columns.filter((column) => column.showFor.includes(reviewViews))}
        rows={reviewData}
        getRowId={(row) => row?._id}
        rowHeight={71}
        // onRowClick={onRowClick}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Reviews found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default ReviewViews;
