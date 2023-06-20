import React, { useState } from 'react';

import { Box } from '@mui/material';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
import SearchBar from './SearchBar';
import AdminLogsTable from './Table';
import { getQueryParamsInit } from './helpers';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Admin Logs',
    to: '#',
  },
];

function AdminLogs() {
  const [queryParams, setQueryParams] = useState(getQueryParamsInit);
  const [totalPage, setTotalPage] = useState(1);
  const getAdminLog = useQuery(
    [API_URL.ADMIN_LOGS_HISTORY, queryParams],
    () =>
      AXIOS.get(API_URL.ADMIN_LOGS_HISTORY, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Box>
        <SearchBar searchPlaceHolder="Search..." queryParams={queryParams} setQueryParams={setQueryParams} />
      </Box>

      <Box>
        {getAdminLog?.isLoading ? (
          <TablePageSkeleton row={5} column={5} />
        ) : (
          <AdminLogsTable
            queryParams={queryParams}
            totalPage={totalPage}
            setQueryParams={setQueryParams}
            data={getAdminLog?.data?.data?.logs}
            loading={getAdminLog.isLoading}
          />
        )}
      </Box>
    </Box>
  );
}

export default AdminLogs;
