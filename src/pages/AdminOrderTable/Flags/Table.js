/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Chip, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as MessageIcon } from '../../../assets/icons/message-icon.svg';
import { ReactComponent as FlagIcon } from '../../../assets/icons/order-flag.svg';
import { ReactComponent as ReplacementIcon } from '../../../assets/icons/replacement-order-icon.svg';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import TableDateTime from '../../../components/Common/TableDateTime';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import OrderDetail from '../../../components/Shared/OrderDetail';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable5 from '../../../components/Styled/StyledTable5';
import { orderStatusMap, statusColorVariants } from '../../NewOrder/helpers';

export default function Table({ orders = [], queryParams, setQueryParams, totalPage, loading, refetching }) {
  const history = useHistory();

  const [detailOpen, setDetailOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});

  // columns for expand
  const columnsForExpand = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'user',
      flex: 1.5,
      sortable: false,
      minWidth: 240,
      renderCell: ({ value, row, onExpandHandler }) => (
        <UserAvatar
          imgAlt="user-image"
          imgUrl={value?.profile_photo}
          imgFallbackCharacter={value?.name?.charAt(0) || 'C'}
          name={
            <span>
              {value?.name}
              {row?.chats?.length || row?.admin_chat_request?.length ? (
                <>
                  &nbsp;&nbsp;
                  <MessageIcon color="#5BBD4E" />
                </>
              ) : null}
              {row?.replacementOrder ? (
                <>
                  &nbsp;&nbsp;
                  <ReplacementIcon style={{ height: 18 }} color="#DD5B63" />
                </>
              ) : null}
              {row?.flag?.length ? (
                <>
                  &nbsp;&nbsp;
                  <FlagIcon color="#DD5B63" />
                </>
              ) : null}
            </span>
          }
          subTitle={row?.orderId}
          subTitleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              setCurrentOrder(row);
              setDetailOpen(true);
            },
          }}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push(`/users/${value?._id}`);
            },
          }}
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered'],
      id: 2,
      headerName: `TYPE`,
      field: 'type',
      sortable: false,
      minWidth: 120,
      flex: 1,
      renderCell: ({ row }) => {
        const types = [];

        row?.flag?.forEach((item) => {
          if (types.indexOf(item?.type) === -1) {
            types.push(item?.type);
          }
        });

        return (
          <Typography variant="body4" textTransform="capitalize">
            {types?.join(', ') || '-'}
          </Typography>
        );
      },
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 6,
      headerName: 'CREATION DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['ongoing', 'cancelled'],
      id: 5,
      headerName: 'STATUS',
      field: 'orderStatus',
      sortable: false,
      flex: 1,
      minWidth: 180,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
        <Chip
          label={orderStatusMap[row?.orderStatus || '']}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusColorVariants[row?.orderStatus] || {}),
          }}
          variant="contained"
        />
      ),
    },
  ];

  // columns original
  const columns = [
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 1,
      headerName: 'ACCOUNT',
      field: 'user',
      flex: 1.5,
      sortable: false,
      minWidth: 240,
      renderCell: ({ value, row, onExpandHandler }) => (
        <UserAvatar
          imgAlt="user-image"
          imgUrl={value?.profile_photo}
          imgFallbackCharacter={value?.name?.charAt(0) || 'C'}
          expandIcon={!!row?.replacementOrder}
          onClickExpand={() => {
            onExpandHandler(
              <StyledTable5
                showHeader={false}
                rowSx={{ border: 'none' }}
                rowInnerContainerSx={{ padding: '0px' }}
                columns={columnsForExpand}
                rows={[{ ...row?.replacementOrder }]}
              />,
            );
          }}
          name={
            <span>
              {value?.name}
              {row?.chats?.length || row?.admin_chat_request?.length ? (
                <>
                  &nbsp;&nbsp;
                  <MessageIcon color="#5BBD4E" />
                </>
              ) : null}
              {row?.replacementOrder ? (
                <>
                  &nbsp;&nbsp;
                  <ReplacementIcon style={{ height: 18 }} color="#DD5B63" />
                </>
              ) : null}
              {row?.flag?.length ? (
                <>
                  &nbsp;&nbsp;
                  <FlagIcon color="#DD5B63" />
                </>
              ) : null}
            </span>
          }
          subTitle={row?.orderId}
          subTitleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              setCurrentOrder(row);
              setDetailOpen(true);
            },
          }}
          titleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              history.push(`/users/${value?._id}`);
            },
          }}
        />
      ),
    },
    {
      showFor: ['ongoing', 'delivered'],
      id: 2,
      headerName: `TYPE`,
      field: 'type',
      sortable: false,
      minWidth: 120,
      flex: 1,
      renderCell: ({ row }) => {
        const types = [];

        row?.flag?.forEach((item) => {
          if (types.indexOf(item?.type) === -1) {
            types.push(item?.type);
          }
        });

        return (
          <Typography variant="body4" textTransform="capitalize">
            {types?.join(', ')}
          </Typography>
        );
      },
    },
    {
      showFor: ['ongoing', 'delivered', 'cancelled'],
      id: 6,
      headerName: 'CREATION DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1,
      renderCell: ({ value, row }) => {
        console.log({ row });
        return <TableDateTime date={row?.flaggedAt ? row?.flaggedAt : row?.createdAt} />;
      },
    },
    {
      showFor: ['ongoing', 'cancelled'],
      id: 5,
      headerName: 'STATUS',
      field: 'orderStatus',
      sortable: false,
      flex: 1,
      minWidth: 180,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
        <Chip
          label={orderStatusMap[row?.orderStatus || '']}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusColorVariants[row?.orderStatus] || {}),
          }}
          variant="contained"
        />
      ),
    },
  ];

  if (loading) {
    return <TableSkeleton columns={['avatar', 'avatar', 'text', 'text']} rows={7} />;
  }

  return (
    <>
      <Box
        sx={{
          pr: 5,
          pl: 3.5,
          pt: 1,
          pb: 1,
          border: '1px solid #EEEEEE',
          borderRadius: '7px',
          background: '#fff',
          position: 'relative',
        }}
      >
        {refetching && <LoadingOverlay />}
        <StyledTable5
          columns={columns}
          rows={orders}
          getRowId={(row) => row?._id}
          rowHeight={71}
          NoRowsOverlay={
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Order found
            </Stack>
          }
        />
      </Box>
      <TablePagination
        currentPage={Number(queryParams?.page)}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
      {/* order detail */}
      <Drawer
        anchor="right"
        open={detailOpen}
        onClose={() => {
          setCurrentOrder({});
          setDetailOpen(false);
        }}
      >
        <OrderDetail
          order={currentOrder}
          onClose={() => {
            setCurrentOrder({});
            setDetailOpen(false);
          }}
        />
      </Drawer>
    </>
  );
}
