/* eslint-disable prettier/prettier */
import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

import StyledTabs2 from '../../../components/Styled/StyledTab2';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { convertDate } from '../../LyxaFinancials/OrderFinancials';
import Table from './Table';

export const typeOptions = [
  { label: 'Base', value: 'baseCurrency' },
  { label: 'Secondary', value: 'secondaryCurrency' },
];

const queryParamsInit = (props) => ({
  page: 1,
  pageSize: 15,
  sortBy: 'DESC',
  paidCurrency: 'baseCurrency',
  ...props,
});

// eslint-disable-next-line no-unused-vars
function FinancialsTableForSellerAndShop({ paramsProps, showFor }) {
  console.log('paramsProps', paramsProps, showFor);
  const [queryParams, setQueryParams] = useState(queryParamsInit({ ...paramsProps }));

  const viewUserType = {
    allSeller: {
      api: API_URL.GET_ALL_SELLER_ADMIN_ORDER_FINANCIALS_PROFITBREAKDOWN,
    },
    seller: {
      api: API_URL.GET_SPECIFIC_SELLER_SHOP_ADMIN_ORDER_FINANCIALS_PROFITBREAKDOWN,
    },
  };

  const query = useQuery([viewUserType[showFor]?.api, { ...queryParams, ...paramsProps }], () =>
    AXIOS.get(viewUserType[showFor].api, {
      params: {
        ...queryParams,
        startDate: convertDate(paramsProps?.startDate),
        endDate: convertDate(paramsProps?.endDate),
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
        currencyType={queryParams?.paidCurrency}
        showFor={showFor}
        rows={showFor === 'allSeller' ? query?.data?.data?.sellers : query?.data?.data?.shops}
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

export default FinancialsTableForSellerAndShop;
