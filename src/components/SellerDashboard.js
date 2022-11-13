import React, { Suspense, lazy } from "react";
import GlobalWrapper from "./GlobalWrapper";
import { Row, Col } from "reactstrap";
import DashboardCard from "./DashboardCard";
import moneyExchangeIcon from "../assets/images/dashboard/money-exchange.png";
import orderAmountIcon from "../assets/images/dashboard/order-amount.png";
import deliveryIcon from "../assets/images/dashboard/delivery.png";
import profitFlowIcon from "../assets/images/dashboard/profit-flow.png";
import profitUpArrowIcon from "../assets/images/dashboard/profit-up-arrow.png";
import earningFlowIcon from "../assets/images/dashboard/earning-flow.png";
import TopSummery from "./TopSummery";

import cancelBagIcon from "../assets/images/dashboard/cancel-bag.png";
import shopIcon from "../assets/images/dashboard/shop.png";
import bagIcon from "../assets/images/dashboard/bag.png";

const OrdersGraph = lazy(() => import("./OrdersGraph"));
const EarningsGraph = lazy(() => import("./EarningsGraph"));

const SellerDashboard = ({ summary }) => {
    const topSummaryData = [
        {
            id: 1,
            title: "Earnings",
            subTitle: "(Total earnings)",
            value: `${summary?.totalSellerEarning ?? 0} NGN`,
            icon: earningFlowIcon,
            iconBg: "red",
        },
        {
            id: 2,
            title: "Order Profit",
            subTitle: "(Ex delivery fees)",
            value: `${summary?.orderValue?.productAmount ?? 0} NGN`,
            icon: profitFlowIcon,
            iconBg: "#56ca00",
        },
        {
            id: 3,
            title: "Delivery Profit",
            subTitle: "(Only from delivery fees)",
            value: `${summary?.orderValue?.deliveryFee ?? 0} NGN`,
            icon: profitUpArrowIcon,
            iconBg: "#f7c137",
        },
        {
            id: 4,
            title: "Delivery Fee's",
            subTitle: "(Total delivery fees)",
            value: `${summary?.orderValue?.deliveryFee ?? 0} NGN`,
            icon: deliveryIcon,
            iconBg: "#00dcff",
        },
        {
            id: 5,
            title: "Order Amount",
            subTitle: "(Ex delivery fees)",
            value: `${summary?.orderValue?.totalAmount ?? 0} NGN`,
            icon: orderAmountIcon,
            iconBg: "#ff5ca7",
        },
        {
            id: 6,
            title: "Unsettled Amount",
            subTitle: "(Total unsettled)",
            value: `${summary?.totalSellerUnsettle ?? 0} NGN`,
            icon: moneyExchangeIcon,
            iconBg: "#0c9da4",
        },
    ];
    return (
        <React.Fragment>
            <GlobalWrapper>
                {topSummaryData.length > 0 && <TopSummery data={topSummaryData} />}

                <Row>
                    <Suspense fallback={<div>Loading...</div>}>
                        <EarningsGraph />
                    </Suspense>
                </Row>

                <Row>
                    <Col xl={4} md={6}>
                        <DashboardCard
                            title="Shops"
                            value={summary?.toalShopProfile}
                            icon={shopIcon}
                            color={"#22a6ac"}
                        />
                    </Col>
                    <Col xl={4} md={6}>
                        <DashboardCard
                            title="Orders"
                            value={summary?.totalOrder}
                            icon={bagIcon}
                            color={"#459ed8"}
                        />
                    </Col>

                    <Col xl={4} md={6}>
                        <DashboardCard
                            title="Cancel Orders"
                            value={summary?.totalCancelOrder}
                            icon={cancelBagIcon}
                            border={"#f05179"}
                            color="#8c54ff"
                        />
                    </Col>
                </Row>

                <Row>
                    <Suspense fallback={<div>Loading...</div>}>
                        <OrdersGraph />
                    </Suspense>
                </Row>
            </GlobalWrapper>
        </React.Fragment>
    );
};

export default SellerDashboard;
