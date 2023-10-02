import { Avatar, Box, Chip, Drawer, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
// eslint-disable-next-line import/no-named-as-default
import moment from 'moment';
// eslint-disable-next-line import/no-named-as-default
import StyledSwitch from '../../components/Styled/StyledSwitch';
import StyledTable from '../../components/Styled/StyledTable3';

import AddProduct from '../Menu/AddProduct';

function ProductList({ data = [], getCurrentCurrency, updateStatusQuery }) {
  const theme = useTheme();
  const [open, setOpen] = useState();
  const [currentSelectedProduct, setCurrentSelectedProduct] = useState({});

  const allColumns = [
    {
      id: 1,
      headerName: `PRODUCT NAME`,
      field: 'name',
      sortable: true,
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px" padding="16px 0px">
          <Stack flexDirection="row" alignItems="center" gap="20px">
            <Avatar src={params?.row?.images[0]}></Avatar>
            <Stack>
              <Typography
                variant="h6"
                onClick={() => {
                  setCurrentSelectedProduct(params?.row);
                  setOpen(true);
                }}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  color: theme.palette.primary?.main,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {params?.row?.name}
              </Typography>
              <Typography
                variant="body3"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                {params?.row?.category?.name}
              </Typography>
              <Typography
                variant="body3"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                {params?.row?.autoGenId}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `SHOP`,
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
                color: theme.palette.primary?.main,
                cursor: 'pointer',
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
      headerName: `PRICE (${getCurrentCurrency?.code})`,
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography variant="body1">
          {getCurrentCurrency?.symbol} {row?.price}
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: `Status`,
      flex: 1,
      renderCell: ({ row }) => (
        <Chip
          label={row?.status === 'active' ? 'Active' : 'Inactive'}
          sx={
            row?.status === 'active'
              ? { background: '#e1f4d0', color: '#56ca00' }
              : { background: '#ffcfce', color: '#ff0000' }
          }
          variant="contained"
        />
      ),
    },
    {
      id: 4,
      field: 'createdAt',
      headerName: 'CREATION DATE',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Stack>
          <Typography variant="body1">{moment(row?.createdAt).format('MMMM DD, YYYY')}</Typography>
          <Typography variant="body3">{moment(row?.createdAt).format('hh:mm A')}</Typography>
        </Stack>
      ),
    },
    {
      id: 5,
      headerName: '',
      field: 'action',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {/* delete */}
          <StyledSwitch
            checked={row?.status === 'active'}
            onClick={() => {
              updateStatusQuery.mutate({ id: row._id, status: row?.status === 'active' ? 'inactive' : 'active' });
            }}
          />
        </Stack>
      ),
    },
  ];

  return (
    <Box
      sx={{
        padding: '20px',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
      }}
    >
      <StyledTable
        columns={allColumns}
        rows={data}
        getRowHeight={() => 'auto'}
        getRowId={(row) => row?._id}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'defualt',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Products Found
            </Stack>
          ),
        }}
      />

      <Drawer open={open} anchor="right">
        <AddProduct
          productReadonly
          editProduct={currentSelectedProduct}
          onClose={() => {
            setOpen(false);
          }}
        />
      </Drawer>
    </Box>
  );
}

export default ProductList;
