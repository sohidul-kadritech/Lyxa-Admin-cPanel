import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import earningFlowIcon from '../assets/images/dashboard/earning-flow.png';
import moneyExchangeIcon from '../assets/images/dashboard/money-exchange.png';
import orderAmountIcon from '../assets/images/dashboard/order-amount.png';
import profitFlowIcon from '../assets/images/dashboard/profit-flow.png';
import profitUpArrowIcon from '../assets/images/dashboard/profit-up-arrow.png';
import DashboardCard from './DashboardCard';
import GlobalWrapper from './GlobalWrapper';
import TopSummery from './TopSummery';

import bagIcon from '../assets/images/dashboard/bag.png';
import cancelBagIcon from '../assets/images/dashboard/cancel-bag.png';
import shopIcon from '../assets/images/dashboard/shop.png';

const GraphInfo = lazy(() => import('./GraphInfo'));

function SellerDashboard({ summary }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
  const shops = useSelector((store) => store.Login.admin.shops);

  let topSummaryData = [
    {
      id: 1,
      title: 'Earnings',
      subTitle: '(Total earnings)',
      value: `${summary?.totalSellerEarning?.toFixed(2) ?? 0?.toFixed(2)} ${currency}`,
      icon: earningFlowIcon,
      iconBg: '#6C00FF',
    },
    {
      id: 2,
      title: 'Order Profit',
      subTitle: '(Ex delivery fees)',
      value: `${summary?.orderValue?.productAmount?.toFixed(2) ?? 0?.toFixed(2)} ${currency}`,
      icon: profitFlowIcon,
      iconBg: '#56ca00',
    },
    {
      id: 5,
      title: 'Order Amount',
      subTitle: '(Ex delivery fees)',
      value: `${summary?.orderValue?.totalAmount?.toFixed(2) ?? 0?.toFixed(2)} ${currency}`,
      icon: orderAmountIcon,
      iconBg: '#ff5ca7',
    },
    {
      id: 6,
      title: 'Unsettled Amount',
      subTitle: '(Total unsettled)',
      value: `${summary?.totalSellerUnsettle?.toFixed(2) ?? 0?.toFixed(2)} ${currency}`,
      icon: moneyExchangeIcon,
      iconBg: '#0c9da4',
    },
  ];

  if (shops?.length > 0) {
    console.log(shops);
    const selfDeliveredShop = shops.find((item) => item.haveOwnDeliveryBoy);
    const selfDeliveryOnlySummary = [
      {
        id: 3,
        title: 'Delivery Profit',
        subTitle: '(Only from delivery fees)',
        value: `${summary?.orderValue?.deliveryFee?.toFixed(2) || 0?.toFixed(2)} ${currency}`,
        icon: profitUpArrowIcon,
        iconBg: '#4C0033',
      },
    ];

    if (selfDeliveredShop) {
      topSummaryData = [...topSummaryData, ...selfDeliveryOnlySummary];
    }
  }

  return (
    <GlobalWrapper>
      {topSummaryData.length > 0 && <TopSummery data={topSummaryData} />}

      <Row>
        <Suspense fallback={<div>Loading...</div>}>
          <GraphInfo graphType="earning" />
        </Suspense>
      </Row>

      <Row>
        <Col xl={4} md={6}>
          <DashboardCard title="Shops" value={summary?.toalShopProfile} icon={shopIcon} color="#22a6ac" />
        </Col>
        <Col xl={4} md={6}>
          <DashboardCard title="Orders" value={summary?.totalOrder} icon={bagIcon} color="#459ed8" />
        </Col>

        <Col xl={4} md={6}>
          <DashboardCard
            title="Cancel Orders"
            value={summary?.totalCancelOrder}
            icon={cancelBagIcon}
            border="#f05179"
            color="#8c54ff"
          />
        </Col>
      </Row>

      <Row>
        <Suspense fallback={<div>Loading...</div>}>
          <GraphInfo graphType="order" />
        </Suspense>
      </Row>
    </GlobalWrapper>
  );
}

export default SellerDashboard;
