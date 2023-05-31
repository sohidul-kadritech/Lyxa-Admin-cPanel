import React, { lazy, Suspense } from 'react';
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
import { useGlobalContext } from '../context';

const GraphInfo = lazy(() => import('./GraphInfo'));

function ShopDashboard({ summary }) {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();
  // const { haveOwnDeliveryBoy } = useSelector((store) => store.Login.admin);
  // console.log(haveOwnDeliveryBoy);
  const { currentUser, general } = useGlobalContext();
  const currency = general?.currency?.code;
  const { shop } = currentUser;

  let topSummaryData = [
    {
      id: 1,
      title: 'Earnings',
      subTitle: '(Total earnings)',
      value: `${summary?.totalShopEarning?.toFixed(2) ?? 0} ${currency}`,
      icon: earningFlowIcon,
      iconBg: '#0008C1',
    },
    {
      id: 2,
      title: 'Total Profit',
      subTitle: '(From order amount)',
      value: `${summary?.toalShopProfile?.toFixed(2) ?? 0}${currency}`,
      icon: profitFlowIcon,
      iconBg: '#56ca00',
    },

    {
      id: 5,
      title: 'Order Amount',
      subTitle: '(Ex delivery fees)',
      value: `${summary?.orderValue?.productAmount?.toFixed(2) ?? 0} ${currency}`,
      icon: orderAmountIcon,
      iconBg: '#ff5ca7',
    },
    {
      id: 6,
      title: 'Unsettled Amount',
      subTitle: '(Total unsettled)',
      value: `${summary?.totalShopUnsettle?.toFixed(2) ?? 0} ${currency}`,
      icon: moneyExchangeIcon,
      iconBg: '#0c9da4',
    },
  ];

  const selfDeliveryOnlySummary = [
    {
      id: 3,
      title: 'Delivery Profit',
      subTitle: '(Only from own riders)',
      value: `${summary?.orderValue?.deliveryFee?.toFixed(2) || 0} ${currency}`,
      icon: profitUpArrowIcon,
      iconBg: '#1A4D2E',
    },
  ];

  if (shop?.haveOwnDeliveryBoy) {
    topSummaryData = [...topSummaryData, ...selfDeliveryOnlySummary];
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
          <DashboardCard title="Deliverd Orders" value={summary?.totalDeliverOrder} icon={bagIcon} color="#459ed8" />
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

export default ShopDashboard;
