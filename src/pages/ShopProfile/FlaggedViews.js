/* eslint-disable no-unused-vars */
import { Box, Drawer, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import OrderDetail from '../../components/Shared/OrderDetail';
import StyledTable from '../../components/Styled/StyledTable3';
// import TableDataPagination from './TableDataPagination';
// import TableDataPagination from '../../components/Shared/TableDataPagination';
// import TablePagination from '@mui/material';
import TablePagination from '../../components/Common/TablePagination';

export default function FlaggedViews({ filteredData, currentTab }) {
  const [rowPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrder, setCurrentOrder] = useState({});
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const columns = [
    {
      showFor: ['Flagged', 'Reviews'],
      id: 1,
      headerName: 'ORDER ID',
      field: 'orderId',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Typography
          variant="body4"
          sx={{ cursor: 'pointer', color: `${theme.palette.primary.main} !important` }}
          onClick={() => {
            if (currentTab === 0) {
              setCurrentOrder(row?.orderId);
              setOpen(true);
              return;
            }

            if (row?.order) {
              row.order.user = row.user;
              setCurrentOrder(row.order);
              setOpen(true);
            } else {
              console.error('Invalid order');
            }
          }}
        >
          {currentTab === 0 ? row?.orderId?.orderId : row?.order?.orderId}
        </Typography>
      ),
    },
    {
      showFor: ['Flagged', 'Reviews'],
      id: 2,
      headerName: 'COMMENT',
      field: 'comment',
      // align: currentTab === 0 ? 'right' : 'left',
      // headerAlign: currentTab === 0 ? 'right' : 'left',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          variant="body4"
          className="text-dots"
          color={!(row?.reviewDes || row?.comment) ? '#a7a7a7' : undefined}
        >
          {currentTab === 0 && (row?.comment || 'empty')}
          {currentTab === 1 && (row?.reviewDes || 'empty')}
        </Typography>
      ),
    },
    {
      showFor: ['Reviews'],
      id: 3,
      headerName: 'RATING',
      align: 'right',
      flex: 1,
      headerAlign: 'right',
      field: 'rating',
      sortable: false,
      renderCell: ({ value }) => (
        <Stack direction="row" alignItems="center" gap="2px" color={value > 2 ? 'success.main' : 'error.main'}>
          <StarIcon />
          <Typography variant="inherit">{value}</Typography>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          pr: 5,
          pl: 3.5,
          pt: 1,
          pb: 1,
          border: '1px solid #EEEEEE',
          borderRadius: '7px',
          background: '#fff',
          marginTop: '30px',
        }}
      >
        <StyledTable
          columns={columns.filter((column) => column.showFor.includes(`${currentTab === 0 ? 'Flagged' : 'Reviews'}`))}
          rows={filteredData
            .slice((currentPage - 1) * rowPerPage, (currentPage - 1) * rowPerPage + rowPerPage)
            .map((row) => row)}
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
                No {currentTab === 0 ? 'flagged' : 'reviews'} found
              </Stack>
            ),
          }}
        />
      </Box>
      <TablePagination
        currentPage={currentPage}
        lisener={(page) => {
          setCurrentPage(page);
        }}
        totalPage={Math.ceil(filteredData.length / 5)}
      />
      <Drawer open={open} anchor="right">
        <OrderDetail
          order={currentOrder}
          hideIssues
          onClose={() => {
            setOpen(false);
            setCurrentOrder({});
          }}
        />
      </Drawer>
    </>
  );
}
