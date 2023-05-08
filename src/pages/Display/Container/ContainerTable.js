// thrid party
import { Edit, Visibility } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Box, Chip, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import StyledTable4 from '../../../components/Styled/StyledTable4';

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

// const menuItems = [
//   {
//     label: 'Edit container',
//     value: 'edit',
//   },
//   {
//     label: 'Set Active',
//     value: 'status',
//   },
//   {
//     label: 'Delete',
//     value: 'delete',
//     sx: {
//       color: '#DD5B63',

//       '&:hover': {
//         background: '#FEE2E2',
//       },
//     },
//   },
// ];

const typeLabels = {
  deal: 'Deal',
  tag: 'Tag',
  shop: 'Shop',
};

export default function ContainerTable({
  items,
  loading,
  onViewShops,
  onDrop,
  containerType,
  minWidth,
  onStatusChange,
  onDelete,
  onEdit,
}) {
  const theme = useTheme();

  const allColumns = [
    {
      id: 1,
      headerName: `NAME`,
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={4}>
          <HandleIcon className="drag-handler" />
          {containerType === 'list' && (
            <Avatar src={params.row?.image} alt={params.row.name} variant="rounded" sx={{ width: 36, height: 36 }} />
          )}
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
        // <ThreeDotsMenu
        //   handleMenuClick={(menu) => {
        //     handleMenuClick(menu, params.row);
        //   }}
        //   menuItems={menuItems.map((item) => {
        //     if (item.value === 'status') {
        //       return {
        //         value: 'status',
        //         label: `Set ${params?.row?.status === 'active' ? 'Inactive' : 'Active'}`,
        //       };
        //     }
        //     return item;
        //   })}
        // />
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {/* visbility */}
          <StyledSwitch
            console={console.log(params.row)}
            checked={params?.row?.status === 'active'}
            onChange={() => {
              onStatusChange(params.row);
            }}
          />
          {/* shops */}
          <StyledIconButton
            color="primary"
            sx={{
              marginLeft: '17px',
            }}
            onClick={() => {
              onViewShops(params.row);
            }}
          >
            <Visibility />
          </StyledIconButton>
          {/* delete */}
          <StyledIconButton
            color="primary"
            onClick={() => {
              onDelete(params.row);
            }}
          >
            <DeleteIcon />
          </StyledIconButton>
          {/* edit */}
          <StyledIconButton
            onClick={() => {
              onEdit(params.row);
            }}
            color="primary"
          >
            <Edit />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  const typeColumn = {
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
        {params.row?.type?.map((item, index, array) => `${typeLabels[item]}${index === array.length - 1 ? '' : ', '}`)}
      </Typography>
    ),
  };

  if (containerType === 'list') {
    allColumns.splice(1, 0, typeColumn);
  }

  return (
    <Box
      sx={{
        overflowX: 'scroll',
      }}
    >
      <Box position="relative" minWidth={minWidth}>
        {loading && <LoadingOverlay />}
        <StyledTable4
          columns={allColumns}
          rows={items}
          getRowKey={(row) => row?._id}
          noRowsMessage={loading ? 'Loading ...' : 'No List Containers'}
          onDrop={onDrop}
        />
      </Box>
    </Box>
  );
}
