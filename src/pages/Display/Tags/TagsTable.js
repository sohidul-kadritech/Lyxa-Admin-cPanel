// thrid pary
import { Edit, Visibility } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';

// project import
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import FilterSelect from '../../../components/Filter/FilterSelect';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import StyledTable4 from '../../../components/Styled/StyledTable4';

const listFilterOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

export default function TagsTable({
  items,
  onEdit,
  onDrop,
  onStatusChange,
  onViewShops,
  onVisibilityChange,
  loading,
  shopType,
  onDelete,
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
          {shopType === 'food' && (
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
      id: 2,
      headerName: `STATUS`,
      flex: 1,
      renderCell: (params) => (
        <FilterSelect
          items={listFilterOptions}
          sx={{
            background: params?.row?.status === 'active' ? '#DCFCE7' : '#FEE2E2',
            '&:hover': {
              background: params?.row?.status === 'active' ? '#DCFCE7' : '#FEE2E2',
            },
            '& .MuiInputBase-input': {
              color: params?.row?.status === 'active' ? '#417C45' : '#DD5B63',
            },
            '& .MuiSelect-icon': {
              color: params?.row?.status === 'active' ? '#417C45' : '#DD5B63',
            },
          }}
          size="lg1"
          value={params?.row?.status || ''}
          onChange={(e) => {
            onStatusChange(e.target.value, params.row);
          }}
        />
      ),
    },
    {
      id: 4,
      headerName: `ACTION`,
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {/* visbility */}
          <StyledSwitch
            checked={params?.row?.visibility}
            onChange={(e) => {
              onVisibilityChange(e.target.checked, params.row);
            }}
          />
          {/* shops */}
          <StyledIconButton
            color="secondary"
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
            color="secondary"
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
            color="secondary"
          >
            <Edit />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  const typeColumn = {
    id: 3,
    headerName: `TYPE`,
    flex: 1,
    renderCell: (params) => (
      <Typography
        variant="body4"
        className="text-capitalize"
        sx={{
          color: theme.palette.text.primary,
          paddingLeft: '5px',
        }}
      >
        {params.row.type}
      </Typography>
    ),
  };

  if (shopType === 'food') {
    allColumns.splice(2, 0, typeColumn);
  }

  return (
    <Box position="relative">
      {loading && <LoadingOverlay />}
      <StyledTable4
        columns={allColumns}
        rows={items}
        getRowKey={(row) => row?._id}
        onDrop={onDrop}
        noRowsMessage={loading ? 'Loading ...' : 'No Tags or Cuisines'}
      />
    </Box>
  );
}
