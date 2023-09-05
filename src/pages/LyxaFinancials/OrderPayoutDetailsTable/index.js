/* eslint-disable prettier/prettier */
import { Box } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import { useGlobalContext } from '../../../context';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';

import { convertDate } from '../../AppWallet2/ForSeller/helpers';
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

const getParamsQuery = (showFor, queryParams) => {
  if (showFor === 'delivery') {
    return { ...queryParams, orderType: queryParams?.shoptype };
  }

  return { ...queryParams };
};

export default function OrderPayoutDetailsTable({ showFor, shopType, paymentDetailsRange }) {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const [queryParams, setQueryParams] = useState(queryParamsInit({ shop: shop?._id }));

  const api =
    showFor === 'delivery'
      ? API_URL.GET_SHOP_ADMIN_DELIVERY_SHOP_FINANCIALS_PROFITBREAKDOWN
      : API_URL.GET_SHOP_ADMIN_FINANCIALS_PROFITBREAKDOWN;

  const getAdminFinancialsProfitBreakdown = useQuery(
    [
      api,
      { ...queryParams, startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end, orderType: shopType },
    ],
    () =>
      AXIOS.get(api, {
        params: {
          ...getParamsQuery(showFor, {
            ...queryParams,
            shopType,
            pageSize: 20,
          }),
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
        },
      }),
  );

  console.log('getShopAdminFinancialsProfitbreakdown', getAdminFinancialsProfitBreakdown?.data?.data);

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
        loading={getAdminFinancialsProfitBreakdown?.isLoading}
        type={showFor}
        currencyType={queryParams?.paidCurrency}
        rows={getAdminFinancialsProfitBreakdown?.data?.data?.shops}
        page={queryParams?.page}
        setPage={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={getAdminFinancialsProfitBreakdown?.data?.data?.paginate?.metadata?.page?.totalPage}
      />
    </Box>
  );
}
