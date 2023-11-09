import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack, Typography } from '@mui/material';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';

const getUserType = {
  credentialUser: 'Credential User',
  shopOrderManager: 'Shop Order Manager',
};

export default function UserTable({ rows, onEdit, onDelete, loading, showFor }) {
  console.log({ rows, showFor });
  const columns = [
    {
      showFor: ['shop', 'seller'],
      id: 1,
      headerName: `NAME`,
      sortable: false,
      field: 'name',
      flex: 2,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      showFor: ['shop'],
      id: 2,
      headerName: `USER TYPE`,
      sortable: false,
      field: 'credentialType',
      flex: 2,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Typography variant="body4">
          {row?.isParentUser ? 'Parent User' : getUserType[row?.credentialType] || 'Not set yet'}
        </Typography>
      ),
    },
    {
      showFor: ['shop', 'seller'],
      id: 2,
      headerName: `EMAIL`,
      sortable: false,
      field: 'email',
      flex: 2,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      showFor: ['shop', 'seller'],
      id: 3,
      headerName: `ACTION`,
      sortable: false,
      field: 'action',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          {/* edit */}
          <StyledIconButton
            onClick={() => {
              onEdit(params.row);
            }}
            color="primary"
            disabled={params?.row?.isNotEditable}
          >
            <Edit />
          </StyledIconButton>
          {/* delete */}
          <StyledIconButton
            color="primary"
            disabled={params?.row?.isNotDeletable}
            sx={{
              '&.Mui-disabled': {
                color: '#c1c1c1',
                backgroundColor: '#F3F6F9',
              },
            }}
            onClick={() => {
              onDelete(params.row);
            }}
          >
            <DeleteIcon />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  if (loading) return <TableSkeleton columns={['text', 'text', 'text']} rows={5} />;

  return (
    <StyledBox
      sx={{
        padding: '4px 14px',
      }}
    >
      <StyledTable
        autoHeight
        columns={columns?.filter((column) => column?.showFor?.includes(showFor))}
        getRowId={(row) => row?._id}
        rows={rows}
        rowHeight={71}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No User Found
            </Stack>
          ),
        }}
      />
    </StyledBox>
  );
}
