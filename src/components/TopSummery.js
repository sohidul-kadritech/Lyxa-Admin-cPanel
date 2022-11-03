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
    console.log({ data });
    return (
        <React.Fragment>
            <Card>
                <CardBody >
                    <Row className="d-flex align-items-center">
                        {data?.length > 0 ? data?.map((item, index) => {
                            const { icon, title, value, iconBg } = item;
                            return (
                                <Col md={2} key={index} className="px-1">
                                    <Wrapper iconBg={iconBg}>
                                        <div className="image-wrapper">
                                            <img src={icon} alt={title} />
                                        </div>
                                        <div className="content-wrapper">
                                            <small className="title">{title}</small>
                                            <h6 className="value">{value}</h6>
                                        </div>
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
// justify-content: space-evenly;
// height: 65px;
.image-wrapper{
    background-color: ${({ iconBg }) => iconBg};
    padding: 5px;
    border-radius: 5px;
    width: 61px;
    height: 61px;

    img{
        width: 100%;
        height: 100%;
    }
}

.content-wrapper{
    flex: 1;
    padding-left: 4px; 
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    .title{
        font-size: 12px;
        color: ligthgray;
    }
    .value{
        font-size: 17px;
    }
}


`

export default TopSummery;
