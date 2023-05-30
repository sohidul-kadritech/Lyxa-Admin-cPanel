import { Edit } from '@mui/icons-material';
import { Avatar, Box, Chip, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import moment from 'moment';
import ConfirmModal from '../../components/Common/ConfirmModal';
import TableLoader from '../../components/Common/TableLoader';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import StyledTable from '../../components/Styled/StyledTable3';

function ProductList({ data = [], loading, getCurrentCurrency }) {
  const theme = useTheme();

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
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  color: theme.palette.primary?.main,
                  textTransform: 'capitalize',
                }}
              >
                {params?.row?.name}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  color: theme.palette.primary?.main,
                }}
              >
                {params?.row?.category?.name}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  color: theme.palette.primary?.main,
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
          {getCurrentCurrency?.symbol}
          {row?.price}
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
          {/* <Typography variant="body1">{new Date(row?.createdAt || undefined).toLocaleDateString()}</Typography> */}
          <Typography variant="body3">{moment(row?.createdAt).format('hh:mm A')}</Typography>
        </Stack>
      ),
    },

    {
      id: 4,
      field: 'updatedAt',
      headerName: 'EDITED ON',
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

    {
      id: 5,
      headerName: '',
      field: 'action',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: () => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {/* delete */}
          <StyledSwitch />
          <StyledIconButton
            color="primary"
            sx={{
              '&.Mui-disabled': {
                color: '#c1c1c1',
                backgroundColor: '#F3F6F9',
              },
            }}
            //   onClick={() => {
            //     setIsConfirm(true);
            //     setId(row._id);
            //   }}
          >
            <Edit />
          </StyledIconButton>
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
              {loading ? <TableLoader /> : 'No Products Found'}
            </Stack>
          ),
        }}
      />

      <ConfirmModal
        message="Are you sure you want to delete the products?"
        // isOpen={isConfirm}
        // loading={deleteQuery?.isLoading}
        blurClose
        // onCancel={() => {
        //   setIsConfirm(false);
        // }}
        onConfirm={() => {
          // callDeleteFaq();
          // setIsConfirm(false);
          //   console.log('id: ', id);
          //   deleteQuery.mutate({ id });
        }}
      />
    </Box>
  );
}

export default ProductList;
