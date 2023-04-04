// thrid pary
import { Avatar, Box, Chip, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import StyledTable4 from '../../../components/Styled/StyledTable4';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu2';

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

export default function ListTable({ items, loading, handleMenuClick, onDrop }) {
  const theme = useTheme();

  const allColumns = [
    {
      id: 1,
      headerName: `NAME`,
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={4}>
          <HandleIcon className="drag-handler" />
          <Avatar src={params.row?.image} alt={params.row.name} variant="rounded" sx={{ width: 36, height: 36 }} />
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body4"
          sx={{
            color: theme.palette.text.primary,
            paddingLeft: '5px',
          }}
        >
          {new Date(params.row?.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: 5,
      headerName: `ACTION`,
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <ThreeDotsMenu
          handleMenuClick={(menu) => {
            handleMenuClick(menu, params.row);
          }}
          menuItems={menuItems}
        />
      ),
    },
  ];

  return (
    <Box position="relative">
      {loading && <LoadingOverlay />}
      <StyledTable4
        columns={allColumns}
        rows={items}
        getRowKey={(row) => row?._id}
        noRowsMessage={loading ? 'Loading ...' : 'No List Containers'}
        onDrop={onDrop}
      />
    </Box>
  );
}
