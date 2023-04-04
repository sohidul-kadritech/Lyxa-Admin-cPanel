// thrid pary
import { Edit, Visibility } from '@mui/icons-material';
import { Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as HandleIcon } from '../../../assets/icons/handle.svg';
import FilterSelect from '../../../components/Filter/FilterSelect';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import StyledTable4 from '../../../components/Styled/StyledTable4';

// const statusColorVariants = {
//   inactive: {
//     background: '#FEE2E2',
//     color: '#DD5B63',
//   },
//   active: {
//     background: '#e1f4d0',
//     color: '#56ca00',
//   },
// };

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

export default function TagsTable({ items, onEdit, onDrop, onStatusChange, onViewShops, onVisibilityChange }) {
  const theme = useTheme();

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
      align: 'left',
      headerAlign: 'left',
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
      id: 3,
      headerName: `TYPE`,
      sortable: false,
      field: 'type',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
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
    },
    {
      id: 4,
      headerName: `ACTION`,
      sortable: false,
      field: 'action',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          <StyledSwitch
            checked={params?.row?.visibility}
            onChange={(e) => {
              onVisibilityChange(e.target.checked, params.row);
            }}
          />
          <StyledIconButton
            color="secondary"
            sx={{
              marginLeft: '17px',
            }}
            onClick={() => {
              onViewShops();
            }}
          >
            <Visibility />
          </StyledIconButton>
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

  return <StyledTable4 columns={allColumns} rows={items} getRowKey={(row) => row?._id} onDrop={onDrop} />;
}
