import { Box, Button, Stack, Typography, useTheme } from '@mui/material';

import { Edit, Visibility } from '@mui/icons-material';
import moment from 'moment';
import StyledTable from '../../../components/Styled/StyledTable3';

function DefaultChatTable({ data, loading, setRowData, setOpen, setIsEdit, setIsReadOnly }) {
  const theme = useTheme();
  const allColumns = [
    {
      id: 1,
      headerName: `MESSAGE`,
      field: 'message',
      sortable: false,
      flex: 3,
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
            {row?.message}
          </Typography>
        </Stack>
      ),
    },

    {
      id: 2,
      headerName: `CREATION DATE`,
      field: 'date',
      sortable: false,
      flex: 1.5,
      renderCell: ({ row }) => (
        <Stack gap={1.5} padding="16px 0px">
          <Typography variant="body4">{moment(row?.createdAt)?.format('MMM DD, YYYY')}</Typography>
          <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
            {moment(row?.createdAt)?.format('hh:mm A')}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 4,
      headerName: ``,
      field: 'action',
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      flex: 1.5,
      renderCell: ({ row }) => (
        <Stack flexDirection="row" gap="16px">
          <Button
            sx={{
              minWidth: '32px',
              padding: '9px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              background: theme?.palette?.background?.secondary,
            }}
            onClick={() => {
              console.log(row);
              setRowData(row);
              setOpen(() => {
                setIsEdit(true);
                return true;
              });
            }}
          >
            <Edit sx={{ fontSize: '14px' }} />
          </Button>

          <Button
            onClick={() => {
              setOpen(() => {
                setRowData(row);
                setIsReadOnly(true);
                return true;
              });
            }}
            sx={{
              minWidth: '32px',
              padding: '9px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              background: theme?.palette?.background?.secondary,
            }}
          >
            <Visibility sx={{ fontSize: '14px' }} />
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          padding: '7.5px 16px  2px',
          maxHeight: '480px',
          overflow: 'auto',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
        }}
      >
        <StyledTable
          columns={allColumns}
          rows={data || []}
          getRowId={(row) => row?._id}
          //   rowHeight={72}
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: 'pointer',
            },
            //   '& .MuiDataGrid-row:hover': {
            //     backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
            //   },
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {loading ? 'Loading...' : 'No Message Found'}
              </Stack>
            ),
          }}
        />
      </Box>
    </Box>
  );
}

export default DefaultChatTable;
