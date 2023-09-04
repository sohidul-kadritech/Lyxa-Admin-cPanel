/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../../../../context';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import { convertDate } from '../../../../pages/LyxaFinancials/OrderFinancials';
import StyledTabs2 from '../../../Styled/StyledTab2';
import Table from './Table';

export const typeOptions = [
  { label: 'Base', value: 'baseCurrency' },
  { label: 'Secondary', value: 'secondaryCurrency' },
];

const queryParamsInit = (props) => ({
  page: 1,
  pageSize: 15,
  sortBy: 'DESC',
  orderType: 'all',
  model: 'order',
  paidCurrency: 'baseCurrency',
  ...props,
});

export default function PayoutDetailsTable({ startDate, endDate }) {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const [queryParams, setQueryParams] = useState(queryParamsInit({ shop: shop?._id }));

  const query = useQuery([Api.GET_ORDER_LIST_PROFIT_BREAKDOWN, { ...queryParams, startDate, endDate }], () =>
    AXIOS.get(Api.GET_ORDER_LIST_PROFIT_BREAKDOWN, {
      params: { ...queryParams, startDate: convertDate(startDate), endDate: convertDate(endDate) },
    }),
  );

  return (
    <Box>
      <StyledTabs2
        options={typeOptions}
        value={queryParams?.paidCurrency}
        onChange={(value) => {
          setQueryParams((prev) => ({ ...prev, paidCurrency: value }));
        }}
      />
      <Table
        currencyType={queryParams?.paidCurrency}
        rows={query?.data?.data?.orders}
        loading={query?.isLoading}
        page={queryParams?.page}
        setPage={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
      />
    </Box>
  );
}
