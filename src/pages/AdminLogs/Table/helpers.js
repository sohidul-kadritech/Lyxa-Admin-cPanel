import { Stack, Typography } from '@mui/material';
import moment from 'moment';
import { getTypeName } from '../helpers';

export const allColumns = (getValue) => [
  {
    id: 1,
    headerName: `TYPE`,
    field: 'type',
    sortable: false,
    flex: 1,
    renderCell: ({ row }) => (
      <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
        <Typography
          variant="body4"
          sx={{
            fontSize: '15px',
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {getTypeName(row?.type)}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 2,
    headerName: `OLD VALUE`,
    field: 'old_value',
    sortable: false,
    flex: 1.5,
    renderCell: ({ row }) => (
      <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
        <Typography
          variant="body4"
          sx={{
            fontSize: '15px',
            fontWeight: '500',
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row?.type === 'specificSellerDropCharge'
            ? getValue(row?.type, { ...row, value: row?.oldValue, seller: undefined })
            : getValue(row?.type, row?.oldValue)}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 3,
    headerName: `NEW VALUE`,
    field: 'new_value',
    sortable: false,
    flex: 1.5,
    renderCell: ({ row }) => (
      <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
        <Typography
          variant="body4"
          sx={{
            fontSize: '15px',
            fontWeight: '500',
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row?.type === 'specificSellerDropCharge'
            ? getValue(row?.type, { ...row, value: row?.newValue })
            : getValue(row?.type, row?.newValue)}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 3,
    headerName: `ADMIN`,
    field: 'admin_name',
    sortable: false,
    flex: 1,
    renderCell: ({ row }) => (
      <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
        <Typography
          variant="body4"
          sx={{
            fontSize: '15px',
            fontWeight: '500',
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row?.admin?.name}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 4,
    headerName: `CREATION DATE`,
    field: 'date',
    sortable: false,
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ({ row }) => (
      <Stack gap={1.5} sx={{ padding: '16px 0px' }}>
        <Typography variant="body4">{moment(row?.createdAt)?.format('MMM DD, YYYY')}</Typography>
        <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
          {moment(row?.createdAt)?.format('hh:mm A')}
        </Typography>
      </Stack>
    ),
  },
];
