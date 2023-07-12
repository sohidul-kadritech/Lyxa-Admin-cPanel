/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';

import { useQuery } from 'react-query';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';

import StyledFormField from '../../../components/Form/StyledFormField';
import ShopRankingTable from './Table';

function ShopRanking({ data, padding = true }) {
  const theme = useTheme();
  const [sellerOptions, setSellerOptions] = useState([]);

  const [queryParams, setQueryParams] = useState({
    shopPage: 1,
    shopPageSize: 10,
    totalPageShop: 1,
    sellerId: 'all',
  });

  const getSalesdashBoard = useQuery(
    [API_URL.GET_SALES_DASHBOARD_SUMMARY, [{ ...queryParams }]],
    () =>
      AXIOS.get(API_URL.GET_SALES_DASHBOARD_SUMMARY, {
        params: { ...queryParams, sellerId: queryParams?.sellerId === 'all' ? '' : queryParams?.sellerId },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          console.log('dashboard data for sales inside query: ', data?.data);
          const totalPageShop = data?.data?.shopRanking?.paginate?.metadata?.page?.totalPage;
          const totalSellers = data?.data?.totalSellers;
          setSellerOptions((prev) => [{ company_name: 'All', _id: 'all' }, ...totalSellers]);
          setQueryParams((prev) => ({ ...prev, totalPageShop }));
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
      <Typography variant="body1" fontWeight={600}>
        Shop Ranking
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="end" pt={6}>
        {/* <Stack direction="row" alignItems="center">
          <Typography variant="body1" sx={{ fontWeight: '700', fontSize: '16px' }}>
            120
          </Typography>
          <IncreaseDecreaseTag status="increase" amount="4%" />
        </Stack> */}

        <Box>
          <StyledFormField
            intputType="select"
            tooltip="Select Sellers"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'sellerName',
              size: 'sm',
              placeholder: 'Select Seller',
              value: queryParams?.sellerId,
              items: sellerOptions || [],
              getLabel: (option) => option?.company_name,
              getValue: (option) => option?._id,
              getDisplayValue: (currentValue) =>
                sellerOptions?.find((seller) => seller?._id === currentValue)?.company_name,
              onChange: (e) => setQueryParams((prev) => ({ ...prev, sellerId: e.target.value })),
            }}
          />
        </Box>
      </Stack>
      <Box>
        <ShopRankingTable
          loading={getSalesdashBoard?.isLoading}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          data={getSalesdashBoard?.data?.data?.shopRanking?.ranking}
        />
      </Box>
    </Box>
  );
}

export default ShopRanking;
