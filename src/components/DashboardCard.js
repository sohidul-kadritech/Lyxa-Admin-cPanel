import React from "react";
import { Card, CardBody } from "reactstrap";
import styled from "styled-components";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <React.Fragment>
      <Card className="mini-stat" style={{ height: "140px" }}>
        <CardBody>
          <Wrapper color={color}>
            <h5 className="font-size-14">{title}</h5>

            <div className="border"></div>

            <div className="d-flex mt-2">
              <div className="img_wrapper">
                <img src={icon} style={{ height: 40, marginTop: 7 }} alt="" />
              </div>

              <h4 className="value">{value ?? 0}</h4>
            </div>
          </Wrapper>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const Wrapper = styled.div`
  .border {
    border-bottom: ${({ color }) => `2px solid ${color} !important`};
    width: 20px;
  }

  .img_wrapper {
    width: 65px;
    height: 65px;
    text-align: center;
    padding: 5px;
    border-radius: 5px;
    background-color: #e8e2f7;

    img {
    }
  }

  .value {
    padding-left: 20px;
    font-weight: 28px;
  }
`;

export default DashboardCard;
