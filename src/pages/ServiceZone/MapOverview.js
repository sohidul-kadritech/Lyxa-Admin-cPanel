import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import AppPagination from '../../components/Common/AppPagination2';
import StyledTable from '../../components/Styled/StyledTable3';
import { colorList } from './helper';

function MapOverview({ setIsSideBarOpen }) {
  const [pageNo, setPageNo] = useState(1);
  const theme = useTheme();
  const allZones = [
    {
      _id: 1,
      zoneName: 'Zone A',
      customers: '24',
      orders: '24',
      riders: '24',
      store: '24',
    },
    {
      _id: 2,
      zoneName: 'Zone A',
      customers: '24',
      orders: '24',
      riders: '24',
      store: '24',
    },
  ];

  const columns = [
    {
      id: 0,
      headerName: 'ZONES',
      field: 'zoneName',
      sortable: false,
      density: 'comfortable',
      flex: 1,
      // minWidth: 270,
      renderCell: (value) => {
        console.log('value: ', value);
        return (
          <Stack flexDirection="row" alignItems="center" gap="10px">
            <Box
              sx={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: `${colorList[value.row._id % 50]}`,
              }}
            ></Box>{' '}
            <Typography sx={{ color: theme.palette.primary.main, textTransform: 'capitalize' }}>
              {value?.row?.zoneName}
            </Typography>
          </Stack>
        );
      },
    },
    {
      id: 1,
      headerName: 'CUSTOMERS',
      field: 'customers',
      sortable: false,
      flex: 1,
      //   minWidth: 270,
      renderCell: ({ value }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value || null}
          </Typography>
        </Box>
      ),
    },
    {
      id: 2,
      headerName: 'ORDERS',
      field: 'orders',
      sortable: false,
      flex: 1,
      //   minWidth: 270,
      renderCell: ({ value }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value || null}
          </Typography>
        </Box>
      ),
    },
    {
      id: 3,
      headerName: 'RIDERS',
      field: 'riders',
      sortable: false,
      flex: 1,
      //   minWidth: 270,
      renderCell: ({ value }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value || null}
          </Typography>
        </Box>
      ),
    },
    {
      id: 4,
      headerName: 'STORE',
      field: 'store',
      sortable: false,
      flex: 1,
      //   minWidth: 270,
      renderCell: ({ value }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value || null}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          pr: 5,
          pl: 3.5,
          pb: 1,
          border: '1px solid #EEEEEE',
          borderRadius: '7px',
          background: '#fff',
          marginBottom: '30px 0px',
          // height: 550,
          // width: '100%',
        }}
      >
        <StyledTable
          columns={columns}
          rows={allZones || []}
          onRowClick={() => {
            setIsSideBarOpen(true);
          }}
          getRowId={(row) => row?._id}
          sx={{
            '& .MuiDataGrid-row': {
              borderLeft: `4px solid transparent`,
            },
            '& .MuiDataGrid-row:hover, .MuiDataGrid-row:active': {
              backgroundColor: 'rgba(177,177,177,0.20)!important',
              borderLeft: `4px solid ${theme.palette.danger.main}`,
            },
            cursor: 'pointer',
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No zone found
              </Stack>
            ),
          }}
        />
      </Box>
      <Box sx={{ marginTop: '30px' }}>
        <AppPagination
          currentPage={pageNo}
          lisener={(newPage) => {
            setPageNo(newPage);
          }}
          totalPage={2}
        />
      </Box>
    </Box>
  );
}

export default MapOverview;
