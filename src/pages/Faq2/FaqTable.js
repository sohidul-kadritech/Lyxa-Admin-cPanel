import { Box, Chip, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { ReactComponent as HandleIcon } from '../../assets/icons/handle.svg';
import TableLoader from '../../components/Common/TableLoader';
import StyledTable4 from '../../components/Styled/StyledTable4';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import { getTypeValue } from './helpers';

//
function FaqTable({ items, faqLoading, threeDotHandler, supportReason, onDrop, setDataCounter, dataCounter }) {
  const allColumns = [
    {
      id: 1,
      headerName: `Q&A`,
      flex: 1.5,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <HandleIcon className="drag-handler" />
          <Box>
            <Typography variant="body1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
              {params?.row?.question}
            </Typography>
            <Typography
              variant="body3"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: '1.5' }}
            >
              {params?.row?.ans || params?.row?.answer}
            </Typography>
          </Box>
        </Stack>
      ),
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
          menuItems={['View', 'Edit', 'Delete']}
          handleMenuClick={(menu) => {
            threeDotHandler(menu, params?.row);
          }}
        />
      ),
    },
  ];

  const typeColumn = {
    id: 5,
    headerName: `TYPE`,
    flex: 1,
    renderCell: (params) => (
      <Typography variant="body1" className="text-capitalize">
        {getTypeValue(params.row.type)}
      </Typography>
    ),
  };

  // const newColumns = [];
  if (supportReason?.type === 'faq') {
    allColumns.splice(1, 0, typeColumn);
  }

  useEffect(() => {
    const oldDataCounter = dataCounter;
    oldDataCounter[supportReason?.type] = items?.length;
    console.log('oldDataCounter: ', oldDataCounter);
    setDataCounter({ ...oldDataCounter });
  }, [supportReason?.type]);

  return (
    <Box>
      <StyledTable4
        columns={allColumns}
        rows={items}
        getRowKey={(row) => row?._id}
        onDrop={onDrop}
        noRowsMessage={faqLoading ? <TableLoader /> : 'No Q&A Found'}
      />
    </Box>
  );
}

export default FaqTable;
