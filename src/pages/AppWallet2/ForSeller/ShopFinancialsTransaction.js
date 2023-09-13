/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import PageTop from '../../../components/Common/PageTop';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';

import ShopTransactions from '../../ShopProfile/Transactions';

const getBreadCrumbItems = (searchUrl, viewUserType) => {
  let breadcrumbItems = [
    {
      label: 'Financials',
      to: '/financials',
    },
    {
      label: 'Sellers List',
      to: '/app-wallet/seller-transactions',
    },
    {
      label: 'Shops List',
      to: `/app-wallet/seller/shops-transactions?sellerId=${searchUrl.get('sellerId')}&companyName=${searchUrl.get(
        // eslint-disable-next-line prettier/prettier
        'companyName',
      )}`,
    },
    {
      label: searchUrl.get('shopName'),
      to: `/app-wallet/shop-transactions?shopId=${searchUrl.get('shopId')}&shopName=${searchUrl.get(
        // eslint-disable-next-line prettier/prettier
        'shopName',
      )}&sellerId=${searchUrl.get('sellerId')}&companyName=${searchUrl.get('companyName')}`,
    },
  ];

  if (viewUserType === 'seller') {
    breadcrumbItems = breadcrumbItems.filter((item) => item.label !== 'Shops List' && item.label !== 'Sellers List');
  }

  return breadcrumbItems;
};

function ShopFinancialsTransaction({ viewUserType = 'admin' }) {
  console.log({ viewUserType });
  // eslint-disable-next-line no-unused-vars
  const { search } = useLocation();
  // eslint-disable-next-line no-unused-vars
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const [currentTab, setCurrentTab] = useState(0);

  const [searchKey, setSearchKey] = useState('');

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

  return (
    <Box>
      <PageTop
        isBreadCrumbsTitleShow
        breadCrumbsTitle={searchParams.get('shopName')}
        backButtonLabel="Back to Financials"
        breadcrumbItems={getBreadCrumbItems(searchParams, viewUserType)}
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
