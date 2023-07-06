import { Box, Stack, Typography } from '@mui/material';
import StyledTable from '../../../../../../components/Styled/StyledTable3';
import StyledBox from '../../../../../../components/StyledCharts/StyledBox';

export default function CouponOverviewTable({ rows = [] }) {
  const columns = [
    {
      id: 1,
      headerName: `COUPON`,
      sortable: false,
      field: 'couponType',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 2,
      headerName: `ONGOING`,
      sortable: false,
      field: 'status',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      headerName: `TOTAL ORDERS`,
      sortable: false,
      field: 'totalOrders',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 5,
      headerName: `ORDER INCREASE`,
      sortable: false,
      field: 'orderIncrease',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 6,
      headerName: `USAGE`,
      sortable: false,
      field: 'usage',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 7,
      headerName: `AMOUNT SPENT`,
      sortable: false,
      field: 'amountSpent',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
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
