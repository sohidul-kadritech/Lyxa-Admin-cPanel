import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { ReactComponent as MediaCloudIcon } from '../../assets/icons/media-cloud-icon.svg';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';

function RequestedAreaTable({ areas = [], setCurrentArea, setIsSinglePoint, setOpen, setZoomLevel }) {
  // const theme = useTheme();
  const allColumn = [
    {
      id: 1,
      headerName: `CUSTOMER TYPE`,
      field: 'customer_type',
      flex: 3,
      minWidth: '100%',
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.user && row?.user?.orderCompleted > 0 ? 'Repeated' : 'New'}</Typography>
      ),
    },
    {
      id: 2,
      headerName: `Area`,
      field: 'address',
      flex: 3,
      minWidth: '100%',
      renderCell: ({ row }) => (
        // console.log('params: ', row);
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row?.address || ''}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: `CITY`,
      field: 'city',
      flex: 3,
      minWidth: '100%',
      renderCell: ({ row }) => (
        // console.log('params: ', row);
        <Typography variant="body2">{row?.city || row?.state || 'No city'}</Typography>
      ),
    },
    {
      id: 4,
      headerName: `DATE`,
      field: 'createdAt',
      flex: 3,
      minWidth: '100%',
      renderCell: ({ row }) => {
        console.log('params: ', row);
        return (
          // console.log('params: ', row);
          <Typography variant="body2">{moment(`${row?.createdAt}`).format('MMMM D, YYYY') || ''}</Typography>
        );
      },
    },
    {
      id: 5,
      headerName: `Action`,
      field: 'action',
      flex: 1,
      minWidth: '100%',
      renderCell: ({ row }) => {
        console.log('params: ', row);
        return (
          <StyledIconButton
            color="primary"
            // disabled={params?.row?.isNotEditable}
            sx={{
              '&.Mui-disabled': {
                color: '#c1c1c1',
                backgroundColor: '#F3F6F9',
              },
            }}
            onClick={() => {
              setCurrentArea([row]);
              setZoomLevel(13);
              setOpen(true);
              setIsSinglePoint(true);
            }}
          >
            <MediaCloudIcon />
          </StyledIconButton>
        );
      },
    },
  ];
  return (
    <Box>
      <StyledTable
        columns={allColumn}
        rows={areas}
        getRowId={(row) => row?._id}
        rowHeight={71}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'default',
          },
          width: '100%',
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default RequestedAreaTable;
