import { Box, Chip, Stack, Typography } from '@mui/material';
import UserAvatar from '../../components/Common/UserAvatar';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';
import { statusColorVariants } from './helper';

export default function TicketTable({ rows = [], onSelect, ticketType }) {
  const columns = [
    {
      showFor: ['order', 'account'],
      id: 1,
      headerName: `ACCOUNT`,
      sortable: false,
      field: 'invoiceId',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => <UserAvatar name={row?.user?.name} imgStyle="circular" subTitle={row?.user?.orderId} />,
    },
    {
      showFor: ['order'],
      id: 2,
      headerName: `SHOP`,
      sortable: false,
      field: 'status',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => <UserAvatar name={row?.user?.name} imgStyle="circular" subTitle={row?.user?.orderId} />,
    },
    {
      showFor: ['order'],
      id: 3,
      headerName: `RIDER`,
      sortable: false,
      field: 'couponMinimumOrderValue',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => <UserAvatar name={row?.user?.name} imgStyle="circular" subTitle={row?.user?.orderId} />,
    },
    {
      showFor: ['account'],
      id: 4,
      headerName: `STATUS`,
      sortable: false,
      field: 'status',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Chip
          label={row?.status}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            textTransform: 'capitalize',
            ...(statusColorVariants[row?.status] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      showFor: ['account'],
      id: 5,
      headerName: `LOCATION`,
      sortable: false,
      field: 'zone',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      showFor: ['order', 'account'],
      id: 6,
      headerName: `DATE`,
      sortable: false,
      field: 'couponOrderLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Stack gap={1.5}>
          <Typography variant="body4">{row?.createdAt}</Typography>
          <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
            {row?.time}
          </Typography>
        </Stack>
      ),
    },
  ];

  return (
    <StyledBox
      padding
      sx={{
        paddingTop: '3px',
        paddingBottom: '10px',
        overflowX: 'auto',
        scrollbarWidth: 'thin',
        scrollbarHeight: 'thin',

        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
      }}
    >
      <Box
        sx={{
          minWidth: '650px',
        }}
      >
        <StyledTable
          autoHeight
          columns={columns.filter((col) => col.showFor.includes(ticketType))}
          getRowId={(row) => row?._id}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
          onRowClick={onSelect}
          rows={rows}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Coupon found
              </Stack>
            ),
          }}
        />
      </Box>
    </StyledBox>
  );
}
