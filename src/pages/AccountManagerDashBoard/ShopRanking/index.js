/* eslint-disable no-unused-vars */
import { Box, Stack, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { TitleWithToolTip } from '../../../components/Common/TitleWithToolTip';
import StyledFormField from '../../../components/Form/StyledFormField';
import { useGlobalContext } from '../../../context';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ShopRankingTable from './Table';

function ShopRanking({ padding = true }) {
  const theme = useTheme();
  // const [seller, setSeller] = useState('all');
  const [queryParams, setQueryParams] = useState({ page: 1, pageSize: 15, sellerId: 'all', totalPage: 1 });
  const { currentUser } = useGlobalContext();
  const admin = currentUser?.admin;
  const adminSellers = admin?.sellers;

  const shopTableRef = useRef(null);
  const shopContainerRef = useRef(null);

  const [sellersOption, setSellerOption] = useState([{ _id: 'all', name: 'All Sellers' }, ...adminSellers]);

  useEffect(() => {
    setSellerOption(() => {
      console.log('menu: ', [{ _id: 'all', name: 'All Sellers' }, ...adminSellers]);
      return [{ _id: 'all', name: 'All Sellers' }, ...adminSellers];
    });
  }, [currentUser?.admin]);

  const scrollToTop = () => {
    if (shopTableRef.current) {
      shopContainerRef?.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });

      shopTableRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const getAccountManagerdashBoard = useQuery(
    [API_URL.GET_ACCOUNT_MANAGER_DASHBOARD_SUMMARY, queryParams],
    () =>
      AXIOS.get(API_URL.GET_ACCOUNT_MANAGER_DASHBOARD_SUMMARY, {
        params: { ...queryParams, sellerId: queryParams?.sellerId !== 'all' ? queryParams?.sellerId : '' },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setQueryParams((prev) => ({ ...prev, totalPage: data?.data?.paginate?.metadata?.page?.totalPage }));
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );
  return (
    <Box
      ref={shopContainerRef}
      sx={{
        background: '#fff',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
        position: 'relative',
        overflow: 'hidden',
        padding: padding ? '16px 18px' : '0px',
      }}
    >
      <TitleWithToolTip title="Shop Ranking" tooltip="Top ranked Shops.(Ranked with number of items sold)" />
      <Stack direction="row" alignItems="center" justifyContent="end" pt={6}>
        <Box ref={shopTableRef}>
          <StyledFormField
            intputType="select"
            tooltip="Select a Seller"
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
              onChange: (e) => {
                setQueryParams((prev) => ({ ...prev, sellerId: e.target.value }));
              },
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
          data={getAccountManagerdashBoard?.data?.data?.ranking || []}
        />
      </Box>
    </Box>
  );
}

export default ShopRanking;
