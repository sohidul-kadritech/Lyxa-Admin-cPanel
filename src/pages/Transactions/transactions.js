import React, { useEffect } from "react";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { accountsOptions, sortByOptions } from "../../assets/staticData";
import Search from "../../components/Search";
import {
  getAllTransctions,
  updateAllTrxAccountType,
  updateAllTrxSearchKey,
  updateAllTrxSortByKey,
} from "../../store/appWallet/appWalletAction";
import { useDispatch, useSelector } from "react-redux";

const Transactions = () => {
  const dispatch = useDispatch();
  const {
    loading,
    allTrxs,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
    trxSortByKey,
    trxSearchKey,
    trxAccountType,
  } = useSelector((state) => state.appWalletReducer);

  useEffect(() => {
    if (trxSortByKey || trxSearchKey || trxAccountType) {
      callTransList(true);
    }
  }, [trxSortByKey, trxSearchKey, trxAccountType]);

  const callTransList = (refresh = false) => {
    dispatch(getAllTransctions(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Transactions"
              loading={loading}
              callList={callTransList}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={3}>
                    <div className="mb-4">
                      <label className="control-label">Sort By</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={trxSortByKey}
                        onChange={(e) => dispatch(updateAllTrxSortByKey(e))}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <Search dispatchFunc={updateAllTrxSearchKey} />
                  </Col>
                  <Col lg={3}>
                    <div className="mb-4">
                      <label className="control-label">Account Type</label>
                      <Select
                        palceholder="Select Status"
                        options={accountsOptions}
                        classNamePrefix="select2-selection"
                        value={trxAccountType}
                        onChange={(e) => dispatch(updateAllTrxAccountType(e))}
                      />
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
                <CardTitle className="h4"> Transactions </CardTitle>

                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Amount</Th>
                      <Th>Type</Th>
                      <Th>Payment Method</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {allTrxs?.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th>{item?._id}</Th>

                          <Td>{item?.amount}</Td>

                          <Td>{item?.type}</Td>
                          <Td>{item?.paymentType}</Td>
                          <Td>
                            {new Date(item?.createdAt).toLocaleDateString()}
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
                {!loading && allTrxs.length < 1 && (
                  <div className="text-center">
                    <h4>No Transactions!</h4>
                  </div>
                )}
              </CardBody>
            </Card>
            {/* <Row>
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
            </Row> */}
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default Transactions;
