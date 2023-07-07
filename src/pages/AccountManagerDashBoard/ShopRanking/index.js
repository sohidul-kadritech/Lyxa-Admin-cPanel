/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import StyledFormField from '../../../components/Form/StyledFormField';
import { useGlobalContext } from '../../../context';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { getShopRankedData } from '../helpers';
import ShopRankingTable from './Table';

function ShopRanking({ padding = true }) {
  const theme = useTheme();
  // const [seller, setSeller] = useState('all');
  const [queryParams, setQueryParams] = useState({ page: 1, pageSize: 50, sellerId: 'all' });
  const { currentUser } = useGlobalContext();
  const admin = currentUser?.admin;
  const adminSellers = admin?.sellers;
  const [sellersOption, setSellerOption] = useState([{ _id: 'all', name: 'All Sellers' }, ...adminSellers]);

  useEffect(() => {
    setTimeout(() => {
      setSellerOption(() => {
        console.log('menu: ', [{ _id: 'all', name: 'All Sellers' }, ...adminSellers]);
        return [{ _id: 'all', name: 'All Sellers' }, ...adminSellers];
      });
    }, 500);
  }, [currentUser?.admin]);

  const getAccountManagerdashBoard = useQuery([API_URL.GET_ACCOUNT_MANAGER_DASHBOARD_SUMMARY, queryParams], () =>
    AXIOS.get(API_URL.GET_ACCOUNT_MANAGER_DASHBOARD_SUMMARY, {
      params: { ...queryParams, sellerId: queryParams?.sellerId !== 'all' ? queryParams?.sellerId : '' },
      // eslint-disable-next-line prettier/prettier
    }),
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
            tooltip="Select Zone"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'sellerName',
              size: 'sm',
              placeholder: 'Select Seller',
              value: queryParams?.sellerId || '',
              items: sellersOption || [],
              getLabel: (option) => option?.name,
              getValue: (option) => option?._id,
              getDisplayValue: (currentValue) => sellersOption?.find((seller) => seller?._id === currentValue)?.name,
              onChange: (e) => setQueryParams((prev) => ({ ...prev, sellerId: e.target.value })),
            }}
          />
        </Box>
      </Stack>
      <Box>
        <ShopRankingTable
          loading={getAccountManagerdashBoard?.isLoading}
          queryParams={queryParams}
          totalPage={getAccountManagerdashBoard?.data?.data?.paginate?.metadata?.page?.totalPage}
          setQueryParams={setQueryParams}
          data={getShopRankedData(getAccountManagerdashBoard?.data?.data?.ranking || [])}
        />
      </Box>
    </Box>
  );
}

export default ShopRanking;
