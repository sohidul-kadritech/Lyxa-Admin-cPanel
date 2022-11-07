import React from "react";
import styled from "styled-components";
import { Row, Col, Card, CardBody, Spinner } from "reactstrap";

const TopSummery = ({ data }) => {
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Row className="d-flex align-items-center">
            {data?.length > 0 ? (
              data?.map((item, index) => {
                const { icon, title, subTitle, value, iconBg } = item;
                return (
                  <Col md={2} key={index} className="px-1">
                    <div>
                      <strong className="font-size-14 text-muted">
                        {title}
                      </strong>
                    </div>
                    <div style={{ marginBottom: 5 }}>
                      <strong
                        className="font-size-11"
                        style={{ color: "#adb5bd" }}
                      >
                        {subTitle}
                      </strong>
                    </div>
                    <Wrapper iconBg={iconBg}>
                      <div
                        className="image-wrapper"
                        style={{ textAlign: "center" }}
                      >
                        <img
                          src={icon}
                          alt={title}
                          style={{ height: 25, width: 25, marginTop: 2 }}
                        />
                      </div>

                      <h6 className="value">{value}</h6>
                    </Wrapper>
                  </Col>
                );
              })
            ) : (
              <div className="text-center">
                <Spinner animation="border" variant="info" />
              </div>
            )}
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  // margin-top: 10px;
  // height: 70px;
  .image-wrapper {
    background-color: ${({ iconBg }) => iconBg};
    padding: 5px;
    border-radius: 5px;
    width: 40px;
    height: 40px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .value {
    font-size: 18px;
  }
`;

export default TopSummery;
