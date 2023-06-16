import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import StyledTable from '../../components/Styled/StyledTable3';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
import { colorList, createDataForTable } from './helper';

function MapOverview({ setIsSideBarOpen, getAllZone, setCurrentRowData }) {
  const [loading, setIsloading] = useState(true);
  const [tempAllZones, setTempAllZones] = useState([]);
  const theme = useTheme();

  // console.log('data is ready for table: ', Promise.resolve(createDataForTable(getAllZone)));
  // eslint-disable-next-line no-unused-vars

  const columns = [
    {
      id: 0,
      headerName: 'ZONES',
      field: 'zoneName',
      sortable: false,
      density: 'comfortable',
      flex: 1,
      // minWidth: 270,
      renderCell: (value) => (
        <Stack flexDirection="row" alignItems="center" gap="10px">
          <Box
            sx={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: `${colorList[value.row.colorId % 50]}`,
            }}
          ></Box>{' '}
          <Typography sx={{ color: theme.palette.primary.main, textTransform: 'capitalize' }}>
            {value?.row?.zoneName}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 1,
      headerName: 'CUSTOMERS',
      sortable: false,
      flex: 1,
      //   minWidth: 270,
      renderCell: ({ row }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row?.stats?.users?.length || 0}
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
      renderCell: ({ row }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row?.stats?.orders?.length || 0}
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
      renderCell: ({ row }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row?.stats?.riders?.length || 0}
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
      renderCell: ({ row }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row?.stats?.shops?.length || 0}
          </Typography>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const data = createDataForTable(getAllZone).then((data) => {
      setTempAllZones(data);
      setIsloading(false);
    });
  }, [getAllZone]);

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
        }}
      >
        {loading ? (
          <TablePageSkeleton row={4} column={5} />
        ) : (
          <StyledTable
            columns={columns}
            rows={tempAllZones || []}
            onRowClick={(data) => {
              setIsSideBarOpen(true);
              setCurrentRowData(data?.row);
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
                  {loading ? 'Loading...' : 'No zone found'}
                </Stack>
              ),
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default MapOverview;
