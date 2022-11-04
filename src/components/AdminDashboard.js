import React from "react";
import GlobalWrapper from "./GlobalWrapper";
import {
    Row,
    Col,


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
import TopSummery from "./TopSummery";

const AdminDashboard = ({ summery }) => {

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
            title: "Profits(Products)",
            value: `${summery?.dropEarningTotalOfItems ?? 0} NGN`,
            icon: profitFlowIcon,
            iconBg: '#56ca00'

        },
        {
            id: 3,
            title: "Profits(Delivery Fee)",
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
            title: "Order Amounts(Products)",
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
                        <DashboardCard title='Users' value={summery?.totalUser} icon={userIcon} border={"#f05179"} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Shops' value={summery?.totalShopRegister} icon={shopIcon} border={"#22a6ac"} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Orders' value={summery?.totalOrder} icon={bagIcon} border={"#459ed8"} />
                    </Col>

                    <Col xl={3} md={6}>
                        <DashboardCard title='Cancel Orders' value={summery?.totalCancelOrder} icon={cancelBagIcon} border={"#8c54ff"} />
                    </Col>


                </Row>

                {/* <Row>
                    <Col xl={3} md={6}>
                        <DashboardCard title="Delivery Boy's" value={summery?.totalDeliveryBoy} icon={bagIcon} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Orders Amount(Without Delivery Fee)' value={`${summery?.ordersItemTotal ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Profit(Without Delivery fee)' value={`${summery?.dropEarningTotalOfItems ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Lyxa  Earning' value={`${summery?.totalDropEarning ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>


                </Row>

                <Row>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Delivery Fees' value={`${summery?.ordersDeliveryFeesTotal ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Profit From Delivery Fee' value={`${summery?.dropEarningTotalOfDeliveryFee ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>

                    <Col xl={3} md={6}>
                        <DashboardCard title='Shops Unsettled Amount' value={`${summery?.shopUnsettleAmount ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>


                    <Col xl={3} md={6}>
                        <DashboardCard title='Riders Unsettled Amount' value={`${summery?.deliveryBoyUnsettleAmount ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>

                </Row>

                <Row>

                    <Col xl={3} md={6}>
                        <DashboardCard title='Riders cash in hands' value={`${summery?.chashInHandDeliveryBoy ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Active Riders' value={summery?.totalActiveDeliveryBoy} icon={user3} />
                    </Col>

                    <Col xl={3} md={6}>
                        <DashboardCard title='Available Riders' value={summery?.totalAvailableDeliveryBoy} icon={user3} />
                    </Col>


                    <Col xl={3} md={6}>
                        <DashboardCard title='Avarage delivery time' value={`${summery?.totalAveratgeDeliveredTime} Min`} icon={servicesIcon4} />
                    </Col>
                </Row>

                <Row>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Incoming Chat Requests' value={summery?.totalIncomingChat} icon={servicesIcon2} />
                    </Col>
                </Row> */}

            </GlobalWrapper>
        </React.Fragment>
    );
};




export default AdminDashboard;
