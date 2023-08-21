// project import
import { Chip, Stack, Typography } from '@mui/material';
import TableDateTime from '../../../components/Common/TableDateTime';
import TablePagination from '../../../components/Common/TablePagination';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../context';
import { getDurationFromMarketingHistory } from '../Dashbaord/helpers';
import { getHistoryMarketingStatus } from '../helpers';

const dealTypeToLabelMap = {
  free_delivery: '$0 Delivery fee',
  percentage: 'Discounted Items',
  double_menu: 'Buy 1, Get 1 Free',
  featured: 'Featured',
  reward: 'Loyalty Points',
};

const colorMap = {
  ongoing: {
    color: '#5E97A9',
    background: '#F6F8FA',
  },
  scheduled: {
    color: '#5E97A9',
    background: '#F6F8FA',
  },
  paused: {
    color: '#DD5B63',
    background: '#FEE2E2',
  },
};

export default function MarketingHistoryTable({ rows = [], loading, page, setPage, totalPage }) {
  const { general } = useGlobalContext();

  const { currency } = general;

  console.log('currency', currency);

  const columns = [
    {
      id: 1,
      headerName: `DEAL TYPE`,
      sortable: false,
      field: 'type',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{dealTypeToLabelMap[value]}</Typography>,
    },
    {
      id: 2,
      headerName: `DURATION (Days)`,
      sortable: false,
      field: 'duration',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{getDurationFromMarketingHistory(value)}</Typography>,
    },
    {
      id: 3,
      headerName: `SPENDING LIMIT (${currency?.symbol})`,
      sortable: false,
      field: 'spendLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => (
        <Typography variant="body4">{value ? `${currency?.symbol}${value?.toFixed(2)}` : '_'}</Typography>
      ),
    },
    {
      id: 4,
      headerName: `AMOUNT SPENT (${currency?.symbol})`,
      sortable: false,
      field: 'amountSpent',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => (
        <Typography variant="body4">
          {currency?.symbol}
          {(value || 0)?.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 5,
      headerName: `CREATED DATE`,
      sortable: false,
      field: 'createdAt',
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
      renderCell: ({ row }) => {
        const status = getHistoryMarketingStatus(row);
        return (
          <Chip
            label={status}
            sx={{
              height: 'auto',
              padding: '12px 23px',
              borderRadius: '40px',
              textTransform: 'capitalize',
              ...colorMap[status],
            }}
            variant="contained"
          />
        );
      },
    },
  ];

  if (loading) return <TableSkeleton rows={6} columns={['text', 'text', 'text', 'text', 'text', 'text']} />;

  return (
    <>
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
      <TablePagination currentPage={page} lisener={setPage} totalPage={totalPage} />
    </>
  );
}
