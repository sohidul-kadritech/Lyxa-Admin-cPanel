/* eslint-disable no-unused-vars */
import { Stack, Typography } from '@mui/material';
import React from 'react';
import Header from './Header';
import Rows from './Rows';

const templateRow = [
  {
    _id: 121321,
    name: 'abc',
    roll: '123213',
    school: 'chhagalnaiya academy',
    college: 'moulavi samsul karim college',
  },
  {
    id: 1213498,
    name: 'sohidul',
    roll: '123213',
    school: 'chhagalnaiya academy',
    college: 'moulavi samsul karim college',
  },
  {
    id: 1213498,
    name: 'sohidul',
    roll: '123213',
    school: 'chhagalnaiya academy',
    college: 'moulavi samsul karim college',
  },
  {
    id: 1213498,
    name: 'sohidul',
    roll: '123213',
    school: 'chhagalnaiya academy',
    college: 'moulavi samsul karim college',
  },
];

const templateColumn = [
  {
    id: 1,
    headerName: 'ACCOUNT',
    field: 'name',
    flex: 1.5,
    sortable: false,
    minWidth: 240,
    isExpandable: true,
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    id: 2,
    headerName: 'TYPE',
    field: 'account',
    flex: 1.5,
    sortable: false,
    minWidth: 240,
    renderCell: <Typography>Hello</Typography>,
  },
  {
    id: 3,
    headerName: 'SHOP',
    field: 'table',
    flex: 1.5,
    sortable: false,
    minWidth: 240,
    renderCell: <Typography>Hello</Typography>,
  },
  {
    id: 3,
    headerName: 'PAYMENT METHODS',
    field: 'table',
    flex: 1.5,
    sortable: false,
    minWidth: 240,
    renderCell: <Typography>Hello</Typography>,
  },
  {
    id: 3,
    headerName: 'DATE',
    field: 'table',
    flex: 1.5,
    sortable: false,
    minWidth: 240,
    renderCell: <Typography>Hello</Typography>,
  },
  {
    id: 3,
    headerName: 'ORDER AMOUNT',
    field: 'table',
    flex: 1.5,
    sortable: false,
    renderCell: <Typography>Hello</Typography>,
  },
  {
    id: 3,
    headerName: 'ORDER RATING',
    field: 'table',
    flex: 1.5,
    sortable: false,
    renderCell: ({ row, onExpandHandler }) => (
      <Typography
        onClick={() => {
          onExpandHandler(<Typography>Order rating</Typography>);
        }}
      >
        Hello
      </Typography>
    ),
  },
  {
    id: 3,
    headerName: 'RIDER RATING',
    field: 'table',
    flex: 1.5,
    sortable: false,
    renderCell: 'Hello',
  },
  {
    id: 3,
    headerName: 'ACTION',
    field: 'table',
    flex: 1.5,
    sortable: false,
    headerAlign: 'right',
    align: 'right',
    renderCell: <Typography>Hello</Typography>,
    expandWithCellClick: ({ row }) => <Typography>Clicked on action cell</Typography>,
  },
];

function StyledTable5({
  expandWithRowClick,
  columns,
  rows,
  NoRowsOverlay,
  showHeader = true,
  rowSx,
  rowInnerContainerSx,
}) {
  return (
    <Stack sx={{ background: '#fff', width: '100%', paddingBottom: '12px' }}>
      {showHeader && <Header columns={columns} />}
      <Rows
        columns={columns}
        rows={rows}
        expandWithRowClick={expandWithRowClick}
        NoRowsOverlay={NoRowsOverlay}
        rowSx={rowSx}
        rowInnerContainerSx={rowInnerContainerSx}
      />
    </Stack>
  );
}

export default StyledTable5;
