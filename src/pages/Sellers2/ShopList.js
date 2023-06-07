import { Edit } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import Rating from '../../components/Common/Rating';
import StyledTable from '../../components/Styled/StyledTable3';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
// eslint-disable-next-line no-unused-vars
const calculateTotal = (array) => {
  if (array.length > 0) return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return 0;
};

function ShopList({ data }) {
  const theme = useTheme();
  const allColumns = [
    {
      id: 1,
      headerName: `SHOP NAME`,
      field: 'shopName',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px" padding="16px 0px">
          <Stack flexDirection="row" alignItems="center" gap="20px">
            <Avatar src={params?.row?.shopLogo}></Avatar>
            <Stack>
              <Typography
                variant="h6"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  color: theme.palette.primary?.main,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {params?.row?.shopName}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `CUSTOMERS`,
      field: 'customers',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="h6"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {calculateTotal(params?.row?.repeatedCustomers?.length, params?.row?.repeatedCustomers?.length)}
        </Typography>
      ),
    },

    {
      id: 2,
      headerName: `ORDERS`,
      field: 'orders',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="h6"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {params?.row?.totalOrder}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: `RATING`,
      field: 'rating',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Rating
          amount={params?.row?.rating}
          titleSx={{
            fontSize: '15px',
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      id: 3,
      headerName: `ACTIONS`,
      headerAlign: 'right',
      align: 'right',
      field: 'action',
      sortable: false,
      flex: 1,
      renderCell: () => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {/* edit */}
          <StyledIconButton
            // onClick={() => {
            //   onEdit(params.row);
            // }}
            color="primary"
          >
            <Edit />
          </StyledIconButton>
          <StyledIconButton
            // onClick={() => {
            //   onEdit(params.row);
            // }}
            color="primary"
          >
            <VisibilityIcon />
          </StyledIconButton>
          {/* delete */}
        </Stack>
      ),
    },
  ];
  return (
    <Box
      sx={{
        padding: '20px',
        maxHeight: '500px',
        overflow: 'auto',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
      }}
    >
      <StyledTable
        columns={allColumns}
        rows={data || []}
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
              No Shop Found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default ShopList;
