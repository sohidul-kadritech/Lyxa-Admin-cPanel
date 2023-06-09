import { Visibility } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon.svg';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledTable from '../../../components/Styled/StyledTable3';

export default function InvoiceTable({ rows }) {
  const columns = [
    {
      id: 1,
      headerName: `DATE ISSUED`,
      sortable: false,
      field: 'createdAt',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
    },
    {
      id: 3,
      headerName: `DUE DATE`,
      sortable: false,
      field: 'deadline',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
    },
    {
      id: 3,
      headerName: `AMOUNT`,
      sortable: false,
      field: 'amount',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
    },
    {
      id: 4,
      headerName: `ACTIONS`,
      sortable: false,
      field: 'action',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: () => (
        <Stack direction="row" alignItems="center" gap={2}>
          <StyledIconButton
            color="primary"
            sx={{
              width: 'auto',
              fontSize: '14px',
              textTransform: 'uppercase',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            Pay
          </StyledIconButton>
          <StyledIconButton color="primary">
            <DownloadIcon />
          </StyledIconButton>
          <StyledIconButton color="primary">
            <Visibility />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box
      sx={{
        pr: 5,
        pl: 3.5,
        pt: 1,
        pb: 1,
        border: '1px solid #EEEEEE',
        borderRadius: '7px',
        background: '#fff',
      }}
    >
      <StyledTable getRowId={(row) => row?._id} columns={columns} rows={rows} getRowHeight={() => 71} />
    </Box>
  );
}
