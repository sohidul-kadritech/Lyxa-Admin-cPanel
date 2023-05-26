import { Edit, Visibility } from '@mui/icons-material';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import Rating from '../../components/Common/Rating';
import UserAvatar from '../../components/Common/UserAvatar';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';
import StyledBox from '../../components/StyledCharts/StyledBox';
import { statusColorVariants } from './helper';

export default function RidersTable({ rows = [], onSelect }) {
  const columns = [
    {
      id: 1,
      headerName: `RIDER`,
      sortable: false,
      field: 'invoiceId',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => <UserAvatar name={row?.name} imgStyle="circular" subTitle={row?.autoGenId} />,
    },
    {
      id: 2,
      headerName: `SHOP`,
      sortable: false,
      field: 'shift',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 3,
      headerName: `RATING`,
      sortable: false,
      field: 'rating',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Rating amount={value} status="positive" />,
    },
    {
      id: 4,
      headerName: `ORDERS`,
      sortable: false,
      field: 'orders',
      flex: 1.5,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      headerName: `STATUS`,
      sortable: false,
      field: 'status',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <Chip
          label={row?.status}
          sx={{
            height: 'auto',
            padding: '12px 23px',
            borderRadius: '40px',
            textTransform: 'capitalize',
            ...(statusColorVariants[row?.status] || {}),
          }}
          variant="contained"
        />
      ),
    },
    {
      id: 4,
      headerName: ``,
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: () => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap="10px">
          <StyledIconButton color="primary" onClick={() => {}}>
            <LocationIcon />
          </StyledIconButton>
          <StyledIconButton onClick={() => {}} color="primary">
            <Edit />
          </StyledIconButton>
          <StyledIconButton color="primary" onClick={() => {}}>
            <Visibility />
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
        overflowX: 'auto',
        scrollbarWidth: 'thin',
        scrollbarHeight: 'thin',

        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
      }}
    >
      <Box
        sx={{
          minWidth: '1070px',
        }}
      >
        <StyledTable
          autoHeight
          columns={columns}
          getRowId={(row) => row?._id}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
          onRowClick={onSelect}
          rows={rows}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Coupon found
              </Stack>
            ),
          }}
        />
      </Box>
    </StyledBox>
  );
}
