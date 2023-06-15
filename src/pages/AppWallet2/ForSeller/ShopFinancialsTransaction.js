import { Box } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { useQuery } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';
import PageTop from '../../../components/Common/PageTop';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';

import ShopTransactions from '../../ShopProfile/Transactions';

const getBreadCrumbItems = (searchUrl) => {
  const breadcrumbItems = [
    {
      label: 'Financials',
      to: '/financials',
    },
    {
      label: 'Sellers List',
      to: '/add-wallet/seller-transactions2',
    },
    {
      label: 'Shop List',
      to: `/add-wallet/shop-transactions2?shopId=${searchUrl.get('shopName')}&shopName=${searchUrl.get(
        // eslint-disable-next-line prettier/prettier
        'shopName',
      )}`,
    },
  ];

  return breadcrumbItems;
};

function ShopFinancialsTransaction() {
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const { search } = useLocation();
  // eslint-disable-next-line no-unused-vars
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');

  // API -----> SHOP_TRX

  const getSellerShopsTnx = useQuery([API_URL.SHOP_TRX, { id: searchParams.get('shopId') }], () =>
    AXIOS.post(API_URL.SHOP_TRX, {
      page: 1,
      pageSize: 50,
      shopId: searchParams.get('shopId'),
      sortBy: 'desc',
      tnxFilter: {
        //   startDate: shopTrxStartDate,
        //   endDate: shopTrxEndDate,
        //   type: !value ? ['adminAddBalanceShop', 'adminRemoveBalanceShop', 'adminSettlebalanceShop'] : [value],
        //   searchKey: shopSearchKey,
        //   amountBy: orderBy,
        //   amountRange: shopTrxAmountRange,
        //   amountRangeType: rangeType,
        //   adminBy: shopTrxBy?._id,
      },
      // eslint-disable-next-line prettier/prettier
    }),
  );
  console.log(getSellerShopsTnx?.data?.data?.transections);
  return (
    <Box>
      <PageTop
        isBreadCrumbsTitleShow
        breadCrumbsTitle={searchParams.get('shopName')}
        backButtonLabel="Back to Financials"
        breadcrumbItems={getBreadCrumbItems(searchParams)}
        backTo="/financials"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <ShopTransactions shop={{ _id: searchParams.get('shopId') }} />
    </Box>
  );
}

export default ShopFinancialsTransaction;
