import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
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
import {
  getAllOrder,
  orderUpdateStatus,
  sentOrderFlag,
} from "../store/order/orderAction";
import { useEffect } from "react";
import { allDeliveryMan } from "../store/DeliveryMan/DeliveryManAction";
import styled from "styled-components";
import { userList } from "../store/Users/UsersAction";
import { successMsg } from "../helpers/successMsg";

const OrderTable = ({ orders = [], status, loading, refused }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { users, searchKey: userSearchKey } = useSelector(
    (state) => state.usersReducer
  );
  const { searchKey: shopSearchKey, shops } = useSelector(
    (state) => state.shopReducer
  );
  const { deliveryMans, searchKey: riderSearchKey } = useSelector(
    (state) => state.deliveryManReducer
  );

  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [shop, setShop] = useState(null);
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [deliverySearchKey, setDeliverySearchKey] = useState(null);
  const [openFlagModal, setOpenFlagModal] = useState(false);
  const [selectFlagOrder, setSelectFlagOrder] = useState(null);
  const [comment, setComment] = useState("");
  const [accountType, setAccountType] = useState({
    user: false,
    shop: false,
    rider: false,
  });

  const [isFlaged, setIsFlaged] = useState({
    user: false,
    shop: false,
    rider: false,
  });

  // UPDATE ORDER STATUS

  const updateOrderStatus = (oId, shopId, orderStatus) => {
    setIsUpdateStatus(!isUpdateStatus);
    setOrderId(oId);
    setShop(shopId);
    setOrderStatus(orderStatus);
  };

  const submitOrderStatus = (e) => {
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
      setOpenFlagModal(false);
      setSelectFlagOrder(null);
      setComment("");
      setAccountType({
        user: false,
        shop: false,
        rider: false,
      });
    }
  }, [status]);

  // GET ALL DELIVERY BOY

  useEffect(() => {
    if (orderStatus === "accepted_delivery_boy") {
      dispatch(allDeliveryMan(true));
    }
  }, [orderStatus]);

  // UPDATE IS FLAGED  OR NOT

  const updateIsFlaged = (flags) => {
    console.log({ flags });
    const isUser = flags.find((item) => item?.user);
    const isShop = flags.find((item) => item?.shop);
    const isRider = flags.find((item) => item?.delivery);
    setAccountType({
      ...accountType,
      user: isUser ? true : false,
      shop: isShop ? true : false,
      rider: isRider ? true : false,
    });
    setIsFlaged({
      ...accountType,
      user: isUser && true,
      shop: isShop && true,
      rider: isRider && true,
    });
  };

  // FLAG ACCOUNT CHANGE

  const FlagAccountChange = (e) => {
    const { name, checked } = e.target;
    setAccountType({ ...accountType, [name]: checked });
  };

  // SUBMIT ORDER FLAG

  const submitOrderFlag = (e) => {
    e.preventDefault();
    const { user, rider, shop } = accountType;
    const { user: flagedUser, rider: flagedRider, shop: flagedShop } = isFlaged;

    if (
      !user &&
      !flagedUser &&
      !rider &&
      !flagedRider &&
      !shop &&
      !flagedShop
    ) {
      return successMsg("Please select a account type", "error");
    }

    dispatch(
      sentOrderFlag({
        orderId: selectFlagOrder?._id,
        comment,
        user: flagedUser && user ? "" : user ? selectFlagOrder?.user?._id : "",
        shop: flagedShop && shop ? "" : shop ? selectFlagOrder?.shop?._id : "",
        delivery:
          flagedRider && rider
            ? ""
            : rider
            ? selectFlagOrder?.deliveryBoy?._id
            : "",
      })
    );
  };

  return (
    <>
      <div>
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md={3} className="text-end" />
            </Row>
            <CardTitle className="h4">Orders List</CardTitle>
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
                {orders?.length > 0 &&
                  orders?.map((item, index) => {
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
                        <Td>
                          {new Date(item?.createdAt).toLocaleDateString()}
                        </Td>
                        <Td>{item?.summary?.totalAmount}</Td>
                        <Td>
                          {item?.paymentMethod}{" "}
                          {`${item?.selectPos !== "no" ? "(Pos)" : ""}`}
                        </Td>
                        <Td>
                          {item?.orderStatus === "accepted_delivery_boy"
                            ? "Accepted Rider"
                            : item?.orderStatus}
                        </Td>
                        <Td>
                          <ButtonWrapper>
                            {!refused && (
                              <Tooltip title="Update Status">
                                <button
                                  className="btn btn-info button me-1"
                                  disabled={item?.orderStatus === "delivered"}
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
                            )}
                            <Tooltip title="Details">
                              <button
                                className="btn btn-info button me-1"
                                onClick={() => {
                                  history.push(`/orders/details/${item?._id}`);
                                }}
                              >
                                <i className="fa fa-eye" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Flag">
                              <button
                                className="btn btn-success button me-1"
                                onClick={() => {
                                  setOpenFlagModal(!openFlagModal);
                                  setSelectFlagOrder(item);
                                  updateIsFlaged(item?.flag);
                                }}
                              >
                                <i className="fa fa-flag"></i>
                              </button>
                            </Tooltip>
                            <Tooltip title="Cancel Order">
                              <button
                                className="btn btn-danger button"
                                // onClick={() => goToShopOrderList(item._id)}
                              >
                                <i className="fa fa-times-circle"></i>
                              </button>
                            </Tooltip>
                          </ButtonWrapper>
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
            {!loading && orders?.length < 1 && (
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
          <Form className="mb-4" onSubmit={submitOrderStatus}>
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

      {/* CREATE FLEG */}

      <Modal
        isOpen={openFlagModal}
        toggle={() => {
          setOpenFlagModal(!openFlagModal);
        }}
        centered={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Send Flag</h5>
          <button
            type="button"
            onClick={() => {
              setOpenFlagModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Form onSubmit={submitOrderFlag}>
            <div className="mb-4">
              <TextField
                type="text"
                className="form-control"
                placeholder="Enter comment here"
                required
                label="Comment"
                name="comment"
                multiline
                maxRows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="mb-4"></div>

            <div className="mb-4">
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Select Account</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={accountType.user}
                        onChange={FlagAccountChange}
                        name="user"
                        disabled={isFlaged.user}
                      />
                    }
                    label="User"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={accountType.shop}
                        onChange={FlagAccountChange}
                        name="shop"
                        disabled={!selectFlagOrder?.shop || isFlaged.shop}
                      />
                    }
                    label="Shop"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={accountType.rider}
                        onChange={FlagAccountChange}
                        name="rider"
                        disabled={
                          !selectFlagOrder?.deliveryBoy || isFlaged.rider
                        }
                      />
                    }
                    label="Delivery boy"
                  />
                </FormGroup>
              </FormControl>
            </div>

            <div className="d-flex justify-content-center">
              <Button
                color="success"
                size="lg"
                className="px-4"
                type="submit"
                style={{ width: "150px" }}
                disabled={loading}
              >
                {loading ? (
                  <Spinner color="danger" size="sm"></Spinner>
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

const ButtonWrapper = styled.div`
  .button:last-child {
    @media (min-width: 1200px) {
      margin-top: 5px;
    }
    @media (min-width: 1400px) {
      margin-top: 0px;
    }
  }
`;

export default OrderTable;
