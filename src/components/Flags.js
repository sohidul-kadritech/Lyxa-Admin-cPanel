import React from "react";
import { useDispatch } from "react-redux";
import { Card, CardBody, CardTitle } from "reactstrap";
import styled from "styled-components";
import { DeleteOrderFlag } from "../store/order/orderAction";
import Info from "./Info";

const Flags = ({ flags = [], isFromOrder = false }) => {
  const dispatch = useDispatch();

  return (
    <Card>
      <CardBody>
        <CardTitle>Flags</CardTitle>
        <hr />
        <div className="d-flex">
          <h5>{isFromOrder ? "Account" : "Order ID"}</h5>
          <h5 style={{ marginLeft: "120px" }}>Comment</h5>
        </div>
        <FlagsWrapper>
          {flags.length > 0 &&
            flags.map((item, index) => (
              <div key={index} className="d-flex">
                <div className="info_wrapper">
                  <Info
                    title={
                      isFromOrder
                        ? item?.user
                          ? "User"
                          : item?.shop
                          ? "Shop"
                          : "Delivery Boy"
                        : item?.orderId?.orderId
                    }
                    value={item?.comment}
                    flagOrderRoute={
                      !isFromOrder && `/orders/details/${item?.orderId?._id}`
                    }
                  />
                </div>
                {isFromOrder && (
                  <div
                    className="delete_btn_wrapper"
                    onClick={() => dispatch(DeleteOrderFlag(item?._id))}
                  >
                    <i className="fa fa-trash cursor-pointer"></i>
                  </div>
                )}
              </div>
            ))}
        </FlagsWrapper>
      </CardBody>
    </Card>
  );
};

const FlagsWrapper = styled.div`
  max-height: 400px;
  overflow: hidden scroll;

  .info_wrapper {
    flex: 1;
  }
  .delete_btn_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 3px;

    .fa-trash {
      color: red;
    }
  }
`;

export default Flags;
