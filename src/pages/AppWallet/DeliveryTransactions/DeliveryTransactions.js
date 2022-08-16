import React, { useEffect } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import TransactionsCard from "../../../components/TransactionsCard";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeliveryTrx,
  updateDeliverySearchKey,
  updateDeliverySortByKey,
  updateDeliveryTrxEndDate,
  updateDeliveryTrxStartDate,
} from "../../../store/appWallet/appWalletAction";
import AppPagination from "../../../components/AppPagination";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { sortByOptions } from "../../../assets/staticData";
import Search from "./../../../components/Search";

const DeliveryTransactions = () => {
  const {
    loading,
    deliveryTrxs,
    deliveryTrxStartDate,
    deliveryTrxEndDate,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
    deliverySortByKey,
    deliverySearchKey,
  } = useSelector((state) => state.appWalletReducer);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (deliverySortByKey || deliverySearchKey) {
      callTransList(true);
    }
  }, [deliverySortByKey, deliverySearchKey]);

  const callTransList = (refresh = false) => {
    dispatch(getDeliveryTrx(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem=" Delivery Transactions"
              title="App Wallet"
              loading={loading}
              callList={callTransList}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sort By</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={deliverySortByKey}
                        onChange={(e) => dispatch(updateDeliverySortByKey(e))}
                      />
                    </div>
                  </Col>
                  <Col lg={8}>
                    <Search dispatchFunc={updateDeliverySearchKey} />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="table-data-hover">
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4">
                  {" "}
                  Delivery Transactions List
                </CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Orders</Th>
                      <Th>Delivery fee</Th>
                      <Th>Drop earning</Th>
                      <Th>Unsettled amount</Th>
                      <Th>Delivery earning</Th>
                      <Th>Cash in hand</Th>
                      <Th>Settled cash</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {deliveryTrxs.length > 0 &&
                      deliveryTrxs.map((item, index) => (
                        <Tr
                          key={index}
                          className="align-middle cursor-pointer"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                          onClick={() =>
                            history.push(
                              `/add-wallet/single-delivery-transactions/${item._id}`
                            )
                          }
                        >
                          <Th title="Click to see details">{item?.name}</Th>

                          <Td>{item?.totalOrder}</Td>
                          <Td>
                            {Number.isNaN(
                              parseInt(item?.earning?.dropGet) +
                                parseInt(item?.orderValue?.deliveryFee)
                            )
                              ? 0
                              : parseInt(item?.earning?.dropGet) +
                                parseInt(item?.orderValue?.deliveryFee)}
                          </Td>
                          <Td>{item?.earning?.dropGet ?? 0}</Td>
                          <Td>{item?.earning?.unSettleAmount ?? 0}</Td>
                          <Td>{item?.orderValue?.deliveryFee ?? 0}</Td>
                          <Td>0</Td>
                          <Td>{item?.earning?.settleAmount ?? 0}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && deliveryTrxs.length < 1 && (
                  <div className="text-center">
                    <h4>No Transactions!</h4>
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
                    lisener={(page) => dispatch(getDeliveryTrx(true, page))}
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

export default DeliveryTransactions;
