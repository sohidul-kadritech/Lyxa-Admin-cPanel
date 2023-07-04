import { Box, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import StyledTable from '../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../context';

export default function CategoryTable({
  data = [],
  onViewContent,
  loading,
  updateQuery,
  type,
  queryParams,
  setQueryParams,
  totalPage,
}) {
  const theme = useTheme();
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const [render, setRender] = useState(false);

  const { dispatchCurrentUser } = useGlobalContext();

  const allColumns = [
    {
      id: 1,
      headerName: `Category Name`,
      showFor: ['food', 'pharmacy', 'grocery'],
      field: 'image',
      sortable: false,
      flex: 2,
      renderCell: ({ row }) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <UserAvatar
            imgAlt="user-image"
            imgUrl={row?.category?.image}
            imgFallbackCharacter={row?.title?.charAt(0)}
            name={row?.name}
            subTitle={row?.autoGenId}
            titleProps={{
              sx: { color: 'primary.main', cursor: 'pointer' },
              onClick: () => {
                onViewContent(row);
              },
            }}
          />
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `SHOP NAME`,
      field: 'shopName',
      showFor: ['food', 'pharmacy', 'grocery'],
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Stack width="100%" flexDirection="row" alignItems="center" gap="10px">
          {row?.shops?.map((shop) => (
            <Typography
              variant="body4"
              sx={{
                fontSize: '15px',
                fontWeight: '500',
                textTransform: 'capitalize',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'primary.main',
                cursor: 'pointer',
              }}
              onClick={() => {
                history.push({
                  pathname: `/shop/profile/${shop?._id}`,
                  state: { from: routeMatch?.path, backToLabel: 'Back to Categories' },
                });
                dispatchCurrentUser({ type: 'shop', payload: { shop: { ...row?.shop } } });
              }}
            >
              {shop?.shopName}
            </Typography>
          ))}
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: `CREATION DATE`,
      field: 'date',
      showFor: ['food', 'pharmacy', 'grocery'],
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Stack gap={1.5}>
          <Typography variant="body4">{moment(row?.createdAt)?.format('MMM DD, YYYY')}</Typography>
          <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
            {moment(row?.createdAt)?.format('hh:mm A')}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 4,
      headerName: ``,
      field: 'action',
      showFor: ['food', 'pharmacy', 'grocery'],
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        if (row?.ids?.length > 1) {
          return '_';
        }

        return (
          <Stack flexDirection="row" gap="16px">
            <StyledSwitch
              checked={row?.status === 'active'}
              onChange={() => {
                row.status = row?.status === 'active' ? 'inactive' : 'active';
                setRender(!render);
                updateQuery.mutate({
                  id: row?._id,
                  status: row?.status,
                });
              }}
            />
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          padding: '7.5px 16px  2px',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
        }}
      >
        <StyledTable
          columns={allColumns.filter((col) => col?.showFor?.includes(type))}
          rows={data}
          getRowId={(row) => row?._id}
          rowHeight={72}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {loading ? 'Loading...' : 'No category Found'}
              </Stack>
            ),
          }}
        />
      </Box>
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => setQueryParams((prev) => ({ ...prev, page }))}
        totalPage={totalPage}
      />
    </>
  );
}
