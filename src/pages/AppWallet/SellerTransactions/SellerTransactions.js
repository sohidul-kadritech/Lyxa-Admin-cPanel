import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import TransactionsCard from "../../../components/TransactionsCard";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellerTrx,
  updateSellerTrxEndDate,
  updateSellerTrxStartDate,
} from "../../../store/appWallet/appWalletAction";
import AppPagination from "../../../components/AppPagination";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@mui/material";

const SellerTransactions = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    sellerTrxs,
    sellerTrxStartDate,
    sellerTrxEndDate,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
  } = useSelector((state) => state.appWalletReducer);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (sellerTrxStartDate || sellerTrxEndDate) {
      callTransList(true);
    }
  }, [sellerTrxStartDate, sellerTrxEndDate]);

  const callTransList = (refresh = false) => {
    dispatch(getSellerTrx(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Seller Transactions"
              title="App Wallet"
              loading={loading}
              callList={callTransList}
            />

            {isOpen && (
              <Lightbox
                mainSrc={selectedImg}
                enableZoom={true}
                imageCaption="img"
                onCloseRequest={() => {
                  setIsOpen(!isOpen);
                }}
              />
            )}

            <div>
              <TransactionsCard />
            </div>

            <Card>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <div className=" w-100">
                      <label>Start Date</label>
                      <div className="form-group mb-0 w-100">
                        <Flatpickr
                          className="form-control d-block"
                          id="startDate"
                          placeholder="Start Date"
                          value={sellerTrxStartDate}
                          onChange={(selectedDates, dateStr, instance) =>
                            dispatch(updateSellerTrxStartDate(dateStr))
                          }
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
                          }}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className=" mt-3 mt-lg-0 w-100">
                      <label>End Date</label>
                      <div className="form-group mb-0">
                        <Flatpickr
                          className="form-control w-100"
                          id="endDate"
                          placeholder="Select End Date"
                          value={sellerTrxEndDate}
                          onChange={(selectedDates, dateStr, instance) =>
                            dispatch(updateSellerTrxEndDate(dateStr))
                          }
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
                          }}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Seller Transactions List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Seller</Th>
                      <Th>Shop</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>admin Note</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {sellerTrxs.map((item, index) => {
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
                            <img
                              onClick={() => {
                                setIsOpen(true);
                                setSelectedImg(
                                  item?.shop?.seller?.profile_photo
                                );
                              }}
                              className="avatar-xs rounded-circle me-2 cursor-pointer"
                              alt=""
                              src={item?.shop?.seller?.profile_photo}
                            />
                            <h6>{item?.shop?.seller?.name}</h6>
                          </Th>

                          <Td>
                            <img
                              onClick={() => {
                                setIsOpen(true);
                                setSelectedImg(item?.shop?.shopLogo);
                              }}
                              className="avatar-xs rounded-circle me-2 cursor-pointer"
                              alt=""
                              src={item?.shop?.shopLogo}
                            />
                            <h6>{item?.shop?.shopName}</h6>
                          </Td>
                          <Td>{item?.amount}</Td>
                          <Td>{item?.status}</Td>
                          <Td style={{ maxWidth: "150px" }}>
                            {item?.adminNote}
                          </Td>
                          <Td>
                            <Tooltip title="Details">
                              <button
                                className="btn btn-info button"
                                onClick={() =>
                                  history.push(
                                    `/add-wallet/seller-transactions/details/${item._id}`
                                  )
                                }
                              >
                                <i className="fa fa-eye" />
                              </button>
                            </Tooltip>
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
                {!loading && sellerTrxs.length < 1 && (
                  <div className="text-center">
                    <h4>No Order!</h4>
                  </div>
                )}
              </CardBody>
            </Card>
            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={paging}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    currentPage={currentPage}
                    lisener={(page) => dispatch(getSellerTrx(true, page))}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default SellerTransactions;
