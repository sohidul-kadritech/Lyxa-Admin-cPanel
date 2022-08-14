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
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

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
  CardTitle,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import DropCharge from "../../../components/DropCharge";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { successMsg } from "../../../helpers/successMsg";
import {
  getPercentageSetting,
  getSellerSpecialDropCharge,
  updateDeliveryCut,
} from "../../../store/Settings/settingsAction";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

const PercentageSetting = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { loading, dropCharge, status, sellersDropCharge } = useSelector(
    (state) => state.settingsReducer
  );

  const [deliveryCut, setDeliveryCut] = useState([]);
  const [isOpenSuggestion, setIsOpenSuggestion] = useState(false);

  const [rangeWiseDeliveryCharge, setRangeWiseDeliveryCharge] = useState({
    from: 0,
    to: 0,
    charge: 0,
    deliveryPersonCut: 0,
  });

  useEffect(() => {
    dispatch(getPercentageSetting());
  }, []);

  useEffect(() => {
    if (isOpenSuggestion) {
      dispatch(getSellerSpecialDropCharge());
    }
  }, [isOpenSuggestion]);

  useEffect(() => {
    if (dropCharge) {
      setDeliveryCut(dropCharge?.deliveryRange);
    }
  }, [dropCharge]);

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

    if (rangeWiseDeliveryCharge.from > rangeWiseDeliveryCharge.to) {
      return successMsg("From Range should be less than To Range", "error");
    }

    const isExistCharge = deliveryCut?.filter((item) => {
      if (
        rangeWiseDeliveryCharge.from >= item.from &&
        rangeWiseDeliveryCharge.from <= item?.to
      ) {
        return item;
      }

      if (
        rangeWiseDeliveryCharge.to >= item.from &&
        rangeWiseDeliveryCharge.to <= item?.to
      ) {
        return item;
      }
    });

    if (isExistCharge.length > 0) {
      return successMsg("Range already exist", "error");
    }

    setDeliveryCut([...deliveryCut, rangeWiseDeliveryCharge]);

    setRangeWiseDeliveryCharge({
      from: 0,
      to: 0,
      charge: 0,
      deliveryPersonCut: 0,
    });
  };

  // DELETE DELIVERY CHARGE

  const deleteDeliveryCharge = (index) => {
    let newDeliveryCharge = [...deliveryCut];
    newDeliveryCharge.splice(index, 1);
    setDeliveryCut([...newDeliveryCharge]);
  };

  // UPDATE DELIVERY CUT

  const submitDeliveryCut = () => {
    dispatch(updateDeliveryCut(deliveryCut));
  };

  useEffect(() => {
    if (status) {
      // setModalOpen(false);
    }
  }, [status]);

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
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <CardTitle>Global Drop Charge</CardTitle>
                  <Button
                    outline={true}
                    color="success"
                    onClick={() => setIsOpenSuggestion(!isOpenSuggestion)}
                  >
                    See Sellers Special Charge
                  </Button>
                </div>
                <hr />
                <DropCharge
                  chargeType={dropCharge?.dropPercentageType}
                  chargeValue={dropCharge?.dropPercentage}
                  type="global"
                />
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <CardTitle>Delivery Cut</CardTitle>
                <hr />
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
                <Row className="mt-4">
                  <Col lg={6}>
                    <div>
                      {deliveryCut?.length > 0 && (
                        <div className="mb-4">
                          <Paper className="py-2">
                            <h5 className="text-center">Charge List</h5>
                            <hr />
                            {deliveryCut?.length > 0 &&
                              deliveryCut?.map((item, index) => (
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
                {deliveryCut?.length > 0 && (
                  <div className="text-center">
                    <Button
                      style={{ maxWidth: "200px", width: "100%" }}
                      color="success"
                      size="lg"
                      className="px-4"
                      onClick={submitDeliveryCut}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Update"}
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </Container>
        </div>

        <Modal
          isOpen={isOpenSuggestion}
          toggle={() => {
            setIsOpenSuggestion(!isOpenSuggestion);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Update Drop Charge</h5>
            <button
              type="button"
              onClick={() => {
                setIsOpenSuggestion(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            {/* <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Seller</Th>
                      <Th>Charge Type</Th>
                      <Th>Charge</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {sellersDropCharge.map((seller, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th>
                            <div style={{ maxWidth: "120px" }}>
                              <span>{seller?.company_name}</span>
                            </div>
                          </Th>
                          <Td>{seller?.dropChargeType}</Td>
                          <Td>{item?.email}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table> */}
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default PercentageSetting;
