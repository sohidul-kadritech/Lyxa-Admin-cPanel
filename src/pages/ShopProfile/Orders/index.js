import { Box } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import OrderTable from '../../NewOrder/OrderTable';
import SearchBar from '../Searchbar';
import { getQueryParamsInit } from '../helper';

export default function ShopOrders({ shop, onViewDetail }) {
  const [queryParams, setQueryParams] = useState(
    getQueryParamsInit({ page: 1, pageSize: 5, shop: shop?._id, sortBy: 'desc', orderType: 'all', model: 'order' })
  );
  const [totalPage, setTotalPage] = useState(0);

  const ordersQuery = useQuery(
    [Api.ORDER_LIST, queryParams],
    () =>
      AXIOS.get(Api.ORDER_LIST, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  return (
    <Box>
      <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} searchPlaceHolder="Search Orders" />
      <Box paddingTop="30px" />
      <OrderTable
        onRowClick={(params) => {
          onViewDetail(params?.row);
        }}
        orders={ordersQuery?.data?.data.orders}
        orderType="shopProfile"
        loading={ordersQuery?.isLoading}
      />
      {!ordersQuery.isLoading && (
        <TablePagination
          currentPage={queryParams?.page}
          totalPage={totalPage}
          lisener={(page) => setQueryParams({ ...queryParams, page })}
        />
      )}
    </Box>
  );
}
