import { Box, Stack, Typography } from '@mui/material';
import Rating from '../../../components/Common/Rating';
import TableDateTime from '../../../components/Common/TableDateTime';
import StyledTable from '../../../components/Styled/StyledTable3';

export default function CustomerRating({ rows }) {
  const columns = [
    {
      id: 1,
      headerName: 'RATING',
      field: 'amount',
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
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 3,
      headerName: 'SHOP',
      field: 'shop',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      headerName: 'ORDER ID',
      field: 'orderId',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 5,
      headerName: 'AMOUNT',
      field: 'amount',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 6,
      headerName: 'PAYMENT TYPE',
      field: 'type',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 7,
      headerName: `DATE`,
      sortable: false,
      field: 'createdAt',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <TableDateTime date={value} />,
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
  );
}
