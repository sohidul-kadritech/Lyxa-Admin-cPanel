import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack, Typography } from '@mui/material';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';

export default function UserTable({ rows, onEdit }) {
  const columns = [
    {
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
          >
            <Edit />
          </StyledIconButton>
          {/* delete */}
          <StyledIconButton
            color="primary"
            disabled={params?.row?.isParentUser}
            sx={{
              '&.Mui-disabled': {
                color: '#c1c1c1',
                backgroundColor: '#F3F6F9',
              },
            }}
            onClick={() => {
              // onDelete(params.row);
            }}
          >
            <DeleteIcon />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  return (
    <StyledBox padding>
      <StyledTable
        autoHeight
        columns={columns}
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
