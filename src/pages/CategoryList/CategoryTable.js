import { Edit } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import StyledTable from '../../components/Styled/StyledTable3';

export default function CategoryTable({
  data = [],
  onViewContent,
  loading,
  updateQuery,
  type,
  queryParams,
  setQueryParams,
  totalPage,
  onEdit,
}) {
  const theme = useTheme();
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const [render, setRender] = useState(false);

  const allColumns = [
    {
      id: 1,
      headerName: `Category Name`,
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
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        if (!row?.shops?.length) return '_';

        return (
          <Stack width="100%" flexDirection="row" alignItems="center" gap="10px">
            {row?.shops?.map((shop, i, { length: l }) => (
              <Box display="inline-block">
                <Typography
                  variant="body4"
                  display="inline"
                  sx={{
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
                  }}
                >
                  {shop?.shopName?.trim()}
                </Typography>
                {i !== l - 1 && <span>,</span>}
              </Box>
            ))}
          </Stack>
        );
      },
    },
    {
      id: 3,
      headerName: `CREATION DATE`,
      field: 'date',
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
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        if (row?.ids?.length > 1 && type === 'food') return '_';

        return (
          <Stack flexDirection="row" gap="16px">
            {(row?.ids?.length <= 1 || type !== 'food') && (
              <StyledSwitch
                checked={row?.status === 'active'}
                onChange={() => {
                  row.status = row?.status === 'active' ? 'inactive' : 'active';
                  setRender(!render);
                  updateQuery.mutate({
                    id: row?._id,
                    status: row?.status,
                    ids: row?.ids,
                  });
                }}
              />
            )}
            {type !== 'food' && (
              <StyledIconButton
                onClick={() => {
                  onEdit(row);
                }}
                color="primary"
              >
                <Edit />
              </StyledIconButton>
            )}
          </Stack>
        );
      },
    },
  ];

  if (loading) return <TableSkeleton rows={7} columns={['avatar', 'text', 'text', 'text']} />;

  return (
    <>
      <Box
        sx={{
          padding: '7.5px 16px  2px',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
          background: '#fff',
        }}
      >
        <StyledTable
          columns={allColumns}
          rows={data}
          getRowId={(row) => row?._id}
          rowHeight={72}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No category Found
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
