import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
import { allDeliveryMan } from "../store/DeliveryMan/DeliveryManAction";

const OrderTable = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { orders, loading, status } = useSelector(
    (state) => state.orderReducer
  );

  const { deliveryMans } = useSelector((state) => state.deliveryManReducer);

  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [shop, setShop] = useState(null);
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [deliverySearchKey, setDeliverySearchKey] = useState(null);

  // UPDATE ORDER STATUS

  const updateOrderStatus = (oId, shopId, orderStatus) => {
    setIsUpdateStatus(!isUpdateStatus);
    setOrderId(oId);
    setShop(shopId);
    setOrderStatus(orderStatus);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ orderId }, { deliveryBoy: deliveryBoy?._id });
    dispatch(
      orderUpdateStatus({
        orderId,
        orderStatus,
        shop,
        deliveryBoy: deliveryBoy?._id,
      })
    );
  };

  useEffect(() => {
    if (status) {
      setIsUpdateStatus(false);
    }
  }, [status]);

  // GET ALL DELIVERY BOY

  useEffect(() => {
    if (orderStatus === "accepted_delivery_boy") {
      dispatch(allDeliveryMan(true));
    }
  }, [orderStatus]);

  // setDelivery boy

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
                  <Th>Customer name</Th>
                  <Th>Shop name</Th>
                  <Th>Order Date</Th>
                  <Th>Amount</Th>
                  <Th>Payment method</Th>
                  <Th>Order Status</Th>
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
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      <Th>{item?.orderId}</Th>

                      <Td>{item?.user?.name}</Td>
                      <Td>{item?.shop?.shopName}</Td>
                      <Td>{new Date(item?.createdAt).toLocaleDateString()}</Td>
                      <Td>{item?.summary?.totalPrice}</Td>
                      <Td>{item?.paymentMethod}</Td>
                      <Td>{item?.orderStatus}</Td>
                      <Td>
                        <div>
                          <Tooltip title="Update Status">
                            <button
                              className="btn btn-info button me-md-0  me-2"
                              onClick={() =>
                                updateOrderStatus(
                                  item?._id,
                                  item?.shop?._id,
                                  item?.orderStatus,
                                  item.deliveryBoy &&
                                    setDeliveryBoy(item.deliveryBoy)
                                )
                              }
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
                Select status
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

            {orderStatus === "accepted_delivery_boy" && (
              <Autocomplete
                className="cursor-pointer mt-3"
                value={deliveryBoy}
                onChange={(event, newValue) => {
                  setDeliveryBoy(newValue);
                }}
                getOptionLabel={(option, index) =>
                  option.name ? option.name : ""
                }
                isOptionEqualToValue={(option, value) =>
                  option?._id == value?._id
                }
                inputValue={deliverySearchKey}
                onInputChange={(event, newInputValue) => {
                  setDeliverySearchKey(newInputValue);
                }}
                id="controllable-states-demo"
                options={deliveryMans.length > 0 ? deliveryMans : []}
                sx={{ width: "100%" }}
                renderInput={(params, index) => (
                  <TextField {...params} label="Select a Delivery Boy" />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                    key={option._id}
                  >
                    {option.name}
                  </Box>
                )}
              />
            )}

            <div className="mt-3 d-flex justify-content-end">
              <Button type="submit" color="success" disabled={loading}>
                {loading ? "Updating" : "Update"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default OrderTable;
