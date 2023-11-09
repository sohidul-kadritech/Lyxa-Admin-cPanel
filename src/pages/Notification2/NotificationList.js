import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import TableLoader from '../../components/Common/TableLoader';
// eslint-disable-next-line import/no-named-as-default
import ConfirmModal from '../../components/Common/ConfirmModal';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';
import { getSpecificUser } from './helpers';

function NotificationList({ data = [], loading, deleteQuery, isConfirm, setIsConfirm }) {
  const [id, setId] = useState('');
  const allColumns = [
    {
      id: 1,
      headerName: `NOTIFICAITON`,
      field: 'title',
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography variant="body1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
              {params?.row?.title}
            </Typography>
            <Typography
              variant="body3"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: '1.5' }}
            >
              {params?.row?.description}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `ACCOUNT TYPE`,
      field: 'accountType',
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textTransform: 'capitalize' }}
            >
              {params?.row?.accountType !== 'deliveryBoy' ? params?.row?.accountType : 'Rider'}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: `SENT TO`,
      field: 'type',
      flex: 1.5,
      sortable: true,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textTransform: 'capitalize' }}
            >
              {params?.row?.type === 'global' ? 'All user' : getSpecificUser(params?.row)?.name}
            </Typography>
            <Typography
              variant="body3"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                lineHeight: '1.5',
              }}
            >
              {params?.row?.type !== 'global' && getSpecificUser(params?.row)?.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },

    {
      id: 4,
      field: 'DATE',
      headerName: 'Created',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography variant="body1">{new Date(row?.createdAt || undefined).toLocaleDateString()}</Typography>
      ),
    },
    {
      id: 5,
      headerName: '',
      field: 'action',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        console.log('row: ', row);
        return (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
            {/* delete */}
            <StyledIconButton
              color="primary"
              sx={{
                '&.Mui-disabled': {
                  color: '#c1c1c1',
                  backgroundColor: '#F3F6F9',
                },
              }}
              onClick={() => {
                setIsConfirm(true);
                setId(row._id);
              }}
            >
              <DeleteIcon />
            </StyledIconButton>
          </Stack>
        );
      },
    },
  ];
  return (
    <Box>
      <StyledTable
        columns={allColumns}
        rows={data}
        getRowId={(row) => row?._id}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'defualt',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {loading ? <TableLoader /> : 'No Notification Found'}
            </Stack>
          ),
        }}
      />

      <ConfirmModal
        message="Are you sure you want to delete the notification?"
        isOpen={isConfirm}
        loading={deleteQuery?.isLoading}
        blurClose
        onCancel={() => {
          setIsConfirm(false);
        }}
        onConfirm={() => {
          deleteQuery.mutate({ id });
        }}
      />
    </Box>
  );
}

export default NotificationList;
