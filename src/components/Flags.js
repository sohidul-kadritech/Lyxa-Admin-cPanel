import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import styled from "styled-components";

const Flags = ({ flags = [], isFromOrder = false }) => {
  return (
    <Card>
      <CardBody>
        <CardTitle>Flags</CardTitle>
        <hr />
        <FlagsWrapper>
          {flags.length > 0 &&
            flags.map((item, index) => (
              <div key={index}>
                {!isFromOrder ? (
                  <span className="order_id">{`Order Id: ${item?.orderId?.orderId}`}</span>
                ) : (
                  <span className="order_id">{`Flag Sent: ${
                    item?.shop ? "Shop /" : ""
                  }  ${item?.delivery ? "Rider /" : ""}  ${
                    item?.user ? "User" : ""
                  }`}</span>
                )}
                <div className="comment_wrapper">
                  <span className="comment_title">Comment: </span>
                  <p className="comment">{item?.comment}</p>
                </div>
                <hr />
              </div>
            ))}
        </FlagsWrapper>
      </CardBody>
    </Card>
  );
};

const FlagsWrapper = styled.div`
  max-height: 300px;
  overflow: hidden scroll;

  .order_id {
    font-size: 15px;
    font-weight: 500;
  }

  .comment_wrapper {
    margin-top: 10px;
    .comment_title {
      font-size: 15px;
      font-weight: 500;
    }
    .comment {
      max-height: 60px;
      overflow: hidden scroll;
    }
  }
`;

export default Flags;
