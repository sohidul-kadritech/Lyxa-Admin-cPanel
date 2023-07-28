// project import
import { Box, Drawer, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as DownIcon } from '../../../assets/icons/thumbs-down.svg';
import { ReactComponent as UpIcon } from '../../../assets/icons/thumbs-up.svg';
import OrderDetail from '../../../components/Shared/OrderDetail';
import StyledTable from '../../../components/Styled/StyledTable3';
import TablePageSkeleton from '../../Notification2/TablePageSkeleton';

export default function ShopRatingTable({ rows = [], loading }) {
  const history = useHistory();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const routeMatch = useRouteMatch();

  const columns = [
    {
      id: 1,
      headerName: 'RATING',
      field: 'shopRateToRider',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <span
          style={{
            color: value === 'like' ? '#4D9D64' : '#DD5B63',
          }}
        >
          {value === 'like' ? <UpIcon /> : <DownIcon />}
        </span>
      ),
    },
    {
      id: 2,
      headerName: 'SHOP',
      field: 'shop',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          color="primary.main"
          variant="body4"
          sx={{
            cursor: 'pointer',
          }}
          onClick={() => {
            history.push({
              pathname: `/shop/profile/${row?.shop?._id}`,
              state: { from: routeMatch?.path, backToLabel: 'Back to categories' },
            });
          }}
        >
          {row?.shop?.shopName}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'ORDER ID',
      field: 'orderId',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          color="primary.main"
          variant="body4"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentOrder(row);
            setSidebarOpen(true);
          }}
        >
          {row?.orderId}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: 'ACCOUNT',
      field: 'user',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography
          color="primary.main"
          sx={{
            cursor: 'pointer',
          }}
          variant="body4"
          onClick={() => {
            history.push(`/accounts/${value?._id}`);
          }}
        >
          {value?.name}
        </Typography>
      ),
    },
    {
      id: 5,
      headerName: 'AMOUNT',
      field: 'summary',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value?.baseCurrency_totalAmount}</Typography>,
    },
    {
      id: 6,
      headerName: 'PAYMENT TYPE',
      field: 'paymentMethod',
      flex: 1,
      sortable: false,
      renderCell: ({ value, row }) => (
        <Typography variant="body4" className="text-capitalize">
          {value} {row?.selectPos !== 'no' ? '(Pos)' : ''}
        </Typography>
      ),
    },
    {
      id: 7,
      headerName: `DATE`,
      sortable: false,
      field: 'createdAt',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Stack gap={1.5}>
          <Typography variant="body4">{moment(row?.createdAt)?.format('MMM DD, YYYY')}</Typography>
          <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
            {moment(row?.createdAt)?.format('hh:mm A')}
          </Typography>
        </Stack>
      ),
    },
  ];

  if (loading) return <TablePageSkeleton column={7} row={5} />;

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
                No Ratings Find
              </Stack>
            ),
          }}
        />
      </Box>
      <Drawer open={sidebarOpen} anchor="right">
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setSidebarOpen(false);
            setCurrentOrder({});
          }}
        />
      </Drawer>
    </>
  );
}
