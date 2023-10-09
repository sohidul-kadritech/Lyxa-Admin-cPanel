import React, { useState } from 'react';

import { Box } from '@mui/material';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import useQueryParams from '../../helpers/useQueryParams';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
// import SearchBar from './SearchBar';
import SearchBar from '../../components/Common/CommonSearchbar';
import AdminLogsTable from './Table';
import { adminLogTypeOptions, getQueryParamsInit } from './helpers';

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
  const [queryParams, setQueryParams] = useQueryParams(getQueryParamsInit);
  const [totalPage, setTotalPage] = useState(1);

  const [secondaryCurrency, setSecondaryCurrency] = useState({});

  // eslint-disable-next-line no-unused-vars
  const getAppSettingsData = useQuery([API_URL.APP_SETTINGS], () => AXIOS.get(API_URL.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        setSecondaryCurrency({
          secondaryCurrency: data?.data?.appSetting?.secondaryCurrency,
          baseCurrency: data?.data?.appSetting?.currency,
        });
      }
    },
  });

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
    }
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
      <Box marginBottom="30px">
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          customSelectOptions={adminLogTypeOptions}
          customSelectValue="type"
          customSelectPlaceholder="Log Type"
          showFilters={{
            search: true,
            date: true,
            sort: true,
            customSelect: true,
          }}
        />
      </Box>
      <Box>
        {getAdminLog?.isLoading ? (
          <TablePageSkeleton row={5} column={5} />
        ) : (
          <AdminLogsTable
            secondaryCurrency={secondaryCurrency}
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
