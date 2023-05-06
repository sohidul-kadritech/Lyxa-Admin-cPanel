/* eslint-disable import/no-named-as-default */
// project import
import { Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Stack, Typography } from '@mui/material';
import StyledIconButton from '../../../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../../../components/Styled/StyledSwitch';
import StyledTable from '../../../../../components/Styled/StyledTable3';
import StyledBox from '../../../../../components/StyledCharts/StyledBox';

export default function CouponTable({ rows = [] }) {
  const columns = [
    {
      id: 1,
      headerName: `COUPON`,
      sortable: false,
      field: 'invoiceId',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => <Typography variant="body4">{row?.couponName}</Typography>,
    },
    {
      id: 2,
      headerName: `DURATION`,
      sortable: false,
      field: 'status',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
    },
    {
      id: 3,
      headerName: `MIN ORDER`,
      sortable: false,
      field: 'couponMinimumOrderValue',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value ? `$${value}` : '_'}</Typography>,
    },
    {
      id: 4,
      headerName: `ORDER LIMIT`,
      sortable: false,
      field: 'couponOrderLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value || '_'}</Typography>,
    },
    {
      id: 5,
      headerName: `AMOUNT LIMIT`,
      sortable: false,
      field: 'couponAmountLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value ? `$${value}` : '_'}</Typography>,
    },
    {
      id: 6,
      headerName: `USER LIMIT`,
      sortable: false,
      field: 'couponUserLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value || '_'}</Typography>,
    },
    {
      id: 7,
      headerName: ``,
      sortable: false,
      field: 'action',
      flex: 0.9,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
          <StyledSwitch checked={params?.row?.couponStatus === 'active'} onChange={() => {}} />
          <StyledIconButton color="primary" onClick={() => {}}>
            <CloseIcon />
          </StyledIconButton>
          <StyledIconButton onClick={() => {}} color="primary">
            <Edit />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  return (
    <StyledBox
      padding
      sx={{
        paddingTop: '3px',
        paddingBottom: '10px',
      }}
    >
      <StyledTable autoHeight columns={columns} getRowId={(row) => row?._id} rows={rows} />
    </StyledBox>
  );
}
