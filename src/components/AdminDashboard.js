import React from "react";
import GlobalWrapper from "./GlobalWrapper";
import {
    Container,
    Row,
    Col,

} from "reactstrap"


import servicesIcon2 from "../assets/images/services-icon/01.png";
import servicesIcon3 from "../assets/images/services-icon/03.png";
import servicesIcon4 from "../assets/images/services-icon/04.png";
import servicesIcon5 from "../assets/images/services-icon/05.png";
import user2 from "../assets/images/users/user-2.jpg";
import user3 from "../assets/images/users/user-3.jpg";
import DashboardCard from "./DashboardCard";



const AdminDashboard = ({ summery }) => {
    return (
        <React.Fragment>
            <GlobalWrapper>



                <Row>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Users' value={summery?.totalUser} icon={user2} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Shops' value={summery?.totalShopRegister} icon={servicesIcon5} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title="Delivery Boy's" value={summery?.totalDeliveryBoy} icon={user3} />
                    </Col>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Orders' value={summery?.totalOrder} icon={servicesIcon2} />
                    </Col>


                </Row>

                <Row>
                    <Col xl={3} md={6}>
                        <DashboardCard title='Cancel Orders' value={summery?.totalCancelOrder} icon={servicesIcon3} />
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
                </Row>

            </GlobalWrapper>
        </React.Fragment>
    );
};




export default AdminDashboard;
