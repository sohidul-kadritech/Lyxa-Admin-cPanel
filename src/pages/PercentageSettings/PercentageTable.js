import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../components/Styled/StyledIconButton';
import StyledTable from '../../components/Styled/StyledTable3';

function PercentageTable({ data = [], setSelectedRange, setIsConfirm }) {
  const columns = [
    {
      id: 1,
      headerName: 'SELLER',
      field: 'name',
      flex: 1,
      //   minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.name}
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: 'CHARGE TYPE',
      field: 'chargeType',
      flex: 1,
      //   minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.dropPercentageType}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'CHARGE',
      field: 'charge',
      flex: 1,
      //   minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography variant="body4" className="text-capitalize">
          {row?.dropPercentage}
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
      //   minWidth: 200,
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
            setSelectedRange(params?.row);
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
              No Order found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default PercentageTable;
