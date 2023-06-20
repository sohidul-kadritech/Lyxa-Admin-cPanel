import { Stack, Typography } from '@mui/material';
import moment from 'moment';

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
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row?.type}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 2,
    headerName: `OLD VALUE`,
    field: 'old_value',
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
          {getValue(row?.type, row?.oldValue)}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 3,
    headerName: `NEW VALUE`,
    field: 'new_value',
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
          {getValue(row?.type, row?.newValue)}
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
      <Stack gap={1.5}>
        <Typography variant="body4">{moment(row?.createdAt)?.format('MMM DD, YYYY')}</Typography>
        <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
          {moment(row?.createdAt)?.format('hh:mm A')}
        </Typography>
      </Stack>
    ),
  },
];

const getValueFromObject = (data) => {
  let newData = 0;
  if (typeof data === 'object' && Array.isArray(data) && typeof data[0] !== 'object') {
    newData = (
      <Stack gap="4px" padding="8px 0px">
        {data.map((item) => (
          <Typography variant="body4" key={item}>
            {item}
          </Typography>
        ))}
      </Stack>
    );
  }

  if (typeof data === 'object') {
    newData = (
      <Stack gap="4px" padding="8px 0px">
        {Object.entries(data).map(([key, val]) => {
          if (key !== '_id') {
            return (
              <Typography key={key}>
                {key}: {val}
              </Typography>
            );
          }
          return (
            <Typography key={key}>
              {key}: {val}
            </Typography>
          );
        })}
      </Stack>
    );
  }

  return newData || 0;
};
export const getNewValue = (type, data) => {
  console.log('type', type, 'type-->', typeof data, 'is Array', Array.isArray(data));

  return getValueFromObject(data);
};
