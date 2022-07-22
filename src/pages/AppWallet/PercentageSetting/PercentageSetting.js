import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Th, Thead, Tr } from "react-super-responsive-table";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Form,
  Modal,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { successMsg } from "../../../helpers/successMsg";
import { addDeliveryCharge } from "../../../store/Settings/settingsAction";

import { getAllShop } from "../../../store/Shop/shopAction";

const PercentageSetting = () => {
  const dispatch = useDispatch();

  const { shops } = useSelector((state) => state.shopReducer);
  const { loading, status } = useSelector((state) => state.settingsReducer);

  const [feeInfo, setFeeInfo] = useState({
    dropPercentageType: "",
    dropPercentage: "",
    deliveryApplicable: "app",
    deliveryRange: [],
  });

  const [rangeWiseDeliveryCharge, setRangeWiseDeliveryCharge] = useState({
    from: 0,
    to: 0,
    charge: 0,
    deliveryPersonCut: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);

  // useEffect(() => {
  //   callDeliveryFee(true);
  // }, []);

  // const callDeliveryFee = (refresh = false) => {
  //   dispatch(getDeliveryCharge(refresh));
  // };

  // useEffect(() => {
  //   if (deliveryFee) {
  //     setFeeInfo({
  //       deliveryFeePerKm: deliveryFee.deliveryFeePerKm,
  //       dropChargePerKm: deliveryFee.dropChargePerKm,
  //     });
  //   }
  // }, [deliveryFee]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeeInfo({ ...feeInfo, [name]: value });
  };

  // GET ALL SHOP
  // useEffect(() => {
  //   if (feeInfo.deliveryApplied === "shop") {
  //     dispatch(getAllShop(true));
  //   }
  // }, [feeInfo?.deliveryApplied]);

  // VALIDATION
  const deliveryFeeSubmit = () => {
    const { dropPercentageType, dropPercentage, deliveryApplicable } = feeInfo;
    if (!dropPercentageType) {
      return successMsg("Enter delivery charge type");
    }
    if (!dropPercentage) {
      return successMsg("Enter Drop charge");
    }
    if (!deliveryApplicable) {
      return successMsg("Select Applied For ");
    }

    if (feeInfo.deliveryRange.length === 0) {
      return successMsg("Please add atleast one delivery charge", "error");
    }

    submitData();
  };
  // SUBMTI DATA TO SERVER

  const submitData = () => {
    dispatch(
      addDeliveryCharge({
        ...feeInfo,
      })
    );
  };

  //  CHANGE RANGE WISE CHARGE EVENT

  const changeRangeWiseCharge = (e) => {
    const { name, value } = e.target;
    setRangeWiseDeliveryCharge({ ...rangeWiseDeliveryCharge, [name]: value });
  };

  // SUBMIT CHARGE RANGE WISE

  const submitChargeRangeWise = (e) => {
    e.preventDefault();
    if (!rangeWiseDeliveryCharge.from) {
      return successMsg("Enter From Range", "error");
    }
    if (!rangeWiseDeliveryCharge.to) {
      return successMsg("Enter To Range", "error");
    }
    if (!rangeWiseDeliveryCharge.charge) {
      return successMsg("Enter Charge", "error");
    }
    if (!rangeWiseDeliveryCharge.deliveryPersonCut) {
      return successMsg("Enter Delivery Person Charge", "error");
    }

    setFeeInfo({
      ...feeInfo,
      deliveryRange: [...feeInfo.deliveryRange, rangeWiseDeliveryCharge],
    });
    setModalOpen(false);
    setRangeWiseDeliveryCharge({
      from: 0,
      to: 0,
      charge: 0,
      deliveryPersonCut: 0,
    });
  };

  // DELETE DELIVERY CHARGE

  const deleteDeliveryCharge = (index) => {
    let newDeliveryCharge = [...feeInfo.deliveryRange];
    newDeliveryCharge.splice(index, 1);
    setFeeInfo({ ...feeInfo, deliveryRange: newDeliveryCharge });
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              title="App Wallet"
              breadcrumbItem={"Percentage Setting"}
              loading={loading}
              // callList={callDeliveryFee}
            />
            <Card>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Charge Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="dropPercentageType"
                        value={feeInfo.dropPercentageType}
                        label="Charge Type"
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="amount">Amount</MenuItem>
                        <MenuItem value="percentage">Percentage</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col lg={6} className="mt-4 mt-lg-0">
                    <TextField
                      style={{ width: "100%" }}
                      label={`Charge (${
                        feeInfo.dropPercentageType === "amount"
                          ? "Amount"
                          : "Percentage"
                      })`}
                      variant="outlined"
                      placeholder="Enter Drop Charge"
                      name="dropPercentage"
                      value={feeInfo.dropPercentage}
                      onChange={handleChange}
                      type="number"
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg={6}>
                    <div>
                      <div className="d-flex mb-3">
                        <h5>Delivery Charge</h5>
                        <Button
                          color="success"
                          outline={true}
                          className="ms-3"
                          onClick={() => setModalOpen(!modalOpen)}
                        >
                          <i className="fas fa-plus"></i>{" "}
                        </Button>
                      </div>
                      {feeInfo.deliveryRange.length > 0 && (
                        <div className="mb-4">
                          <Paper className="py-2">
                            <h5 className="text-center">Charge List</h5>
                            <hr />
                            {feeInfo?.deliveryRange?.length > 0 &&
                              feeInfo?.deliveryRange?.map((item, index) => (
                                <ul
                                  key={index}
                                  style={{ listStyleType: "square" }}
                                >
                                  <li>
                                    <div className="d-flex justify-content-between">
                                      <span
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {`Range: ${item.from}km - ${item.to}km`}
                                      </span>
                                      <i
                                        className="fas fa-trash cursor-pointer me-3"
                                        style={{
                                          color: "#BD381C",
                                          fontSize: "15px",
                                        }}
                                        onClick={() =>
                                          deleteDeliveryCharge(index)
                                        }
                                      ></i>
                                    </div>
                                    <p className="mb-0">{`Charge: ${item.charge} NGN`}</p>
                                    <p>{`Delivery Person: ${item.deliveryPersonCut} NGN`}</p>
                                  </li>
                                </ul>
                              ))}
                          </Paper>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-center mt-5">
                  <Button
                    disabled={loading}
                    style={{ maxWidth: "200px", width: "100%" }}
                    color="primary"
                    onClick={deliveryFeeSubmit}
                  >
                    {loading ? "Loading..." : "Add"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>

        {/* ADD RANGE WISE DELIVERY CHARGE MODAL */}

        <Modal
          isOpen={modalOpen}
          toggle={() => {
            setModalOpen(!modalOpen);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Add Deal</h5>
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form onSubmit={submitChargeRangeWise}>
              <Row className="mt-3">
                <Col sm={6}>
                  <TextField
                    id="variant name"
                    label="Range From(km)"
                    name="from"
                    variant="outlined"
                    style={{ width: "100%" }}
                    autoComplete="off"
                    value={rangeWiseDeliveryCharge?.from}
                    onChange={(event) => changeRangeWiseCharge(event)}
                    type="number"
                    required
                  />
                </Col>
                <Col sm={6} className="mt-3 mt-sm-0 d-flex">
                  <TextField
                    name="to"
                    label="Range To(km)"
                    variant="outlined"
                    style={{ width: "100%" }}
                    autoComplete="off"
                    value={rangeWiseDeliveryCharge?.to}
                    onChange={(event) => changeRangeWiseCharge(event)}
                    type="number"
                    required
                  />
                  {/* {feeInfo.rangeWiseDeliveryCharge.length > 1 && (
                        <i
                          className="fas fa-trash cursor-pointer ms-1"
                          style={{
                            color: "red",
                            fontSize: "18px",
                          }}
                          // onClick={() => removeAttributeItem(index)}
                        ></i>
                      )} */}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={6}>
                  <TextField
                    id="variant name"
                    label="Charge"
                    name="charge"
                    variant="outlined"
                    style={{ width: "100%" }}
                    autoComplete="off"
                    value={rangeWiseDeliveryCharge?.charge}
                    onChange={(event) => changeRangeWiseCharge(event)}
                    type="number"
                    required
                  />
                </Col>
                <Col sm={6} className="mt-3 mt-sm-0 d-flex">
                  <TextField
                    name="deliveryPersonCut"
                    label="Delivery Person Cut"
                    variant="outlined"
                    style={{ width: "100%" }}
                    autoComplete="off"
                    value={rangeWiseDeliveryCharge?.deliveryPersonCut}
                    onChange={(event) => changeRangeWiseCharge(event)}
                    type="number"
                    required
                  />
                </Col>
              </Row>
              <div>
                <Button
                  outline={true}
                  color="primary"
                  type="submit"
                  className="mt-2"
                >
                  Add Item
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default PercentageSetting;
