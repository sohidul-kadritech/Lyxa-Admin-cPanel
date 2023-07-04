import { Box, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import Rating from '../../../components/Common/Rating';
import TableDateTime from '../../../components/Common/TableDateTime';
import OrderDetail from '../../../components/Shared/OrderDetail';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';

export default function CustomerRating({ rows = [], loading }) {
  const history = useHistory();
  const [currentOrder, setCurrentOrder] = useState({});
  const [open, setOpen] = useState(false);
  const routeMatch = useRouteMatch();
  const columns = [
    {
      id: 1,
      headerName: 'RATING',
      field: 'rating',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Rating amount={value} />,
    },
    {
      id: 2,
      headerName: 'ACCOUNT',
      field: 'user',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography
          variant="body4"
          sx={{ color: 'primary.main', cursor: 'pointer' }}
          onClick={() => {
            history.push(`/accounts/${value?._id}`);
          }}
        >
          {value?.name}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'SHOP',
      field: 'shop',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          variant="body4"
          sx={{ color: 'primary.main', cursor: 'pointer' }}
          onClick={() => {
            history.push({
              pathname: `/shop/profile/${row?.order?.shop?._id}`,
              state: { from: routeMatch?.path, backToLabel: 'Back to Customer Rating' },
            });
          }}
        >
          {row?.order?.shop?.shopName}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: 'ORDER ID',
      field: 'orderId',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          variant="body4"
          sx={{ color: 'primary.main', cursor: 'pointer' }}
          onClick={() => {
            setCurrentOrder(row?.order);
            setOpen(true);
          }}
        >
          {row?.order?.orderId}
        </Typography>
      ),
    },
    {
      id: 5,
      headerName: 'AMOUNT',
      field: 'amount',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => <Typography variant="body4">{row?.order?.summary?.totalAmount}</Typography>,
    },
    {
      id: 6,
      headerName: 'PAYMENT TYPE',
      field: 'paymentMethod',
      flex: 1,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography variant="body4" textTransform="capitalize">
          {row?.order?.paymentMethod}
        </Typography>
      ),
    },
    {
      id: 7,
      headerName: `DATE`,
      sortable: false,
      field: 'createdAt',
      flex: 1,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
  ];

  if (loading) return <TableSkeleton rows={5} columns={['text', 'text', 'text', 'text', 'text', 'text', 'text']} />;

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
        }}
      >
        <StyledTable
          columns={columns}
          rows={rows}
          getRowId={(row) => row?._id}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Flags found
              </Stack>
            ),
          }}
        />
      </Box>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <OrderDetail order={currentOrder} onClose={() => setOpen(false)} />
      </Drawer>
    </>
  );
}
