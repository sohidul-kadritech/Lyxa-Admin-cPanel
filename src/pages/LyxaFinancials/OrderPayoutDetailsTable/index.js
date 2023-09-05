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

// eslint-disable-next-line no-unused-vars
const dummyData = (rows) => {
  const data = [];
  for (let i = 0; i < rows; i++) {
    data.push({
      shopName: 'KFC',
      _id: i,
    });
  }

  return data;
};

export default function OrderPayoutDetailsTable({ showFor, shopType, paymentDetailsRange }) {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const [queryParams, setQueryParams] = useState(queryParamsInit({ shop: shop?._id }));

  const getShopAdminFinancialsProfitbreakdown = useQuery(
    [
      API_URL.GET_SHOP_ADMIN_FINANCIALS_PROFITBREAKDOWN,
      { ...queryParams, startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end, orderType: shopType },
    ],
    () =>
      AXIOS.get(API_URL.GET_SHOP_ADMIN_FINANCIALS_PROFITBREAKDOWN, {
        params: {
          ...queryParams,
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
          shopType,
          pageSize: 20,
        },
      }),
  );

  // console.log('getShopAdminFinancialsProfitbreakdown', getShopAdminFinancialsProfitbreakdown?.data?.data);

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
        loading={getShopAdminFinancialsProfitbreakdown?.isLoading}
        type={showFor}
        currencyType={queryParams?.paidCurrency}
        rows={getShopAdminFinancialsProfitbreakdown?.data?.data?.shops}
        page={queryParams?.page}
        setPage={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={getShopAdminFinancialsProfitbreakdown?.data?.data?.paginate?.metadata?.page?.totalPage}
      />
    </Box>
  );
}
