import { Typography } from '@mui/material';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon.svg';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../Styled/StyledIconButton';
import StyledTable from '../../Styled/StyledTable3';

export default function InvoiceTable({ rows }) {
  const columns = [
    {
      id: 1,
      headerName: `INVOICE ID`,
      sortable: false,
      field: 'invoiceId',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => <Typography>{params?.row?.invoiceId}</Typography>,
    },
    {
      id: 2,
      headerName: `STATUS`,
      sortable: false,
      field: 'status',
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
      headerName: `DATE ISSUED`,
      sortable: false,
      field: 'createdAt',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
    },
    {
      id: 5,
      headerName: `DUE DATE`,
      sortable: false,
      field: 'deadline',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
    },
    {
      id: 6,
      headerName: `ACTIONS`,
      sortable: false,
      field: 'action',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: () => (
        <StyledIconButton color="primary">
          <DownloadIcon
            style={{
              color: 'red',
            }}
          />
        </StyledIconButton>
      ),
    },
  ];

  return <StyledTable getRowId={(row) => row?._id} columns={columns} rows={rows} />;
}
