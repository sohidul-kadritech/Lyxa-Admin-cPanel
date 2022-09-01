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
  /* max-height: 250px;
  overflow: hidden scroll; */

  .info_wrapper {
    flex: 1;
  }
  .delete_btn_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid lightgray;
    height: 50px; */
    padding: 0px 3px;

    .fa-trash {
      color: red;
    }
  }
  /* .order_id {
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
  } */
`;

export default Flags;
