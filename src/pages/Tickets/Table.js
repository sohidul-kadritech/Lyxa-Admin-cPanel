/* eslint-disable no-unsafe-optional-chaining */
import { Box, Chip, Stack, Typography } from '@mui/material';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import Rating from '../../components/Common/Rating';
import TableDateTime from '../../components/Common/TableDateTime';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';
import { chatStatusColorMap } from '../PastTickets/helper';

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
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <UserAvatar
          name={row?.user?.name}
          imgUrl={row?.user?.profile_photo}
          imgStyle="circular"
          subTitle={row?.orderId || row?.shortId}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push(`/users/${row?.user?._id}`);
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
      field: 'order',
      flex: 1,
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
        return (
          <Typography variant="body4" className="text-dots" pr={6}>
            {primaryAddress?.address}
          </Typography>
        );
      },
    },
    {
      showFor: ['order', 'account'],
      id: 3,
      headerName: `SUPPORT AGENT`,
      sortable: false,
      field: 'agents',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => {
        const names = new Set();
        if (ticketType === 'order') {
          row?.admin_chat_request?.forEach((chat) => {
            if (chat?.admin?.name) names.add(chat?.admin?.name);
          });
        } else if (row?.admin?.name) {
          names.add(row?.admin?.name);
        }
        return <Typography variant="body4">{names?.size ? Array.from(names).join(', ') : '_'}</Typography>;
      },
    },
    {
      showFor: ['order', 'account'],
      id: 4,
      headerName: `STATUS`,
      sortable: false,
      field: 'status',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        let value;
        if (ticketType === 'order') {
          value = row?.admin_chat_request?.at(-1)?.status;
        } else {
          value = row?.status;
        }
        return (
          <Chip
            label={chatStatusColorMap[value]?.label}
            sx={{
              height: 'auto',
              padding: '12px 23px',
              borderRadius: '40px',
              textTransform: 'capitalize',
              ...(chatStatusColorMap[value] || {}),
            }}
            variant="contained"
          />
        );
      },
    },
    {
      showFor: ['order'],
      id: 4,
      headerName: `ORDER RATING`,
      sortable: false,
      field: 'rating',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        console.log('row', row);
        const rating = row?.reviews?.find((r) => r.type === 'shop');
        if (rating) {
          return <Rating amount={rating?.rating} />;
        }
        return <Typography variant="body4">_</Typography>;
      },
    },
    {
      showFor: ['order', 'account'],
      id: 6,
      headerName: `DATE`,
      sortable: false,
      field: 'date',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        let value;
        if (ticketType === 'order') {
          value = (row?.admin_chat_request?.at(-1) || row?.admin_chat_request?.[row?.admin_chat_request?.length - 1])
            ?.acceptedAt;
        } else {
          value = row?.acceptedAt;
        }
        return <TableDateTime date={value} />;
      },
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
