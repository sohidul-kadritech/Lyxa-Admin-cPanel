import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import styled from 'styled-components';
import CircularLoader from './CircularLoader';

function TopSummery({ data, fromWallet = false }) {
  return (
    <Card>
      <CardBody>
        <Row className="d-flex align-items-center">
          {data?.length > 0 ? (
            data?.map((item) => {
              const { icon, title, subTitle, value, iconBg } = item;
              return (
                <Col
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  md={12 % data?.length !== 0 ? 2 : 12 / data?.length}
                  key={Math.random()}
                  className={`${fromWallet ? 'px-3' : 'px-1'}`}
                >
                  <div>
                    <strong className="font-size-14 text-muted">{title}</strong>
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    <strong className="font-size-11" style={{ color: '#adb5bd' }}>
                      {subTitle}
                    </strong>
                  </div>
                  <Wrapper iconBg={iconBg} fromWallet={fromWallet}>
                    <div className="image-wrapper" style={{ textAlign: 'center' }}>
                      <img src={icon} alt={title} style={{ height: 25, width: 25, marginTop: 2 }} />
                    </div>

                    <h6 className="value">{value}</h6>
                  </Wrapper>
                </Col>
              );
            })
          ) : (
            <div className="text-center">
              <CircularLoader />
            </div>
          )}
        </Row>
      </CardBody>
    </Card>
  );
}

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
    padding-left: ${({ fromWallet }) => fromWallet && '5px'};
  }
`;

export default TopSummery;
