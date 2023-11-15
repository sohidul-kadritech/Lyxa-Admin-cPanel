/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */
// project import
import { Edit, Visibility } from '@mui/icons-material';
import { Box, Chip, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import TableDateTime from '../../components/Common/TableDateTime';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
import FilterSelect from '../../components/Filter/FilterSelect';
import EditUser from '../../components/Shared/EditUser/index ';
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { statusColorVariants } from '../NewOrder/helpers';
import TableSkeleton from './Skeleton';
import ViewAccountInfo from './ViewAccount';

const listFilterOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

export default function UsersTable({ users = [], page, setPage, totalPage, loading, showFor }) {
  const queryClient = useQueryClient();
  const { currentUser } = useGlobalContext();

  console.log('log', { users });

  const { admin } = currentUser;

  const history = useHistory();
  const [render, setRender] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});

  const userMuation = useMutation((data) => AXIOS.post(Api.USER_UPDATE, data), {
    onSuccess: (data) => {
      if (data?.status) {
        queryClient.invalidateQueries([Api.ALL_USERS]);
      }
    },
  });

  const onStatusChange = (newStatus, user) => {
    user.status = newStatus;
    setRender(!render);
    userMuation.mutate({ id: user?._id, status: newStatus });
  };

  const columns = [
    {
      showFor: ['normal', 'subscribed'],
      id: 1,
      headerName: 'ACCOUNT NAME',
      field: 'user',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack py={3}>
          <UserAvatar
            imgAlt="user-image"
            imgUrl={row?.profile_photo}
            imgFallbackCharacter={row?.name?.charAt(0)}
            name={row?.name}
            subTitle={row?.autoGenId}
            titleProps={{
              sx: { color: 'primary.main', cursor: 'pointer' },
              onClick: () => {
                history.push(`/users/${row?._id}`, {
                  user: row,
                });
              },
            }}
          />
        </Stack>
      ),
    },
    {
      showFor: ['normal'],
      id: 2,
      headerName: 'ZONE',
      field: 'zone',
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography variant="body4" className="text-capitalize">
          {value?.zoneName || '_'}
        </Typography>
      ),
    },
    {
      showFor: ['normal'],
      id: 3,
      headerName: 'E-MAIL',
      field: 'email',
      sortable: false,
      minWidth: 200,
      flex: 1.5,
      renderCell: ({ value }) => (
        <Typography className="text-dots" variant="body4" pr={3}>
          {value}
        </Typography>
      ),
    },
    {
      showFor: ['normal'],
      id: 3,
      headerName: 'PHONE #',
      field: 'phone_number',
      sortable: false,
      minWidth: 200,
      flex: 1.5,
      renderCell: ({ value }) => (
        <Typography className="text-dots" variant="body4" pr={3}>
          {value || '_'}
        </Typography>
      ),
    },
    {
      showFor: ['normal', 'subscribed'],
      id: 4,
      headerName: 'ORDERS',
      field: 'orderCompleted',
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      showFor: ['normal', 'subscribed'],
      id: 5,
      headerName: 'STATUS',
      field: 'status',
      sortable: false,
      minWidth: 150,
      flex: 1,
      renderCell: ({ value, row }) => (
        <FilterSelect
          items={listFilterOptions}
          sx={{
            background: value === 'active' ? '#DCFCE7' : '#FEE2E2',
            '&:hover': {
              background: value === 'active' ? '#DCFCE7' : '#FEE2E2',
            },
            '& .MuiInputBase-input': {
              color: value === 'active' ? '#417C45' : '#DD5B63',
            },
            '& .MuiSelect-icon': {
              color: value === 'active' ? '#417C45' : '#DD5B63',
            },
          }}
          size="lg1"
          value={value}
          onChange={(e) => {
            onStatusChange(e.target.value, row);
          }}
        />
      ),
    },
    {
      showFor: ['subscribed'],
      id: 5,
      headerName: 'AUTO RENEW',
      field: 'subscriptionAutoRenew',
      sortable: false,
      minWidth: 180,
      flex: 1.5,
      renderCell: ({ value, row }) => (
        <Stack alignItems="center" gap={1}>
          <Chip
            label={row?.subscription?.subscriptionAutoRenew ? 'Auto-Renewed' : 'Cancelled'}
            sx={{
              height: 'auto',
              padding: '12px 23px',
              borderRadius: '40px',
              textTransform: 'capitalize',
              ...(statusColorVariants[row?.subscription?.subscriptionAutoRenew] || {}),
            }}
            variant="contained"
          />
          {!row?.subscription?.subscriptionAutoRenew && (
            <Box sx={{ maxWidth: '180px' }}>
              <Typography
                variant="body3"
                sx={{
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2, // Number of lines to show
                  textAlign: 'center',
                }}
              >
                Reason: {row?.subscription?.subscriptionCancelReason || ''}
              </Typography>
            </Box>
          )}
        </Stack>
      ),
    },
    {
      showFor: ['subscribed'],
      id: 5,
      headerName: 'SUBS TYPE',
      field: 'subscriptionPackage',
      sortable: false,
      minWidth: 100,
      flex: 1.5,
      renderCell: ({ value, row }) => (
        <Typography
          variant="body"
          sx={{
            textTransform: 'capitalize',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2, // Number of lines to show
          }}
        >
          {row?.subscription?.subscriptionPackage || ''}
        </Typography>
      ),
    },
    {
      showFor: ['normal'],
      id: 6,
      headerName: 'CREATION DATE',
      field: 'createdAt',
      sortable: false,
      minWidth: 150,
      flex: 1,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
      showFor: ['subscribed'],
      id: 6,
      headerName: 'END DATE',
      field: 'subscriptionDuration',
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: ({ value, row }) => <TableDateTime date={row?.subscription?.subscriptionDuration?.end} />,
    },
    {
      showFor: ['normal', 'subscribed'],
      id: 7,
      headerName: '',
      field: 'action',
      sortable: false,
      flex: 0.5,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {admin?.adminType !== 'customerService' && (
            <StyledIconButton
              onClick={() => {
                setSidebarOpen('edit');
                setSelectedUser(row);
              }}
              color="primary"
            >
              <Edit />
            </StyledIconButton>
          )}
          <StyledIconButton
            color="primary"
            onClick={() => {
              setSidebarOpen('view');
              setSelectedUser(row);
            }}
          >
            <Visibility />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <Box>
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
          columns={columns?.filter((column) => column?.showFor?.includes(showFor))}
          rows={users}
          getRowId={(row) => row?._id}
          getRowHeight={() => 'auto'}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Users found
              </Stack>
            ),
          }}
        />
      </Box>
      <TablePagination currentPage={page} lisener={setPage} totalPage={totalPage} />
      <Drawer open={Boolean(sidebarOpen)} anchor="right">
        {sidebarOpen === 'view' && (
          <ViewAccountInfo
            user={selectedUser}
            onClose={() => {
              setSelectedUser({});
              setSidebarOpen(null);
            }}
          />
        )}
        {sidebarOpen === 'edit' && (
          <EditUser
            editUser={selectedUser}
            onClose={() => {
              setSelectedUser({});
              setSidebarOpen(null);
            }}
          />
        )}
      </Drawer>
    </Box>
  );
}
