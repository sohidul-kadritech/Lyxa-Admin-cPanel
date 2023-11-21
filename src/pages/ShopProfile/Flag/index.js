/* eslint-disable prettier/prettier */
import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import TablePagination from '../../../components/Common/TablePagination';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { getQueryParamsInit } from '../helper';
import FlagTable from './Table';

export default function ShopFlags({ shop, onViewDetail }) {
  const [queryParams, setQueryParams] = useState(getQueryParamsInit({ page: 1, pageSize: 15 }));

  const shopFlagsQuery = useQuery([API_URL.GET_SHOP_FLAGS, { shopId: shop?._id, ...queryParams }], () =>
    AXIOS.get(API_URL.GET_SHOP_FLAGS, {
      params: {
        shopId: shop?._id,
        ...queryParams,
      },
    }),
  );

  console.log({ shopFlagsQuery: shopFlagsQuery?.data?.data });

  return (
    <Box>
      <SearchBar
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        searchPlaceHolder="Search Flags"
        showFilters={{ search: true, sort: true, date: true }}
      />
      <Box sx={{ paddingTop: '30px' }} />
      <FlagTable
        flags={shopFlagsQuery?.data?.data?.flags}
        onViewDetail={onViewDetail}
        showFor="Flagged"
        loading={shopFlagsQuery?.isLoading}
      />
      <TablePagination
        currentPage={Number(queryParams?.page)}
        lisener={(page) => {
          setQueryParams({ ...queryParams, page });
        }}
        totalPage={shopFlagsQuery?.data?.data.paginate?.metadata?.page?.totalPage}
      />
    </Box>
  );
}
