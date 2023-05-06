/* eslint-disable import/no-named-as-default */
// project import
import { Typography } from '@mui/material';
import StyledIconButton from '../../../../../components/Styled/StyledIconButton';
import StyledTable from '../../../../../components/Styled/StyledTable3';

// third party

export default function CouponTable({ rows = [] }) {
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
      renderCell: () => <StyledIconButton color="primary">a</StyledIconButton>,
    },
  ];

  return <StyledTable columns={columns} rows={rows} />;
}
