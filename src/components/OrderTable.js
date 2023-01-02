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
  Radio,
  RadioGroup,
  Select,
  TextField,
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
  cancelOrderByAdmin,
  getAllActiveDeliveryMan,
  orderUpdateStatus,
  sentOrderFlag,
} from "../store/order/orderAction";
import { useEffect } from "react";
import styled from "styled-components";
import { successMsg } from "../helpers/successMsg";
import { getAllCancelReasons } from "../store/Settings/settingsAction";

import userIcon from "../assets/images/dashboard/user.png";
import ThreeDotsMenu from "./ThreeDotsMenu";
import TableImgItem from "./TableImgItem";
import noPhoto from "../assets/images/noPhoto.jpg";

const actionItems = [{}];

const OrderTable = ({ orders = [], status, loading, refused }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { cancelReasons } = useSelector((state) => state.settingsReducer);
  const { activeDelieryBoys } = useSelector((state) => state.orderReducer);

  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [shop, setShop] = useState(null);
  const [deliveryBoy, setDeliveryBoy] = useState("");
  const [deliverySearchKey, setDeliverySearchKey] = useState(null);
  const [openFlagModal, setOpenFlagModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectFlagOrder, setSelectFlagOrder] = useState(null);
  const [comment, setComment] = useState("");
  const [isOtherReason, setIsOtherReason] = useState(false);
  const [orderFor, setOrderFor] = useState(null);
  const [orderCancel, setOrderCancel] = useState({
    cancelReason: "",
    orderId: null,
    otherReason: "",
    refundType: "none",
    partialPayment: {
      shop: "",
      deliveryBoy: "",
      admin: "",
    },
  });

  const [orderPayment, setOrderPayment] = useState({
    shop: 0,
    deliveryBoy: 0,
    admin: 0,
  });

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

  const { account_type } = JSON.parse(localStorage.getItem("admin"));

  // UPDATE ORDER STATUS

  const updateOrderStatus = (oId, shopId, orderStatus) => {
    setIsUpdateStatus(!isUpdateStatus);
    setOrderId(oId);
    setShop(shopId);
    setOrderStatus(orderStatus);
  };

  const submitOrderStatus = (e) => {
    e.preventDefault();
    console.log(orderStatus);
    if (
      (orderStatus === "delivered" || orderStatus === "preparing") &&
      !deliveryBoy?._id
    ) {
      return successMsg(`Assign delivery boy before ${orderStatus}`);
    }
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
      setOpenCancelModal(false);
      setAccountType({
        user: false,
        shop: false,
        rider: false,
      });
    }
    return;
  }, [status]);

  // GET ALL DELIVERY BOY

  useEffect(() => {
    if (orderStatus === "accepted_delivery_boy") {
      dispatch(getAllActiveDeliveryMan(orderId));
    }
  }, [orderStatus]);

  // UPDATE IS FLAGED  OR NOT

  const updateIsFlaged = (flags) => {
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
      ...isFlaged,
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

  // GET ALL CANCEL REASON

  useEffect(() => {
    if (openCancelModal) {
      dispatch(getAllCancelReasons(true, "admin"));
    }
    return;
  }, [openCancelModal]);

  // MODIFIED ORDER STATUS NAME

  const modifiedOrderStatus = (statusName) => {
    let newStatusName = "";

    if (statusName === "accepted_delivery_boy") {
      newStatusName = "Accept by rider";
    } else if (statusName === "preparing") {
      newStatusName = "Accept by shop";
    } else if (statusName === "ready_to_pickup") {
      newStatusName = "Ready to pickup";
    } else if (statusName === "order_on_the_way") {
      newStatusName = "On the way";
    } else if (statusName === "delivered") {
      newStatusName = "Delivered";
    } else if (statusName === "cancelled") {
      newStatusName = "Cancelled";
    } else if (statusName === "refused") {
      newStatusName = "Refused";
    } else {
      newStatusName = "Placed";
    }
    return newStatusName;
  };

  //  UPDATE CANCEL ORDER REFUND TYPE

  const updateRefundType = (type) => {
    setOrderCancel({
      ...orderCancel,
      refundType: type,
      partialPayment:
        type === "full"
          ? orderPayment
          : {
              shop: "",
              deliveryBoy: "",
              admin: "",
            },
    });
  };

  const updateRefundAmount = (e) => {
    const { name, value } = e.target;
    const { shop, admin, deliveryBoy } = orderPayment;

    if (name === "shop" && Number(value) > shop) {
      return successMsg("Invalid Shop Amount");
    } else if (name === "admin" && Number(value) > admin) {
      return successMsg("Invalid Lyxa Amount");
    } else if (name === "deliveryBoy" && Number(value) > deliveryBoy) {
      return successMsg("Invalid Delivery Boy Amount");
    } else {
      setOrderCancel({
        ...orderCancel,
        partialPayment: {
          ...orderCancel?.partialPayment,
          [name]: Number(value),
        },
      });
    }
  };

  // CANCEL ORDER

  const submitOrderCancel = (e) => {
    e.preventDefault();

    const {
      partialPayment: { shop, deliveryBoy, admin },
    } = orderCancel;

    if (
      orderCancel.refundType === "partial" &&
      !shop &&
      !deliveryBoy &&
      !admin
    ) {
      return successMsg("Enter Minimum One Partial Amount");
    }

    dispatch(
      cancelOrderByAdmin({
        ...orderCancel,
        cancelReason: orderCancel?.cancelReason?._id ?? "",
      })
    );
  };

  // HANDLE THREE DOT MENU

  const handleMenu = (menu, item) => {
    if (menu === "Update Status") {
      updateOrderStatus(
        item?._id,
        item?.shop?._id,
        item?.orderStatus,
        setOrderFor(item?.orderFor),
        item?.deliveryBoy ? setDeliveryBoy(item?.deliveryBoy) : null
      );
    } else if (menu === "Cancel Order") {
      setOpenCancelModal(!openCancelModal);
      setOrderCancel({
        ...orderCancel,
        cancelReason: "",
        otherReason: "",
        orderId: item?._id,
        refundType: "none",
        partialPayment: {
          shop: "",
          deliveryBoy: "",
          admin: "",
        },
      });
      setOrderPayment({
        shop: item?.sellerEarnings,
        deliveryBoy: item?.deliveryBoyFee,
        admin: item?.dropCharge?.totalDropAmount,
      });
      setIsOtherReason(false);
    } else if (menu === "Flag") {
      setOpenFlagModal(!openFlagModal);
      setSelectFlagOrder(item);
      updateIsFlaged(item?.flag);
    } else {
    }
  };

  const goToDetails = (id) => {
    history.push(`/orders/details/${id}`);
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
              className="table table__wrapper  table-hover text-center"
            >
              <Thead>
                <Tr>
                  <Th>Customer</Th>
                  <Th>Shop</Th>
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
                        className="align-middle text-capitalize cursor-pointer"
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        <Th onClick={() => goToDetails(item?._id)}>
                          <TableImgItem
                            img={`${
                              item?.user?.profile_photo
                                ? item?.user?.profile_photo
                                : noPhoto
                            }`}
                            altImg={userIcon}
                            name={item?.user?.name}
                            id={item?.orderId}
                          />
                        </Th>

                        <Td onClick={() => goToDetails(item?._id)}>
                          {item?.shop?.shopName}
                        </Td>
                        <Td onClick={() => goToDetails(item?._id)}>
                          <p className="mb-0">
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </p>
                          <span>
                            {new Date(item?.createdAt).toLocaleTimeString()}
                          </span>
                        </Td>
                        <Td
                          onClick={() => goToDetails(item?._id)}
                        >{`${item?.summary?.totalAmount} NGN`}</Td>
                        <Td onClick={() => goToDetails(item?._id)}>
                          {item?.paymentMethod}
                          {`${item?.selectPos !== "no" ? "(Pos)" : ""}`}
                        </Td>
                        <Td onClick={() => goToDetails(item?._id)}>
                          <div
                            className={`${
                              ["cancelled", "refused"].includes(
                                item?.orderStatus
                              )
                                ? "inactive-status"
                                : item?.orderStatus === "delivered"
                                ? "active-status"
                                : "orderStatus"
                            }`}
                          >
                            {modifiedOrderStatus(item?.orderStatus)}
                          </div>
                        </Td>
                        <Td>
                          <ThreeDotsMenu
                            handleMenuClick={(menu) => handleMenu(menu, item)}
                            menuItems={[
                              item?.orderStatus !== "cancelled" &&
                                item?.orderStatus !== "delivered" &&
                                "Update Status",
                              account_type === "admin" && "Flag",
                              account_type === "admin" &&
                                item?.orderStatus !== "cancelled" &&
                                item?.orderStatus !== "delivered" &&
                                "Cancel Order",
                            ]}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                {loading && (
                  <Tr>
                    <Td>
                      <Spinner
                        style={{
                          position: "fixed",
                          left: "50%",
                          top: "50%",
                        }}
                        animation="border"
                        color="success"
                      />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>

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
                    {orderFor === "specific" &&
                    item.value === "accepted_delivery_boy"
                      ? ""
                      : item.label}
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
                options={activeDelieryBoys?.length > 0 ? activeDelieryBoys : []}
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
                {loading ? "Updating..." : "Update"}
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
          {isFlaged.shop && isFlaged.user && isFlaged.rider ? (
            <div>
              <h5>Everyone has been Flaged!.</h5>
              <span>Please go to order details to see flag information.</span>
            </div>
          ) : (
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
          )}
        </div>
      </Modal>

      {/* CANCEL ORDER */}
      <Modal
        isOpen={openCancelModal}
        toggle={() => {
          setOpenCancelModal(!openCancelModal);
        }}
        centered={true}
        style={{ height: "470px" }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Cancel Order</h5>
          <button
            type="button"
            onClick={() => {
              setOpenCancelModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Form onSubmit={submitOrderCancel}>
            <Autocomplete
              className="cursor-pointer mt-3"
              disabled={isOtherReason}
              value={orderCancel.cancelReason}
              onChange={(event, newValue) => {
                setOrderCancel({
                  ...orderCancel,
                  cancelReason: newValue,
                  otherReason: "",
                });
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
              options={cancelReasons.length > 0 ? cancelReasons : []}
              sx={{ width: "100%" }}
              renderInput={(params, index) => (
                <TextField
                  {...params}
                  label="Select a cancel reason"
                  required={!isOtherReason}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                  key={option?._id}
                >
                  {option?.name}
                </Box>
              )}
            />

            <div className="mt-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isOtherReason}
                    onChange={(e) => setIsOtherReason(e.target.checked)}
                    name="otherReason"
                  />
                }
                label="Send other reason"
              />
            </div>

            {isOtherReason && (
              <div className="mt-2">
                <TextField
                  type="text"
                  multiline
                  className="form-control"
                  placeholder="Type other reason"
                  maxRows={4}
                  required={isOtherReason}
                  label="Other reason"
                  value={orderCancel.otherReason}
                  onChange={(e) =>
                    setOrderCancel({
                      ...orderCancel,
                      otherReason: e.target.value,
                      cancelReason: null,
                    })
                  }
                />
              </div>
            )}

            <FormControl className="py-3">
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={orderCancel?.refundType}
                onChange={(e) => updateRefundType(e.target.value)}
                required
              >
                <FormControlLabel
                  value="full"
                  control={<Radio />}
                  label="Full Refund"
                />
                <FormControlLabel
                  value="partial"
                  control={<Radio />}
                  label="Partial Refund"
                />
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label="No Refund"
                />
              </RadioGroup>
            </FormControl>

            {orderCancel?.refundType === "partial" && (
              <CancelOrderRefunds>
                <div className="refund_item_wrapper">
                  <input
                    className="form-control refund_input"
                    placeholder="Enter Shop Amount"
                    type="number"
                    min={0}
                    max={orderPayment?.shop}
                    name="shop"
                    onChange={updateRefundAmount}
                    value={orderCancel?.partialPayment?.shop}
                  />
                  <span>Shop Earning: {orderPayment?.shop}</span>
                </div>
                <div className="refund_item_wrapper">
                  <input
                    type="number"
                    className="form-control refund_input"
                    placeholder="Enter Admin Amount"
                    min={0}
                    max={orderPayment?.admin}
                    onChange={updateRefundAmount}
                    name="admin"
                    value={orderCancel?.partialPayment?.admin}
                  />
                  <span>Lyxa Earning: {orderPayment?.admin}</span>
                </div>
                <div className="refund_item_wrapper">
                  <input
                    type="number"
                    className="form-control refund_input"
                    placeholder="Enter Delivery Amount"
                    min={0}
                    max={orderPayment?.deliveryBoy}
                    onChange={updateRefundAmount}
                    name="deliveryBoy"
                    value={orderCancel?.partialPayment?.deliveryBoy}
                  />
                  <span>Delivery Earning: {orderPayment?.deliveryBoy}</span>
                </div>
              </CancelOrderRefunds>
            )}

            <h5>
              Total Refund Amount:{" "}
              {Number(orderCancel?.partialPayment?.shop) +
                Number(orderCancel?.partialPayment?.admin) +
                Number(orderCancel?.partialPayment?.deliveryBoy)}
            </h5>

            <div className="d-flex justify-content-center my-3 pt-3">
              <Button
                color="success"
                size="lg"
                className="px-4"
                type="submit"
                // style={{ width: "120px" }}
                disabled={loading}
              >
                {loading ? (
                  <Spinner color="danger" size="sm"></Spinner>
                ) : (
                  "Confirm cancel order"
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

const CancelOrderRefunds = styled.div`
  padding-bottom: 10px;
  .refund_item_wrapper {
    margin-bottom: 5px;
    display: flex;
    align-items: center;

    .refund_input {
      width: 180px;
      margin-right: 20px;
    }
  }
`;

export default OrderTable;
