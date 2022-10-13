import React from "react";
import { Card, CardBody } from "reactstrap";





const DashboardCard = ({ title, value, icon }) => {

    return (
        <React.Fragment>
            <Card className="mini-stat bg-primary text-white" style={{ height: '140px' }}>
                <CardBody>
                    <div className="mb-4 d-flex h-100">
                        <div className="float-start mini-stat-img me-4">
                            <img src={icon} alt="" />
                        </div>
                        <div style={{ flex: '1' }}>
                            <h5 className="font-size-14 text-uppercase mt-0">
                                {title}
                            </h5>
                            <h4 className="fw-medium font-size-18">
                                {value ?? 0}
                                {/* <i className="mdi mdi-arrow-up text-success ms-2"></i> */}
                            </h4>
                        </div>

                    </div>

                </CardBody>
            </Card>
        </React.Fragment>
    )


}




export default DashboardCard;
