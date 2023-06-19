import { Delete, Edit, Visibility } from '@mui/icons-material';
import { Avatar, Box, Button, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import ConfirmModal from '../../components/Common/ConfirmModal';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import StyledTable from '../../components/Styled/StyledTable3';

function AddBannerTable({
  data,
  loading = false,
  setIsEdit,
  setOpen,
  setRowData,
  isConfirmModal,
  setIsConfirmModal,
  setIsReadOnly,
  deleteQuery,
  updateQuery,
  type,
}) {
  const theme = useTheme();

  const [rowId, setRowId] = useState('');
  const allColumns = [
    {
      id: 1,
      headerName: `IMAGE`,
      showFor: ['home', 'food', 'pharmacy', 'grocery'],
      field: 'image',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Avatar variant="rounded" sx={{ width: '117px', height: '46px' }} src={row?.image}>
            Banner
          </Avatar>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `TITLE`,
      field: 'title',
      showFor: ['home', 'food', 'pharmacy', 'grocery'],
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Typography
            variant="body4"
            sx={{
              fontSize: '15px',
              fontWeight: '500',
              textTransform: 'capitalize',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {row?.title}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: `LINKED TYPE/SHOP`,
      field: 'type',
      showFor: ['home'],
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Typography
            variant="body4"
            sx={{
              fontSize: '15px',
              fontWeight: '500',
              textTransform: 'capitalize',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {row?.clickType || 'Link'}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 4,
      headerName: `CREATION DATE`,
      field: 'date',
      showFor: ['home', 'food', 'pharmacy', 'grocery'],
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
      showFor: ['home', 'food', 'pharmacy', 'grocery'],
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      flex: 1.5,
      renderCell: ({ row }) => (
        <Stack flexDirection="row" gap="16px">
          <StyledSwitch
            checked={row?.status === 'active'}
            onChange={() => {
              updateQuery.mutate({
                id: row?._id,
                status: row?.status === 'active' ? 'inactive' : 'active',
              });
            }}
          />
          <Button
            sx={{
              minWidth: '32px',
              padding: '9px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              background: theme?.palette?.background?.secondary,
            }}
            onClick={() => {
              console.log(row);
              setRowData(row);
              setOpen(() => {
                setIsEdit(true);
                return true;
              });
            }}
          >
            <Edit sx={{ fontSize: '14px' }} />
          </Button>

          <Button
            onClick={() => {
              setOpen(() => {
                setRowData(row);
                setIsReadOnly(true);
                return true;
              });
            }}
            sx={{
              minWidth: '32px',
              padding: '9px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              background: theme?.palette?.background?.secondary,
            }}
          >
            <Visibility sx={{ fontSize: '14px' }} />
          </Button>
          <Button
            onClick={() => {
              setRowId(row?._id);
              setIsConfirmModal(true);
            }}
            sx={{
              minWidth: '32px',
              padding: '9px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              background: theme?.palette?.background?.secondary,
            }}
          >
            <Delete sx={{ fontSize: '14px' }} />
          </Button>
        </Stack>
      ),
    },
  ];
  return (
    <Box
      sx={{
        padding: '7.5px 16px  2px',
        maxHeight: '480px',
        overflow: 'auto',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
      }}
    >
      <StyledTable
        columns={allColumns.filter((col) => col?.showFor?.includes(type))}
        rows={data || []}
        getRowId={(row) => row?._id}
        rowHeight={72}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'pointer',
          },
          //   '& .MuiDataGrid-row:hover': {
          //     backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
          //   },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {loading ? 'Loading...' : 'No Banner Found'}
            </Stack>
          ),
        }}
      />

      <ConfirmModal
        message="Are you sure you want to delete this banner?"
        isOpen={isConfirmModal}
        loading={deleteQuery?.isLoading}
        onCancel={() => {
          setIsConfirmModal(false);
          //   setCurrentDocumet({});
        }}
        onConfirm={() => {
          // setIsConfirmModal(false);
          deleteQuery.mutate({ id: rowId });
          //   removeDocument(currentDocumet);
        }}
      />
    </Box>
  );
}

export default AddBannerTable;
