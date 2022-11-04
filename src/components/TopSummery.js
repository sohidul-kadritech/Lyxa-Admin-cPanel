import React from "react";
import styled from "styled-components";
import {
    Row,
    Col,
    Card,
    CardBody,
    Spinner,

} from "reactstrap"

const TopSummery = ({ data }) => {

    return (
        <React.Fragment>
            <Card>
                <CardBody >
                    <Row className="d-flex align-items-center">
                        {data?.length > 0 ? data?.map((item, index) => {
                            const { icon, title, value, iconBg } = item;
                            return (
                                <Col md={2} key={index} className="px-1">
                                    <span className="font-size-13 text-dark">{title}</span>
                                    <Wrapper iconBg={iconBg}>

                                        <div className="image-wrapper">
                                            <img src={icon} alt={title} />
                                        </div>


                                        <h6 className="value">{value}</h6>

                                    </Wrapper>
                                </Col>
                            )
                        }) : <div className="text-center">
                            <Spinner animation="border" variant="info" />
                        </div>}
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};


const Wrapper = styled.div`

display: flex;
align-items: center;
.image-wrapper{
    background-color: ${({ iconBg }) => iconBg};
    padding: 5px;
    border-radius: 5px;
    width: 40px;
    height: 40px;

    img{
        width: 100%;
        height: 100%;
    }
}

.value{
    font-size: 18px;
}




`

export default TopSummery;
