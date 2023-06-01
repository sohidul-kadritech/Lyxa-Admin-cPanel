// project import
import { Box, Chip, Stack, Typography } from '@mui/material';
import moment from 'moment';
import Rating from '../../components/Common/Rating';
import UserAvatar from '../../components/Common/UserAvatar';
import StyledTable from '../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../context';
import { getOrderProfit, orderStatusMap, statusColorVariants } from './helpers';
// import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';

export default function OrderTable({ orders = [], onRowClick, orderFilter }) {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();
  // const theme = useTheme();
  // console.log('order table: ', orders, 'order fileter: ', orderFilter);
  const { general } = useGlobalContext();
  const currency = general?.currency?.code;

  const columns = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 1,
      headerName: 'ORDERS',
      field: 'orders',
      flex: orderFilter === 'cancelled ' ? 1.5 : 1,
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
      showFor: ['ongoing'],
      id: 2,
      headerName: 'PAYMENT METHOD',
      field: 'paymentMethod',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.paymentMethod} {row?.selectPos !== 'no' ? '(Pos)' : ''}
        </Typography>
      ),
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 3,
      headerName: 'DATE',
      field: 'createdAt',
      minWidth: 240,
      sortable: false,
      flex: orderFilter === 'cancelled' ? 1.5 : 1,
      renderCell: ({ value }) => <Typography variant="body4">{moment(value).format('MMM D, YYYY h:mm a')}</Typography>,
    },
    {
      showFor: ['delivered'],
      id: 3,
      headerName: 'RIDER',
      field: 'deliveryBoy',
      minWidth: 270,
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="rider-image"
          imgUrl={row?.deliveryBoy?.image}
          imgFallbackCharacter={row?.deliveryBoy?.name?.charAt(0)}
          name={row?.deliveryBoy?.name}
        />
      ),
    },
    {
      showFor: ['delivered'],
      id: 3,
      headerName: 'RATING',
      field: 'rating',
      sortable: false,
      flex: 1,
      // eslint-disable-next-line arrow-body-style, no-unused-vars
      renderCell: ({ row }) => {
        const rating = row?.reviews?.find((ra) => ra?.type === 'shop');
        if (rating) return <Rating amount={rating?.rating} />;
        return '_';
      },
    },
    {
      showFor: ['ongoing', 'cancelled'],
      id: 4,
      headerName: 'STATUS',
      field: 'orderStatus',
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => (
        <Chip
          label={orderStatusMap[value || '']}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusColorVariants[value] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 5,
      headerName: 'PROFIT',
      field: 'profit',
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      flex: 1,
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {currency} {getOrderProfit(row)}
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
        columns={columns.filter((column) => column.showFor.includes(orderFilter))}
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
