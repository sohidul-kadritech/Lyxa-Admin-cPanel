import { Box, Chip, Stack, Typography } from '@mui/material';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import TableDateTime from '../../components/Common/TableDateTime';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';
import { statusColorVariants } from './helper';

export default function TicketTable({
  rows = [],
  onSelect,
  ticketType,
  queryParams,
  setQueryParams,
  loading,
  totalPage,
}) {
  const history = useHistory();
  const routeMatch = useRouteMatch();

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
      renderCell: ({ row }) => (
        <UserAvatar
          console={console.log({ row })}
          name={row?.user?.name}
          imgUrl={row?.user?.profile_photo}
          imgStyle="circular"
          subTitle={row?.orderId || row?.shortId}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push(`/accounts/${row?.user?._id}`);
            },
          }}
          subTitleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              onSelect(row);
            },
          }}
        />
      ),
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
      renderCell: ({ row }) => (
        <UserAvatar
          name={row?.shop?.shopName}
          imgUrl={row?.shop?.shopLogo}
          imgStyle="circular"
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push({
                pathname: `/shop/profile/${row?.shop?._id}`,
                state: { from: routeMatch?.path, backToLabel: 'Back to Orders' },
              });
            },
          }}
        />
      ),
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
      renderCell: ({ row }) => {
        if (row?.deliveryBoy)
          return (
            <UserAvatar
              name={row?.deliveryBoy?.name}
              imgStyle="circular"
              titleProps={{
                sx: { color: 'primary.main', cursor: 'pointer' },
                onClick: () => {
                  history.push(`/riders/${row?.deliveryBoy?._id}`);
                },
              }}
            />
          );
        return <span>_</span>;
      },
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
      field: 'location',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const primaryAddress = row?.user?.address?.find((item) => item?.primary);
        return <Typography variant="body4">{primaryAddress?.address}</Typography>;
      },
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
      renderCell: ({ row }) => <TableDateTime date={row?.acceptedAt} />,
    },
  ];

  if (loading) return <TableSkeleton columns={['avatar', 'avatar', 'avatar', 'text']} rows={8} />;

  return (
    <Box>
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
            rows={rows}
            rowHeight={71}
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  No chat found
                </Stack>
              ),
            }}
          />
        </Box>
      </StyledBox>
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
    </Box>
  );
}
