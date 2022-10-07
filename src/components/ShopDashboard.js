import React from "react";
import GlobalWrapper from "./GlobalWrapper";
import {

    Row,
    Col,

} from "reactstrap"


import servicesIcon2 from "../assets/images/services-icon/01.png";
import servicesIcon3 from "../assets/images/services-icon/03.png";
import servicesIcon4 from "../assets/images/services-icon/04.png";
import DashboardCard from "./DashboardCard";



const ShopDashboard = ({ summery }) => {
    return (
        <React.Fragment>
            <GlobalWrapper>


                <Row>

                    <Col xl={3} md={6}>
                        <DashboardCard title='Orders' value={summery?.totalOrder} icon={servicesIcon2} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='cancel orders' value={summery?.totalCancelOrder ?? 0} icon={servicesIcon2} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Orders Amount' value={summery?.orderAmount} icon={servicesIcon3} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='profit from orders Items' value={summery?.profitFromOrderItems} icon={servicesIcon3} />
                    </Col>


                </Row>

                <Row>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Earnings' value={`${summery?.shopEarning ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Delivery Fees' value={summery?.deliveryFeeAmount} icon={servicesIcon3} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Unsettled amounts' value={`${summery?.shopUnsettleAmount ?? 0} NGN`} icon={servicesIcon4} />
                    </Col>
                </Row>

            </GlobalWrapper>
        </React.Fragment>
    );
};




export default ShopDashboard;
