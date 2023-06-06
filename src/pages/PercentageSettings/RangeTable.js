import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../context';

function RangeTable({ data = [], setSelectedRange, setIsConfirm }) {
  const { general } = useGlobalContext();
  const { currency } = general;
  console.log('currency', currency);
  const columns = [
    {
      id: 1,
      headerName: 'RANGE FROM',
      field: 'from',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.from} KM
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: 'RANGE TO',
      field: 'to',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.to} KM
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'LYXA CHARGE',
      field: 'charge',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {`${currency?.code} ${row?.charge}`}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: 'RIDER CUT',
      field: 'deliveryPersonCut',
      flex: 1,
      minWidth: 200,
      sortable: false,
      // eslint-disable-next-line no-unused-vars
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {`${currency?.code} ${row?.deliveryPersonCut}`}
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: 'ACTION',
      headerAlign: 'right',
      align: 'right',
      field: 'action',
      flex: 1,
      minWidth: 200,
      sortable: false,
      // eslint-disable-next-line no-unused-vars
      renderCell: (params) => (
        <StyledIconButton
          color="primary"
          // disabled={params?.row?.isNotEditable}
          sx={{
            '&.Mui-disabled': {
              color: '#c1c1c1',
              backgroundColor: '#F3F6F9',
            },
          }}
          onClick={() => {
            setSelectedRange(params.row);
            setIsConfirm(true);
          }}
        >
          <DeleteIcon />
        </StyledIconButton>
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
      <StyledTable
        columns={columns}
        rows={data}
        getRowId={(row) => row?._id}
        rowHeight={71}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No range found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default RangeTable;
