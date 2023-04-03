// thrid pary
import { Avatar, Box, Chip, Drawer, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import StyledTable4 from '../../../components/Styled/StyledTable4';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu2';
import AddContainer from '../AddContainer';
import { deals } from '../mock';

const statusColorVariants = {
  inactive: {
    background: '#FEE2E2',
    color: '#DD5B63',
  },
  active: {
    background: '#e1f4d0',
    color: '#56ca00',
  },
};

const menuItems = [
  {
    label: 'Edit container',
    value: 'edit',
  },
  {
    label: 'Set Active',
    value: 'active',
  },
  {
    label: 'Delete',
    value: 'delete',
    sx: {
      color: '#DD5B63',

      '&:hover': {
        background: '#FEE2E2',
      },
    },
  },
];

export default function ListTable({ items }) {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // three dot handler
  const handleMenuClick = (menu) => {
    if (menu === 'edit') {
      setSidebarOpen(true);
    }
  };

  const allColumns = [
    {
      id: 1,
      headerName: `NAME`,
      sortable: false,
      field: 'product',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={4}>
          <HandleIcon className="drag-handler" />
          <Avatar src={params.row.bannerImage} alt={params.row.name} variant="rounded" sx={{ width: 36, height: 36 }} />
          <Typography
            variant="body4"
            sx={{
              color: theme.palette.text.primary,
              paddingLeft: '5px',
            }}
          >
            {params.row.name}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `ITEM`,
      sortable: false,
      field: 'type',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Typography
          variant="body4"
          sx={{
            color: theme.palette.text.primary,
            paddingLeft: '5px',
          }}
        >
          {params.row.type.join(' ')}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: `STATUS`,
      sortable: false,
      field: 'status',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Chip
          className="text-capitalize"
          label={params?.row?.status || ''}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            ...(statusColorVariants[params?.row?.status] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      id: 4,
      headerName: `DATE`,
      sortable: false,
      field: 'date',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Typography
          variant="body4"
          sx={{
            color: theme.palette.text.primary,
            paddingLeft: '5px',
          }}
        >
          {params.row.date}
        </Typography>
      ),
    },
    {
      id: 5,
      headerName: `ACTION`,
      sortable: false,
      field: 'action',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: () => <ThreeDotsMenu handleMenuClick={handleMenuClick} menuItems={menuItems} />,
    },
  ];

  return (
    <>
      <Box pb={5}></Box>
      <StyledTable4 columns={allColumns} rows={items} getRowKey={(row) => row?.id} />
      <Drawer anchor="right" open={sidebarOpen}>
        <AddContainer
          deals={deals}
          onClose={() => {
            setSidebarOpen(false);
          }}
        />
      </Drawer>
    </>
  );
}
