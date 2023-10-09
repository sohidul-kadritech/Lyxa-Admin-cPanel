import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';

import moment from 'moment';
import SearchBar from '../../components/Common/CommonSearchbar';
import { getFirstMonday } from '../../components/Styled/StyledDateRangePicker/Presets';
import StyledTable from '../../components/Styled/StyledTable3';
import useQueryParams from '../../helpers/useQueryParams';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
import ReferFriendDashBoard from './ReferFriendDashBoard';
import ReferFriendDashboardSkeleton from './ReferFriendDashboardSkeleton';

const getQueryParamsInit = () => ({
  startDate: getFirstMonday('week').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  sort: 'DESC',
  searchKey: '',
});

function ReferFriendList() {
  console.log('queryParams', getQueryParamsInit());
  const [queryParams, setQueryParams] = useQueryParams(getQueryParamsInit());

  const theme = useTheme();

  const getReferrelList = useQuery([API_URL?.GET_REFER_A_FRIEND_HISTORY, queryParams], () =>
    AXIOS.get(API_URL?.GET_REFER_A_FRIEND_HISTORY, {
      params: queryParams,
    })
  );

  const allColumns = [
    {
      id: 1,
      headerName: `SENDER`,
      field: 'sender',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="body4"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {params?.row?.referFriend?.senderName}
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: `RECEIVER`,
      field: 'receiver',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="body4"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {params?.row?.referFriend?.receiverName}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: `SENDER GETS`,
      field: 'sender_gets',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="body4"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {params?.row?.referFriend?.senderGets}% Discount
        </Typography>
      ),
    },
    {
      id: 4,
      headerName: `RECEIVER GETS`,
      field: 'receiverGets',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="body4"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {params?.row?.referFriend?.receiverGets}% Discount
        </Typography>
      ),
    },

    {
      id: 4,
      headerName: `INVITED DATE`,
      field: 'invited_date',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Stack spacing={2} alignItems="center" sx={{ padding: '8px 0px' }}>
          <Typography variant="body4">{new Date(params?.row?.referFriend?.inviteDate).toLocaleDateString()}</Typography>
          <Typography variant="body3">{new Date(params?.row?.referFriend?.inviteDate).toLocaleTimeString()}</Typography>
        </Stack>
      ),
    },
    {
      id: 4,
      headerAlign: 'right',
      align: 'right',
      headerName: `EXPIRY DATE`,
      field: 'expiry_date',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Stack spacing={2} alignItems="center" sx={{ padding: '8px 0px' }}>
          <Typography variant="body4">{new Date(params?.row?.referFriend?.expiryDate).toLocaleDateString()}</Typography>
          <Typography variant="body3">{new Date(params?.row?.referFriend?.expiryDate).toLocaleTimeString()}</Typography>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ marginBottom: '30px' }}>
        <SearchBar
          queryParams={queryParams}
          // queryParams={queryParams}
          setQueryParams={setQueryParams}
          showFilters={{
            search: true,
            date: true,
            sort: true,
          }}
        />
      </Box>
      {/* <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
        <DateRange range={range} setRange={setRange} />
        <StyledFormField
          intputType="select"
          containerProps={{
            sx: { padding: '0px 0px' },
          }}
          inputProps={{
            name: 'sort',
            placeholder: 'Sort',
            value: sort,
            items: sortOptions,
            size: 'sm2',
            onChange: (e) => setSort(e.target.value),
          }}
        />
      </Stack> */}

      {!getReferrelList.isLoading ? (
        <Box>
          <ReferFriendDashBoard summery={getReferrelList?.data?.data?.summery} />
        </Box>
      ) : (
        <ReferFriendDashboardSkeleton />
      )}

      <Box
        marginTop="30px"
        sx={{ padding: '3px 20px', borderRadius: '7px', border: `1px solid ${theme?.palette?.custom?.border}` }}
      >
        {getReferrelList.isLoading ? (
          <TablePageSkeleton row={3} column={6} />
        ) : (
          <StyledTable
            columns={allColumns}
            rows={getReferrelList?.data?.data?.list || []}
            getRowHeight={() => 'auto'}
            getRowId={(row) => row?._id}
            sx={{
              '& .MuiDataGrid-cell': {
                cursor: 'defualt',
              },
            }}
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  No Referrel List Found
                </Stack>
              ),
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default ReferFriendList;
