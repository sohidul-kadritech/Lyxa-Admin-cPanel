import { Box, Chip, Stack, Typography } from '@mui/material';
import React from 'react';
import { ReactComponent as HandleIcon } from '../../assets/icons/handle.svg';
import TableLoader from '../../components/Common/TableLoader';
import StyledTable4 from '../../components/Styled/StyledTable4';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
// eslint-disable-next-line no-unused-vars
function ReasonTable({ items, loading, threeDotHandler, onDrop }) {
  const allColumns = [
    {
      id: 1,
      headerName: `Reason`,
      flex: 1.5,
      renderCell: (params) => {
        console.log('params: ', params);
        return (
          <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
            <HandleIcon className="drag-handler" />
            <Typography
              variant="body1"
              style={{
                margin: '0 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textTransform: 'capitalize',
                width: '100%',
              }}
            >
              {params?.row?.name}
            </Typography>
          </Stack>
        );
      },
    },
    {
      id: 2,
      headerName: `Status`,
      flex: 1,
      renderCell: ({ row }) => (
        <Chip
          label={row?.status === 'active' ? 'Active' : 'Inactive'}
          sx={
            row?.status === 'active'
              ? { background: '#e1f4d0', color: '#56ca00' }
              : { background: '#ffcfce', color: '#ff0000' }
          }
          variant="contained"
        />
      ),
    },
    {
      id: 3,
      field: 'createdAt',
      headerName: 'Created',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        console.log('status: ', row?.createdAt);
        return <Typography variant="body1">{new Date(row?.createdAt || undefined).toLocaleDateString()}</Typography>;
      },
    },
    {
      id: 4,
      field: 'action',
      headerName: 'Action',
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      flex: 1,
      minWidth: 100,
      // eslint-disable-next-line no-unused-vars
      renderCell: (params) => (
        <ThreeDotsMenu
          menuItems={['Edit', 'Delete']}
          handleMenuClick={(menu) => {
            threeDotHandler(menu, params?.row);
          }}
        />
      ),
    },
  ];
  return (
    <Box paddingBottom="40px">
      <StyledTable4
        columns={allColumns}
        rows={items}
        onDrop={onDrop}
        getRowKey={(row) => row?._id}
        //   onDrop={onDrop}
        noRowsMessage={loading ? <TableLoader /> : 'No Q&A Found'}
      />
    </Box>
  );
}

export default ReasonTable;
