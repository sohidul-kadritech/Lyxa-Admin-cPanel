// project import
import { Box, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import Rating from '../../../components/Common/Rating';
import UserAvatar from '../../../components/Common/UserAvatar';
import StyledTable from '../../../components/Styled/StyledTable3';

export default function OrderTable({ orders = [], onRowClick }) {
  const theme = useTheme();

  const columns = [
    {
      id: 1,
      headerName: 'ORDERS',
      field: 'orders',
      flex: 2,
      sortable: false,
      minWidth: 270,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="user-image"
          imgUrl={row?.user?.profile_photo}
          imgFallbackCharacter={row?.user?.name?.charAt(0)}
          name={row?.user?.name}
          subTitle={row?.orderId}
        />
      ),
    },
    {
      id: 2,
      headerName: 'SHOP',
      field: 'shop',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" color="primary">
          {row?.shop?.shopName}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: `DATE`,
      sortable: false,
      field: 'createdAt',
      flex: 2,
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
    {
      id: 4,
      headerName: 'RIDER RATING',
      field: 'rating',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        const r = row?.reviews?.find((r) => r?.type === 'deliveryBoy');

        if (r) {
          return <Rating amount={r?.rating} />;
        }

        return <Typography variant="body4">_</Typography>;
      },
    },
    {
      id: 5,
      headerName: 'NET PAYOUT',
      field: 'payout',
      sortable: false,
      flex: 1,
      renderCell: () => (
        <Typography
          variant="body4"
          fontWeight={600}
          display="flex"
          color={theme.palette.primary.main}
          sx={{
            alignItems: 'center',
            gap: 1,
          }}
        >
          $20
        </Typography>
      ),
    },
  ];

  return (
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
        rows={orders}
        getRowId={(row) => row?._id}
        rowHeight={71}
        onRowClick={onRowClick}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Order found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
