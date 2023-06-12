import { Delete, Edit } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import ConfirmModal from '../../components/Common/ConfirmModal';
import FilterSelect from '../../components/Filter/FilterSelect';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';

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

function AdminTeamList({ data = [], setCurrentAdmin, setOpen, setIsEdit }) {
  const theme = useTheme();

  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const onStatusChange = (value, item) => {
    item.status = value;
    // setRender((prev) => !prev);
    // tagsMutation.mutate(item);
  };

  const allColumns = [
    {
      id: 1,
      //   showFor: ['Shop List'],
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
      //   showFor: ['Shop List'],
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
      //   showFor: ['Shop List'],
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
            onChange={(e) => {
              onStatusChange(e.target.value, params.row);
            }}
          />
        </Box>
      ),
    },
    {
      id: 5,
      headerName: `ACTION`,
      headerAlign: 'right',
      align: 'right',
      field: 'action',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          <StyledIconButton
            //   onClick={() => {
            //     setSelectedShop(params?.row);
            //     props.setSelectedMenu('');
            //     setOpen(true);
            //   }}
            color="primary"
          >
            <VisibilityIcon />
          </StyledIconButton>
          {/* edit */}
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
          <StyledIconButton
            //   onClick={() => {
            //     setOpen(true);
            //     props.setSelectedMenu('edit_shop');
            //     setSelectedShop(params?.row);
            //   }}
            color="primary"
          >
            <Delete />
          </StyledIconButton>

          {/* delete */}
        </Stack>
      ),
    },
  ];

  return (
    <Box
      sx={{
        padding: '7.5px 16px  2px',
        maxHeight: '350px',
        overflow: 'auto',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
      }}
    >
      <StyledTable
        // columns={allColumns.filter((column) => column.showFor.includes(tabName))}
        columns={allColumns}
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
        message="Are you sure you want to delete this resource?"
        isOpen={isConfirmModal}
        // loading={editSellerQuery?.isLoading}
        onCancel={() => {
          setIsConfirmModal(false);
          //   setCurrentDocumet({});
        }}
        onConfirm={() => {
          // setIsConfirmModal(false);
          //   removeDocument(currentDocumet);
        }}
      />
    </Box>
  );
}

export default AdminTeamList;
