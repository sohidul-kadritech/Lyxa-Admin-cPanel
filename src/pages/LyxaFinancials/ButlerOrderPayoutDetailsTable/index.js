/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import { useGlobalContext } from '../../../context';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { convertDate } from '../OrderFinancials';
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

const dummyData = (rows) => {
  const data = [];
  for (let i = 0; i < rows; i++) {
    data.push({
      orderId: 'YJE240823000010',
      _id: i,
    });
  }

  return data;
};

export default function ButlerOrderPayoutDetailsTable({ paymentDetailsRange }) {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const [queryParams, setQueryParams] = useState(queryParamsInit({ shop: shop?._id }));

  const getButlerAdminFinancialsProfitBreakdown = useQuery(
    [
      API_URL.GET_BUTLER_ADMIN_DELIVERY_ORDER_FINANCIALS_PROFITBREAKDOWN,
      { ...queryParams, startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end },
    ],
    () =>
      AXIOS.get(API_URL.GET_BUTLER_ADMIN_DELIVERY_ORDER_FINANCIALS_PROFITBREAKDOWN, {
        params: {
          ...queryParams,
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
        },
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
        loading={getButlerAdminFinancialsProfitBreakdown?.isLoading}
        currencyType={queryParams?.paidCurrency}
        rows={getButlerAdminFinancialsProfitBreakdown?.data?.data?.orders}
        page={queryParams?.page}
        setPage={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={getButlerAdminFinancialsProfitBreakdown?.data?.data?.paginate?.metadata?.page?.totalPage}
      />
    </Box>
  );
}
