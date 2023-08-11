import { Box, Stack, Typography, debounce, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import AppPagination from '../../components/Common/AppPagination2';
import StyledTable from '../../components/Styled/StyledTable3';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
import { getZoneStatusColor } from './helper';

import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

function MapOverview({ setIsSideBarOpen, setCurrentRowData }) {
  // eslint-disable-next-line no-unused-vars
  const [loading, setIsloading] = useState(true);

  // eslint-disable-next-line no-unused-vars
  const [tempAllZones, setTempAllZones] = useState([]);

  const [pageNo, setPageNo] = useState(1);

  const [searchedValue, setSearchedValue] = useState('');

  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState(1);

  // eslint-disable-next-line no-unused-vars
  const [selectedPageSize, setSelectedPageSize] = useState(5);

  const theme = useTheme();

  // eslint-disable-next-line no-unused-vars
  const getMapoverView = useQuery(
    [API_URL.ZONE_MAP_OVERVIEW, { searchedValue, pageNo }],
    () =>
      AXIOS.get(API_URL.ZONE_MAP_OVERVIEW, {
        params: {
          zoneStatus: 'active',
          page: pageNo,
          searchKey: searchedValue,
          pageSize: selectedPageSize,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          console.log('map over view: ', data?.data?.zones);
          setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  // eslint-disable-next-line no-unused-vars
  // const getAllZones = useQuery(
  //   [API_URL.GET_ALL_ZONE, { searchedValue, pageNo }],
  //   () =>
  //     AXIOS.get(API_URL.GET_ALL_ZONE, {
  //       params: {
  //         zoneStatus: 'active',
  //         page: pageNo,
  //         searchKey: searchedValue,
  //         pageSize: selectedPageSize,
  //       },
  //     }),
  //   {
  //     onSuccess: (data) => {
  //       setIsloading(true);
  //       if (data?.status) {
  //         setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);

  //         // eslint-disable-next-line no-unused-vars
  //         const filteredData = createDataForTable(data?.data?.zones).then((data) => {
  //           setTempAllZones(data);
  //           setIsloading(false);
  //         });
  //       } else {
  //         setIsloading(false);
  //       }
  //     },
  //     // eslint-disable-next-line prettier/prettier
  //   },
  // );

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
              background: `${getZoneStatusColor(value?.row)}`,
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
            {row?.users?.length || 0}
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
            {row?.orders?.length || 0}
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
            {row?.riders?.length || 0}
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
            {row?.shops?.length || 0}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" marginBottom={5}>
        <StyledSearchBar
          sx={{ flex: 1 }}
          placeholder="Search"
          onChange={debounce((e) => setSearchedValue(e.target.value), 300)}
        />
      </Stack>

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
        {getMapoverView?.isLoading ? (
          <TablePageSkeleton row={4} column={5} />
        ) : (
          <StyledTable
            columns={columns}
            rows={getMapoverView?.data?.data?.zones || []}
            onRowClick={(data) => {
              setIsSideBarOpen(true);
              console.log('row data', data?.row);
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
      <Box marginTop={5}>
        <AppPagination
          currentPage={pageNo}
          lisener={(newPage) => {
            setPageNo(newPage);
            console.log(true);
          }}
          totalPage={totalPage}
        />
      </Box>
    </Box>
  );
}

export default MapOverview;
