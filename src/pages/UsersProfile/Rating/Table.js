// project import
import { Box, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Rating from '../../../components/Common/Rating';
import TableDateTime from '../../../components/Common/TableDateTime';
import UserAvatar from '../../../components/Common/UserAvatar';
import OrderDetail from '../../../components/Shared/OrderDetail';
import StyledTable from '../../../components/Styled/StyledTable3';

export default function ShopRatingTable({ rows = [], type }) {
  // const history = useHistory();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  const columns = [
    {
      id: 1,
      headerName: 'REVIEW',
      field: 'reivew',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 2,
      headerName: type === 'shop' ? 'SHOP' : 'RIDER',
      field: 'shop',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="shop-image"
          imgUrl={row?.shop?.shopLogo}
          imgFallbackCharacter={row?.shop?.shopName?.charAt(0)}
          name={row?.shop?.shopName}
          subTitle={row?.orderId}
        />
      ),
    },
    {
      id: 3,
      headerName: 'RATING',
      field: 'rating',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Rating amount={value} />,
    },
    {
      id: 4,
      headerName: 'DATE',
      field: 'createdAt',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <TableDateTime date={value} />,
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
