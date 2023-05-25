import { Box, Stack, Typography } from '@mui/material';
import UserAvatar from '../../components/Common/UserAvatar';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';

export default function TicketTable({ rows = [], onSelect }) {
  const columns = [
    {
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
      id: 4,
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
          minWidth: '1070px',
        }}
      >
        <StyledTable
          autoHeight
          columns={columns}
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
