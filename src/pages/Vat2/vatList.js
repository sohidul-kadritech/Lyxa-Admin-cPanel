import { Box, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React from 'react';
import StyledTable from '../../components/Styled/StyledTable3';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';

function VatList({ data, getCurrentCurrency, loading }) {
  const theme = useTheme();
  const allColumns = [
    {
      id: 1,
      headerName: `TRX ID`,
      field: 'autogenId',
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
              {params?.row?.autoGenId}
            </Typography>
          </Box>
        </Stack>
      ),
    },

    {
      id: 3,
      field: 'amount',
      headerName: `AMOUNT (${getCurrentCurrency?.code})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography variant="body1">
          {getCurrentCurrency?.symbol}
          {row?.amount}
        </Typography>
      ),
    },

    {
      id: 4,
      field: 'name',
      headerName: 'PAID BY',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Stack>
          <Typography variant="body1">{row?.adminBy?.name}</Typography>
        </Stack>
      ),
    },

    {
      id: 4,
      field: 'updatedAt',
      headerName: 'CREATION DATE',
      sortable: false,
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
    <Box
      sx={{
        backgroundColor: theme?.palette?.primary?.contrastText,
        border: `1px solid ${theme?.palette?.custom?.border}`,
        borderRadius: '7px',
        padding: '10px 20px',
        marginTop: '30px',
      }}
    >
      {loading ? (
        <TablePageSkeleton row={3} column={4} />
      ) : (
        <StyledTable
          columns={allColumns}
          rows={data || []}
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
                No Transaction Found
              </Stack>
            ),
          }}
        />
      )}
    </Box>
  );
}

export default VatList;
