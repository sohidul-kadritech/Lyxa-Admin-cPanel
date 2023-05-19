import { Box, Chip, Stack, Typography } from '@mui/material';
import React from 'react';
import StyledTable4 from '../../components/Styled/StyledTable4';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';

const getTypeValue = (type) => {
  switch (type) {
    case 'user':
      return 'User FAQ';

    case 'shop':
      return 'Shop FAQ';

    case 'deliveryBoy':
      return 'Rider FAQ';

    case 'accountSupport':
      return 'Account Support';

    case 'orderSupport':
      return 'Order Support';

    default:
      return '';
  }
};
function FaqTable({ items, loading = true }) {
  const allColumns = [
    {
      id: 1,
      headerName: `Q&A`,
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2}>
          <Typography variant="body1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            {params?.value}
          </Typography>
          <Typography
            variant="body3"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: '1.5' }}
          >
            {params?.row?.ans}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `Type`,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body1" className="text-capitalize">
          {getTypeValue(params?.value)}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: `Status`,
      flex: 1,
      renderCell: ({ value }) => (
        <Chip
          label={value === 'active' ? 'Active' : 'Inactive'}
          sx={
            value === 'active'
              ? { background: '#e1f4d0', color: '#56ca00' }
              : { background: '#ffcfce', color: '#ff0000' }
          }
          variant="contained"
        />
      ),
    },
    {
      id: 4,
      field: 'createdAt',
      headerName: 'Created',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Typography variant="body1">{new Date(value || undefined).toLocaleDateString()}</Typography>
      ),
    },
    {
      id: 5,
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
          //   handleMenuClick={(menu) => {
          //     threeDotHandler(menu, params?.row);
          //   }}
        />
      ),
    },
  ];
  console.log('Items; ', items);
  return (
    <Box>
      <StyledTable4
        columns={allColumns}
        rows={items}
        getRowKey={(row) => row?._id}
        //   onDrop={onDrop}
        noRowsMessage={loading ? 'Loading ...' : 'No Tags or Cuisines'}
      />
    </Box>
  );
}

export default FaqTable;
