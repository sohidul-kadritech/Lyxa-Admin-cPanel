import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import StyledTable from '../../components/Styled/StyledTable3';

function VatList({ data = [], getCurrentCurrency, loading = false }) {
  const allColumns = [
    {
      id: 1,
      headerName: `TRX ID`,
      field: 'shopName',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="h6"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                textTransform: 'capitalize',
              }}
            >
              {params?.row?.shop?.shopName}
            </Typography>
          </Box>
        </Stack>
      ),
    },

    {
      id: 3,
      field: 'price',
      headerName: `AMOUNT (${getCurrentCurrency?.code})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography variant="body1">
          {getCurrentCurrency?.symbol}
          {row?.price}
        </Typography>
      ),
    },

    {
      id: 4,
      field: 'createdAt',
      headerName: 'PAID BY',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Stack>
          <Typography variant="body1">{moment(row?.createdAt).format('MMMM DD, YYYY')}</Typography>
          {/* <Typography variant="body1">{new Date(row?.createdAt || undefined).toLocaleDateString()}</Typography> */}
          <Typography variant="body3">{moment(row?.createdAt).format('hh:mm A')}</Typography>
        </Stack>
      ),
    },

    {
      id: 4,
      field: 'updatedAt',
      headerName: 'CREATION DATE',
      sortable: true,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Stack>
          <Typography variant="body1">{moment(row?.updatedAt).format('MMMM DD, YYYY')}</Typography>
          <Typography variant="body3">{moment(row?.updatedAt).format('hh:mm A')}</Typography>
        </Stack>
      ),
    },
  ];
  return (
    <Box>
      <StyledTable
        columns={allColumns}
        rows={data}
        getRowHeight={() => 'auto'}
        getRowId={(row) => row?._id}
        //   onRowClick={({ row }) => {
        //     setCurrentRating(row);
        //     setIsEdit(true);
        //     setIsRightBarOpen(true);
        //   }}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'defualt',
          },
          //   '& .MuiDataGrid-row:hover': {
          //     backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
          //   },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {loading ? 'Loading' : 'No Products Found'}
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default VatList;
