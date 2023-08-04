/* eslint-disable import/no-named-as-default */
// project import
import { Chip, Stack, Typography } from '@mui/material';
import TableDateTime from '../../../components/Common/TableDateTime';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';

export default function MarketingHistoryTable({ rows = [], loading }) {
  const columns = [
    {
      id: 1,
      headerName: `DEAL TYPE`,
      sortable: false,
      field: 'type',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 2,
      headerName: `DURATION`,
      sortable: false,
      field: 'duration',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 3,
      headerName: `SPENDING LIMIT`,
      sortable: false,
      field: 'spentLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      headerName: `AMOUNT SPENT`,
      sortable: false,
      field: 'amountSpent',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 5,
      headerName: `DATE`,
      sortable: false,
      field: 'date',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      id: 6,
      headerName: `STATUS`,
      sortable: false,
      field: 'status',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: () => (
        <Chip
          label="Expired"
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
          }}
          variant="contained"
        />
      ),
    },
  ];

  if (loading) return <TableSkeleton rows={6} columns={['text', 'text', 'text', 'text', 'text', 'text']} />;

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
      <StyledTable
        autoHeight
        columns={columns}
        getRowId={(row) => row?._id}
        rows={rows?.filter((row) => !row?.hidden)}
        rowHeight={71}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No history
            </Stack>
          ),
        }}
      />
    </StyledBox>
  );
}
