import { Chip, Stack, Typography } from '@mui/material';
import Rating from '../../components/Common/Rating';
import TableDateTime from '../../components/Common/TableDateTime';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';

export default function TicketsTable({ rows = [], loading, ticketType }) {
  const columns = [
    {
      showFor: ['order', 'account'],
      id: 1,
      headerName: `ACCOUNT`,
      sortable: false,
      field: 'user',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => (
        <UserAvatar name={value?.name} imgUrl={value?.profile_photo} subTitle="OrderID #455516" />
      ),
    },
    {
      showFor: ['order'],
      id: 2,
      headerName: `SHOP`,
      sortable: false,
      field: 'shop',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <UserAvatar name={value?.name} imgUrl={value?.profile_photo} />,
    },
    {
      showFor: ['order', 'account'],
      id: 3,
      headerName: `SUPPORT AGENT`,
      sortable: false,
      field: 'admin',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: () => <Typography variant="body4">J. Doe</Typography>,
    },
    {
      showFor: ['order', 'account'],
      id: 4,
      headerName: `STATUS`,
      sortable: false,
      field: 'spentLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: () => (
        <Chip
          label="Ongoing"
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            color: '#417C45',
            background: '#DCFCE7',
          }}
          variant="contained"
        />
      ),
    },
    {
      showFor: ['account'],
      id: 5,
      headerName: `ORDER RATING`,
      sortable: false,
      field: 'rating',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Rating amount={value} />,
    },
    {
      showFor: ['order', 'account'],
      id: 6,
      headerName: `DATE`,
      sortable: false,
      field: 'date',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ value }) => <TableDateTime date={value} />,
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
          columns={columns?.filter((col) => col.showFor.includes(ticketType))}
          getRowId={(row) => row?._id}
          rows={rows?.filter((row) => !row?.hidden)}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No chats
              </Stack>
            ),
          }}
        />
      </StyledBox>
      <TablePagination
        currentPage={1}
        lisener={() => {
          //   setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={1}
      />
    </>
  );
}
