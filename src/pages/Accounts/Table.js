// project import
import { Edit, Visibility } from '@mui/icons-material';
import { Box, Chip, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import TableDateTime from '../../components/Common/TableDateTime';
import TablePagination from '../../components/Common/TablePagination';
import UserAvatar from '../../components/Common/UserAvatar';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';
import EditUser from './EditUser/index ';
import TableSkeleton from './Skeleton';
import ViewAccountInfo from './ViewAccount';

const statusToLabelMap = {
  active: 'Active',
  inactive: 'Suspended',
};

const statusToColorMap = {
  inactive: {
    color: '#FFB017',
    background: 'rgba(255, 176, 23, 0.15)',
  },

  active: {
    color: '#417C45',
    background: '#DCFCE7',
  },
};

export default function UsersTable({ users = [], page, setPage, totalPage, loading }) {
  const history = useHistory();
  const [sidebarOpen, setSidebarOpen] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});

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
              history.push(`/accounts/${row?._id}`, {
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
      renderCell: () => (
        <Typography variant="body4" className="text-capitalize">
          empty
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
      renderCell: ({ value }) => (
        <Chip
          label={statusToLabelMap[value || '']}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusToColorMap[value] || {}),
          }}
          variant="contained"
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
          <StyledIconButton
            onClick={() => {
              setSidebarOpen('edit');
              setSelectedUser(row);
            }}
            color="primary"
          >
            <Edit />
          </StyledIconButton>
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
