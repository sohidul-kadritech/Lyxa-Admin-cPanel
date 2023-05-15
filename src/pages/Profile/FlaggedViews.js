import { Box, Drawer, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import StyledTable from '../../components/Styled/StyledTable3';
import OrderDetail from './OrderDetail';
import TableDataPagination from './TableDataPagination';

function FlaggedViews({ filteredData, currentTab }) {
  const [rowPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(1);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const columns = [
    {
      showFor: ['Flagged', 'Reviews'],
      id: 0,
      headerName: 'ORDER ID',
      field: 'orderId',
      sortable: false,
      minWidth: 270,
      renderCell: ({ value }) => (
        <Typography
          sx={{ cursor: 'pointer', color: `${theme.palette.primary.main} !important` }}
          onClick={() => {
            setCurrentOrderDetails(value);
            setOpen(true);
          }}
        >
          #{value?.orderId}
        </Typography>
      ),
    },
    {
      showFor: ['Flagged', 'Reviews'],
      id: 1,
      headerName: 'COMMENT',
      field: 'comment',
      sortable: false,
      minWidth: 270,
      renderCell: ({ value }) => <Typography>{value || value?.reviewDes}</Typography>,
    },
    {
      showFor: ['Reviews'],
      id: 1,
      headerName: 'RATING',
      field: 'rating',
      sortable: false,
      minWidth: 270,
      renderCell: ({ value }) => (
        <Typography>
          <StarIcon />
          {value}
        </Typography>
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
      <TableDataPagination
        currentPage={currentPage}
        lisener={(page) => {
          setCurrentPage(page);
        }}
        totalPage={Math.ceil(filteredData.length / 5)}
      />

      <Drawer open={open} anchor="right">
        <OrderDetail order={currentOrderDetails} onClose={() => setOpen(false)} />
      </Drawer>
    </>
  );
}

export default FlaggedViews;
