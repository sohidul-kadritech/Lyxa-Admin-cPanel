import React, { Suspense, lazy } from "react";
import GlobalWrapper from "./GlobalWrapper";
import {
    Row,
    Col,
    Card,
    CardBody,
} from "reactstrap"


import DashboardCard from "./DashboardCard";
import moneyExchangeIcon from "../assets/images/dashboard/money-exchange.png";
import orderAmountIcon from "../assets/images/dashboard/order-amount.png";
import deliveryIcon from "../assets/images/dashboard/delivery.png";
import profitFlowIcon from "../assets/images/dashboard/profit-flow.png";
import profitUpArrowIcon from "../assets/images/dashboard/profit-up-arrow.png";
import earningFlowIcon from "../assets/images/dashboard/earning-flow.png";

import userIcon from "../assets/images/dashboard/user.png";
import cancelBagIcon from "../assets/images/dashboard/cancel-bag.png";
import shopIcon from "../assets/images/dashboard/shop.png";
import bagIcon from "../assets/images/dashboard/bag.png";

import riderIcon from "../assets/images/dashboard/rider.png";
import availableRiderIcon from "../assets/images/dashboard/available-rider.png";
import activeRiderIcon from "../assets/images/dashboard/active-rider.png";
import timerIcon from "../assets/images/dashboard/timer.png";
import amountIcon from "../assets/images/dashboard/amount.png";
import cashInHandIcon from "../assets/images/dashboard/cash-in-hand.png";
import TopSummery from "./TopSummery";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

const OrdersGraph = lazy(() => import("./OrdersGraph"));
const EarningsGraph = lazy(() => import("./EarningsGraph"));
const UsersGraph = lazy(() => import("./UsersGraph"));

const TopLists = ({ list, type }) => {
    return (
        <Card style={{ height: '340px' }}>
            <CardBody>
                <div className="d-flex mb-2">
                    <i className="fa fa-user" style={{ fontSize: '18px', padding: "5px" }}></i>
                    <h5 className="ms-2 text-dark">Top {`${type === 'user' ? "Users" : type === 'deliveryBoy' ? 'Delivery Boys' : 'Shops'}`}</h5>
                </div>

                <Table
                    id="tech-companies-1"
                    className="table table__wrapper table-hover cursor-pointer"
                >
                    <Thead>
                        <Tr style={{ color: "transparent" }}>
                            <Th></Th>
                            <Th></Th>
                            <Th className='p-0 text-muted'>Orders</Th>
                        </Tr>
                    </Thead>
                    <Tbody style={{ position: "relative", borderTop: 'none' }}>
                        {list?.length > 0 &&
                            list?.map((item, index) => {
                                return (
                                    <Tr
                                        key={index}
                                        className="align-middle"
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            color: "black"
                                        }}
                                    >
                                        <Th style={{ color: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}>#{index + 1}</Th>

                                        <Td>{type === 'shop' ? item?.shopName : item?.name}</Td>
                                        <Td className="text-end">{type === 'user' ? item?.orderCompleted : item?.totalOrder}</Td>
                                    </Tr>
                                );
                            })}
                    </Tbody>
                </Table>

            </CardBody>
        </Card>

    )
}

const AdminDashboard = ({ summery, topActivity }) => {

    const topSummaryData = [
        {
            id: 1,
            title: "Lyxa Earning's",
            value: `${summery?.totalDropEarning ?? 0} NGN`,
            icon: earningFlowIcon,
            iconBg: 'red'
        },
        {
            id: 2,
            title: "Profits(Without Delivery Fee's)",
            value: `${summery?.dropEarningTotalOfItems ?? 0} NGN`,
            icon: profitFlowIcon,
            iconBg: '#56ca00'

        },
        {
            id: 3,
            title: "Profits(From Delivery Fee's)",
            value: `${summery?.dropEarningTotalOfDeliveryFee ?? 0} NGN`,
            icon: profitUpArrowIcon,
            iconBg: '#f7c137'
        },
        {
            id: 4,
            title: "Delivery Fee's",
            value: `${summery?.ordersDeliveryFeesTotal ?? 0} NGN`,
            icon: deliveryIcon,
            iconBg: '#00dcff'
        },
        {
            id: 5,
            title: "Order Amounts(Without Delivery Fee's)",
            value: `${summery?.ordersItemTotal ?? 0} NGN`,
            icon: orderAmountIcon,
            iconBg: '#ff5ca7'
        },
        {
            id: 6,
            title: "Shops Unsettled Amount",
            value: `${summery?.shopUnsettleAmount ?? 0} NGN`,
            icon: moneyExchangeIcon,
            iconBg: '#0c9da4'
        }
    ]

    return (
        <React.Fragment>
            <GlobalWrapper>



                {topSummaryData.length > 0 && <TopSummery data={topSummaryData} />}

                <Row>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Users' value={summery?.totalUser} icon={userIcon} border={"#f05179"} color="#8c54ff" />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Shops' value={summery?.totalShopRegister} icon={shopIcon} color={"#22a6ac"} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Orders' value={summery?.totalOrder} icon={bagIcon} color={"#459ed8"} />
                    </Col>

                    <Col xl={3} md={6}>
                        <DashboardCard title='Cancel Orders' value={summery?.totalCancelOrder} icon={cancelBagIcon} border={"#f05179"} color="#8c54ff" />
                    </Col>


                </Row>

                <Row>
                    <Col md={9}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <UsersGraph />
                        </Suspense>
                    </Col>
                    <Col md={3}>

                        <TopLists list={topActivity?.topUser} type="user" />
                    </Col>
                </Row>

                <Row>
                    <Col md={3}>
                        <TopLists list={topActivity?.topDeliveryBoy} type='deliveryBoy' />
                    </Col>
                    <Col md={9}>
                        <Row>
                            <Col xl={4} >
                                <DashboardCard title="Delivery Boy's" value={summery?.totalDeliveryBoy} icon={riderIcon} color={"#f05179"} />
                            </Col>
                            <Col xl={4} >
                                <DashboardCard title='Active Riders' value={summery?.totalActiveDeliveryBoy} icon={availableRiderIcon} color={"#0c9da4"} />
                            </Col>

                            <Col xl={4} >
                                <DashboardCard title='Available Riders' value={summery?.totalAvailableDeliveryBoy} icon={activeRiderIcon} color={"#459ed8"} />
                            </Col>

                        </Row>
                        <Row>
                            <Col xl={4}>
                                <DashboardCard title='Riders Unsettled Amount' value={`${summery?.deliveryBoyUnsettleAmount ?? 0} NGN`} icon={amountIcon} color={"#8c54ff"} />
                            </Col>
                            <Col xl={4}>
                                <DashboardCard title='Riders cash in hands' value={`${summery?.chashInHandDeliveryBoy ?? 0} NGN`} icon={cashInHandIcon} color={'yellow'} />
                            </Col>
                            <Col xl={4}>
                                <DashboardCard title='Avarage delivery time' value={`${summery?.totalAveratgeDeliveredTime?.toFixed(2)} Min`} icon={timerIcon} color={'#f15179'} />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col md={9}>

                        <Suspense fallback={<div>Loading...</div>}>
                            <OrdersGraph />
                        </Suspense>
                    </Col>

                    <Col md={3}>
                        <TopLists list={topActivity?.topShop} type='shop' />
                    </Col>

                </Row>

                <Row>
                    <Col>
                        <Suspense fallback={<div>Loading...</div>}>
                            <EarningsGraph />
                        </Suspense>
                    </Col>
                </Row>

            </GlobalWrapper>
        </React.Fragment>
    );
};




export default AdminDashboard;
