import React, { Suspense } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, Col, Row } from 'reactstrap';
import GlobalWrapper from './GlobalWrapper';
import GraphInfo from './GraphInfo';
import TopSummery from './TopSummery';

import deliveryIcon from '../assets/images/dashboard/delivery.png';
import earningFlowIcon from '../assets/images/dashboard/earning-flow.png';
import moneyExchangeIcon from '../assets/images/dashboard/money-exchange.png';
import orderAmountIcon from '../assets/images/dashboard/order-amount.png';
import profitFlowIcon from '../assets/images/dashboard/profit-flow.png';
import profitUpArrowIcon from '../assets/images/dashboard/profit-up-arrow.png';
import DashboardCard from './DashboardCard';
import VatInfo from './VatInfo';

import bagIcon from '../assets/images/dashboard/bag.png';
import cancelBagIcon from '../assets/images/dashboard/cancel-bag.png';
import shopIcon from '../assets/images/dashboard/shop.png';
import userIcon from '../assets/images/dashboard/user.png';

import activeRiderIcon from '../assets/images/dashboard/active-rider.png';
import amountIcon from '../assets/images/dashboard/amount.png';
import availableRiderIcon from '../assets/images/dashboard/available-rider.png';
import cashInHandIcon from '../assets/images/dashboard/cash-in-hand.png';
import riderIcon from '../assets/images/dashboard/rider.png';
import timerIcon from '../assets/images/dashboard/timer.png';
import vatIcon from '../assets/images/dashboard/vat.png';
import { useGlobalContext } from '../context';

function AdminDashboard({ summary, topActivity }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const topSummaryData = [
    {
      id: 1,
      title: 'Lyxa Earnings',
      subTitle: '(Total earnings)',
      value: `${summary?.totalDropEarning?.toFixed(2) ?? 0} ${currency}`,
      icon: earningFlowIcon,
      iconBg: 'red',
    },
    {
      id: 2,
      title: 'Order Profit',
      subTitle: '(Ex delivery fees)',
      value: `${summary?.dropEarningTotalOfItems?.toFixed(2) ?? 0} ${currency}`,
      icon: profitFlowIcon,
      iconBg: '#56ca00',
    },
    {
      id: 3,
      title: 'Delivery Profit',
      subTitle: '(Only from delivery fees)',
      value: `${summary?.dropEarningTotalOfDeliveryFee?.toFixed(2) ?? 0} ${currency}`,
      icon: profitUpArrowIcon,
      iconBg: '#f7c137',
    },
    {
      id: 4,
      title: "Delivery Fee's",
      subTitle: '(Total delivery fees)',
      value: `${summary?.ordersDeliveryFeesTotal?.toFixed(2) ?? 0} ${currency}`,
      icon: deliveryIcon,
      iconBg: '#00dcff',
    },
    {
      id: 5,
      title: 'Order Amount',
      subTitle: '(Ex delivery fees)',
      value: `${summary?.ordersItemTotal?.toFixed(2) ?? 0} ${currency}`,
      icon: orderAmountIcon,
      iconBg: '#ff5ca7',
    },
    {
      id: 6,
      title: 'Shops Unsettled Amount',
      subTitle: '(Total unsettled)',
      value: `${summary?.shopUnsettleAmount?.toFixed(2) ?? 0} ${currency}`,
      icon: moneyExchangeIcon,
      iconBg: '#0c9da4',
    },
  ];

  return (
    <GlobalWrapper>
      {topSummaryData.length > 0 && <TopSummery data={topSummaryData} />}
      <Row>
        <Col xl={3} md={6}>
          <DashboardCard title="Users" value={summary?.totalUser} icon={userIcon} border="#f05179" color="#8c54ff" />
        </Col>
        <Col xl={3} md={6}>
          <DashboardCard title="Shops" value={summary?.totalShopRegister} icon={shopIcon} color="#22a6ac" />
        </Col>
        <Col xl={3} md={6}>
          <DashboardCard title="Orders" value={summary?.totalOrder} icon={bagIcon} color="#459ed8" />
        </Col>
        <Col xl={3} md={6}>
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
        <Col md={9}>
          <Suspense fallback={<div>Loading...</div>}>
            <GraphInfo graphType="user" />
          </Suspense>
        </Col>
        <Col md={3}>
          <Card>
            <CardBody>
              <div className="d-flex mb-2">
                <img src={vatIcon} alt="icon" style={{ height: '30px', padding: '5px' }} />
                <h5 className="ms-2 text-dark" style={{ marginTop: 2 }}>
                  VAT Info
                </h5>
              </div>
              <VatInfo />
            </CardBody>
          </Card>
          <TopLists list={topActivity?.topUser} type="user" />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <TopLists list={topActivity?.topDeliveryBoy} type="deliveryBoy" />
        </Col>
        <Col md={9}>
          <Row>
            <Col xl={4}>
              <DashboardCard
                title="Available Riders"
                value={summary?.totalAvailableDeliveryBoy}
                icon={activeRiderIcon}
                color="#459ed8"
              />
            </Col>
            <Col xl={4}>
              <DashboardCard
                title="Online Riders"
                value={summary?.totalOnlineDeliveryBoy}
                icon={riderIcon}
                color="#f05179"
              />
            </Col>
            <Col xl={4}>
              <DashboardCard
                title="Active Riders"
                value={summary?.totalActiveDeliveryBoy}
                icon={availableRiderIcon}
                color="#0c9da4"
              />
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <DashboardCard
                title="Riders Unsettled Amount"
                value={`${summary?.deliveryBoyUnsettleAmount?.toFixed(2) ?? 0} ${currency}`}
                icon={amountIcon}
                color="#8c54ff"
              />
            </Col>
            <Col xl={4}>
              <DashboardCard
                title="Riders cash in hands"
                value={`${summary?.chashInHandDeliveryBoy?.toFixed(2) ?? 0} ${currency}`}
                icon={cashInHandIcon}
                color="yellow"
              />
            </Col>
            <Col xl={4}>
              <DashboardCard
                title="Avarage delivery time"
                value={`${summary?.totalAveratgeDeliveredTime?.toFixed(2)} Min`}
                icon={timerIcon}
                color="#f15179"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md={9}>
          <Suspense fallback={<div>Loading...</div>}>
            <GraphInfo graphType="order" />
          </Suspense>
        </Col>

        <Col md={3}>
          <TopLists list={topActivity?.topShop} type="shop" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Suspense fallback={<div>Loading...</div>}>
            <GraphInfo graphType="earning" />
          </Suspense>
        </Col>
      </Row>
    </GlobalWrapper>
  );
}

function TopLists({ list, type }) {
  return (
    <Card style={{ height: '340px' }}>
      <CardBody>
        <div className="d-flex mb-2">
          <i
            className={`${
              type === 'user' ? 'fa fa-user' : type === 'deliveryBoy' ? 'fa fa-people-carry' : 'fa fa-store'
            }`}
            style={{ fontSize: '18px', padding: '5px' }}
          ></i>
          <h5 className="ms-2 text-dark" style={{ marginTop: 2 }}>
            Top {`${type === 'user' ? 'Users' : type === 'deliveryBoy' ? 'Delivery Boys' : 'Shops'}`}
          </h5>
        </div>
        <i className="fa-sharp fa-solid fa-moped"></i>
        <Table id="tech-companies-1" className="table table__wrapper table-hover cursor-pointer">
          <Thead>
            <Tr style={{ color: 'transparent' }}>
              <Th></Th>
              <Th></Th>
              <Th className="p-0 text-muted">Orders</Th>
            </Tr>
          </Thead>
          <Tbody style={{ position: 'relative', borderTop: 'none' }}>
            {list?.length > 0 &&
              list?.map((item, index) => (
                <Tr
                  key={item._id}
                  className="align-middle"
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'black',
                  }}
                >
                  <Th
                    style={{
                      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                    }}
                  >
                    #{index + 1}
                  </Th>

                  <Td>{type === 'shop' ? item?.shopName : item?.name}</Td>
                  <Td className="text-end">{type === 'user' ? item?.orderCompleted : item?.totalOrder}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default AdminDashboard;
