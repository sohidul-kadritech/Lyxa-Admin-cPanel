/* eslint-disable import/no-named-as-default */
import { Delete, Edit } from '@mui/icons-material';
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as SellersIcon } from '../../assets/icons/menu-icons/sellers.svg';
import ConfirmModal from '../../components/Common/ConfirmModal';
import FilterSelect from '../../components/Filter/FilterSelect';
// eslint-disable-next-line import/no-named-as-default
import TablePagination from '../../components/Common/TablePagination';
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../context';

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

export const liveStatusForCS = {
  online: {
    color: '#417C45',
    background: '#DCFCE7',
    label: 'Online',
  },
  offline: {
    color: '#363636',
    background: 'rgba(0, 0, 0, 0.2)',
    label: 'Offline',
  },
  undefined: {
    color: '#363636',
    background: 'rgba(0, 0, 0, 0.2)',
    label: 'Offline',
  },
  unknown: {
    color: '#363636',
    background: 'rgba(0, 0, 0, 0.2)',
    label: 'Offline',
  },
};

function AdminTeamList({
  data = [],
  setCurrentAdmin,
  setOpen,
  setOpenSellersModal,
  setIsEdit,
  deleteAdminQuery,
  isConfirmModal,
  editAdminQuery,
  setIsConfirmModal,
  adminType,
  page,
  setPage,
  totalPage,
}) {
  const theme = useTheme();
  const [rowId, setRowId] = useState('');

  // eslint-disable-next-line no-unused-vars
  const { currentUser, userType } = useGlobalContext();

  const onStatusChange = (value, item) => {
    item.status = value;

    editAdminQuery.mutate({
      id: item._id,
      status: value,
    });
  };

  const allColumns = [
    {
      id: 1,
      showFor: ['customerService'],
      headerName: `NAME`,
      field: 'name',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Stack flexDirection="row" alignItems="center" gap="10px">
          <Tooltip
            title={
              <span style={{ textTransform: 'capitalize' }}>{liveStatusForCS[params?.row?.liveStatus]?.label}</span>
            }
          >
            <Box
              sx={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: `${liveStatusForCS[params?.row?.liveStatus]?.color}`,
              }}
            ></Box>
          </Tooltip>
          <Typography sx={{ textTransform: 'capitalize' }}>{params?.row?.name}</Typography>
        </Stack>
      ),
    },
    {
      id: 1,
      showFor: ['admin', 'sales', 'accountManager'],
      headerName: `NAME`,
      field: 'name',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="h6"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
            // padding: '8px 0px',
          }}
        >
          {params?.row?.name}
        </Typography>
      ),
    },
    {
      showFor: ['admin', 'sales', 'accountManager', 'customerService'],
      id: 2,
      headerName: `EMAIL`,
      field: 'email',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="h6"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            // padding: '8px 0px',
          }}
        >
          {params?.row?.email}
        </Typography>
      ),
    },
    {
      id: 3,
      showFor: ['admin', 'sales', 'accountManager', 'customerService'],
      headerName: `PHONE NUMBER`,
      field: 'phone_number',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="h6"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
            // padding: '8px 0px',
          }}
        >
          {params?.row?.phone_number}
        </Typography>
      ),
    },
    {
      id: 4,
      showFor: ['admin', 'sales', 'accountManager', 'customerService'],
      headerName: `STATUS`,
      field: 'status',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ padding: '10px 0px' }}>
          <FilterSelect
            items={listFilterOptions}
            sx={{
              background: params?.row?.status === 'active' ? '#DCFCE7' : '#FEE2E2',
              '&:hover': {
                background: params?.row?.status === 'active' ? '#DCFCE7' : '#FEE2E2',
              },
              '& .MuiInputBase-input': {
                color: params?.row?.status === 'active' ? '#417C45' : '#DD5B63',
              },
              '& .MuiSelect-icon': {
                color: params?.row?.status === 'active' ? '#417C45' : '#DD5B63',
              },
            }}
            size="lg1"
            value={params?.row?.status || ''}
            disabled={params?.row?._id === currentUser?.admin?._id}
            onChange={(e) => {
              onStatusChange(e.target.value, params.row);
            }}
          />
        </Box>
      ),
    },
    {
      id: 5,
      showFor: ['admin', 'sales', 'accountManager', 'customerService'],
      headerName: `ACTION`,
      headerAlign: 'right',
      align: 'right',
      field: 'action',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {/* edit */}
          {(adminType === 'accountManager' || adminType === 'sales') && (
            <StyledIconButton
              onClick={() => {
                setOpenSellersModal(true);
                setCurrentAdmin(params?.row);
              }}
              color="primary"
            >
              <SellersIcon />
            </StyledIconButton>
          )}
          <StyledIconButton
            onClick={() => {
              setOpen(true);
              setIsEdit(true);
              setCurrentAdmin(params?.row);
            }}
            color="primary"
          >
            <Edit />
          </StyledIconButton>
          {/* Delete */}
          <StyledIconButton
            disabled={params?.row?._id === currentUser?.admin?._id}
            onClick={() => {
              setIsConfirmModal(true);
              setRowId(params?.row?._id);
            }}
            color="primary"
          >
            <Delete />
          </StyledIconButton>

          {/* delete */}
        </Stack>
      ),
    },
  ];

  console.log('adminType', adminType);

  return (
    <Box>
      <Box
        sx={{
          padding: '7.5px 16px  2px',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
        }}
      >
        <StyledTable
          columns={allColumns.filter((column) => column.showFor.includes(adminType))}
          // columns={allColumns}
          rows={data || []}
          getRowHeight={() => 'auto'}
          getRowId={(row) => row?._id}
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: 'defualt',
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Admin Found
              </Stack>
            ),
          }}
        />

        <ConfirmModal
          message="Are you sure you want to delete this admin?"
          isOpen={isConfirmModal}
          loading={deleteAdminQuery?.isLoading}
          onCancel={() => {
            setIsConfirmModal(false);
            //   setCurrentDocumet({});
          }}
          onConfirm={() => {
            // setIsConfirmModal(false);
            deleteAdminQuery.mutate({ id: rowId });
            //   removeDocument(currentDocumet);
          }}
        />
      </Box>

      <TablePagination
        currentPage={page}
        lisener={(page) => {
          setPage(page);
        }}
        totalPage={totalPage}
      />
    </Box>
  );
}

export default AdminTeamList;
