import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import { orderStatusOptions } from "../assets/staticData";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder, orderUpdateStatus } from "../store/order/orderAction";
import { useEffect } from "react";

const OrderTable = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {orders, loading , status } = useSelector((state) => state.orderReducer)

  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [shop, setShop] = useState(null);
  const [deliveryBoy, setDeliveryBoy] = useState(null);



  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      orderUpdateStatus({
        orderId,
        orderStatus,
        shop,
        deliveryBoy,
      })
    );
  };

  useEffect(()=>{
    if(status){
      setIsUpdateStatus(false);
      dispatch(getAllOrder(true));
    }
  },[status])

  return (
    <>
      <div>
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md={3} className="text-end" />
            </Row>
            <CardTitle className="h4"> Order List</CardTitle>
            <Table
              id="tech-companies-1"
              className="table table__wrapper table-striped table-bordered table-hover text-center"
            >
              <Thead>
                <Tr>
                  <Th>Order Id</Th>
                  <Th>Delivery Address</Th>
                  <Th>Status</Th>
                  <Th>Payment Status</Th>
                  <Th>Total Amount</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody style={{ position: "relative" }}>
                {orders.map((item, index) => {
                  return (
                    <Tr
                      key={index}
                      className="align-middle"
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      <Th>{item?.orderId}</Th>

                      <Td style={{ maxWidth: "120px" }}>
                        {item?.orderDeliveryAddress?.address}
                      </Td>
                      <Td>{item?.orderStatus}</Td>
                      <Td>{item?.paymentStatus}</Td>
                      <Td>{item.summery?.total}</Td>
                      <Td>
                        <div>
                          <Tooltip title="Update Status">
                            <button
                              className="btn btn-info button me-xl-2  me-0"
                              onClick={() => {
                                setIsUpdateStatus(!isUpdateStatus);
                                setOrderId(item?._id);
                                setShop(item?.shop?._id);
                              }}
                            >
                              <i className="fa fa-arrow-up" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Details">
                            <button
                              className="btn btn-info button"
                              onClick={() => {
                                history.push(`/orders/details/${item._id}`);
                              }}
                            >
                              <i className="fa fa-eye" />
                            </button>
                          </Tooltip>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            {loading && (
              <div className="text-center">
                <Spinner animation="border" variant="success" />
              </div>
            )}
            {!loading && orders.length < 1 && (
              <div className="text-center">
                <h4>No Order!</h4>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* UPDATE ORDER STATUS */}

      <Modal
        isOpen={isUpdateStatus}
        toggle={() => {
          setIsUpdateStatus(!isUpdateStatus);
        }}
        centered={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Update Status</h5>
          <button
            type="button"
            onClick={() => {
              setIsUpdateStatus(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Form className="mb-4" onSubmit={handleSubmit}>
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">
                Select A Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderStatus}
                label="Food Type"
                onChange={(event) => {
                  setOrderStatus(event.target.value);
                }}
              >
                {orderStatusOptions.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="mt-3 d-flex justify-content-end">
              <Button type="submit" color="success" disabled={loading}>
                {loading ? 'Updating' : 'Update'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default OrderTable;
