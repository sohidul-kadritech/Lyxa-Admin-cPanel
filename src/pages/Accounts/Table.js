/* eslint-disable import/no-named-as-default */
// project import
import { Edit, Visibility } from '@mui/icons-material';
import { Box, Drawer, Stack, Typography } from '@mui/material';
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

export default function UsersTable({ users = [], page, setPage, totalPage, loading }) {
  const queryClient = useQueryClient();
  const { currentUser } = useGlobalContext();

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
      id: 1,
      headerName: 'ACCOUNT NAME',
      field: 'user',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
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
      ),
    },
    {
      id: 2,
      headerName: 'ZONE',
      field: 'zone',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography variant="body4" className="text-capitalize">
          {value?.zoneName || '_'}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'E-MAIL',
      field: 'email',
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => (
        <Typography className="text-dots" variant="body4" pr={3}>
          {value}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'PHONE #',
      field: 'phone_number',
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => (
        <Typography className="text-dots" variant="body4" pr={3}>
          {value}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: 'ORDERS',
      field: 'orderCompleted',
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 5,
      headerName: 'STATUS',
      field: 'status',
      sortable: false,
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
      id: 6,
      headerName: 'CREATION DATE',
      field: 'createdAt',
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
    {
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
          columns={columns}
          rows={users}
          getRowId={(row) => row?._id}
          rowHeight={71}
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
