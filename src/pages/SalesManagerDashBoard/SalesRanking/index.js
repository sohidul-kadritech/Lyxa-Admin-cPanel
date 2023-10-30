/* eslint-disable no-unused-vars */
import { Box, useTheme } from '@mui/material';
import React, { useState } from 'react';

import { useQuery } from 'react-query';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';

import { TitleWithToolTip } from '../../../components/Common/TitleWithToolTip';
import SalesRankingTable from './Table';

function SalesRanking({ data = [], padding = true }) {
  const theme = useTheme();
  const [selller, setSeller] = useState('1');
  const [queryParams, setQueryParams] = useState({
    salesPage: 1,
    salesPageSize: 10,
    totalPageSales: 1,
  });

  const getSalesdashBoard = useQuery(
    [API_URL.GET_SALES_DASHBOARD_SUMMARY, [{ ...queryParams }]],
    () =>
      AXIOS.get(API_URL.GET_SALES_DASHBOARD_SUMMARY, {
        params: { ...queryParams },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          const totalPageSales = data?.data?.salesRanking?.paginate?.metadata?.page?.totalPage;
          setQueryParams((prev) => ({ ...prev, totalPageSales }));
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  return (
    <Box
      sx={{
        background: '#fff',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
        position: 'relative',
        overflow: 'hidden',
        padding: padding ? '16px 18px' : '0px',
      }}
    >
      <TitleWithToolTip title="Sales Ranking" tooltip="Top ranked sales managers.(Ranked with number of shops)" />

      <Box>
        <SalesRankingTable
          loading={getSalesdashBoard?.isLoading}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          data={getSalesdashBoard?.data?.data?.salesRanking?.ranking}
        />
      </Box>
    </Box>
  );
}

export default SalesRanking;
