import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
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
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Info from "../../../components/Info";
import TransactionsCard from "../../../components/TransactionsCard";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";
import requestApi from "../../../network/httpRequest";
import { DELIVERY_TRX, SINGLE_DELIVERY_TRX } from "../../../network/Api";
import AppPagination from "../../../components/AppPagination";

const SingleDeliveryTransactions = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { loading, deliveryTrxs } = useSelector(
    (state) => state.appWalletReducer
  );

  const [trx, setTrx] = useState(null);

  useEffect(() => {
    if (id) {
      callApi(id);
    } else {
      history.push("/add-wallet/delivery-transactions", { replace: true });
    }
  }, [id]);

  const summary = [
    { title: "Drop Earning", value: 120 },
    { title: "Rider Earning", value: 120 },
    { title: "Unsetlled Amount", value: 100 },
    { title: "Total Profit", value: 100 },
    { title: "Cash In Hand", value: 100 },
  ];

  const callApi = async (deiveryId, page = 1) => {
    try {
      const { data } = await requestApi().request(SINGLE_DELIVERY_TRX, {
        params: {
          deliveryBoyId: deiveryId,
          page,
          pageSize: 50,
        },
      });

      if (data.status) {
        setTrx(data.data);
        console.log({ data });
      } else {
        history.push("/add-wallet/delivery-transactions", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={trx?.delivery?.name}
              title="App Wallet"
              isRefresh={false}
            />

            <div>
              <TransactionsCard summary={summary} />
            </div>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <div className="d-flex justify-content-between pb-3">
                  <CardTitle className="h4"> Shop Transactions List</CardTitle>
                  <div>
                    <Button className="btn btn-success">
                      {" "}
                      Add/Remove Credit{" "}
                    </Button>
                    <Button className="btn btn-info ms-4">
                      {" "}
                      Make Payment{" "}
                    </Button>
                  </div>
                </div>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Amount</Th>
                      <Th>transaction Type</Th>
                      <Th>Date</Th>
                      <Th>Admin</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    <Tr
                      // key={index}
                      className="align-middle cursor-pointer"
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                      onClick={() =>
                        history.push(
                          history.push("/add-wallet/shop-transactions/1")
                        )
                      }
                    >
                      <Th>1</Th>

                      <Td>20</Td>
                      <Td>20</Td>
                      <Td>Make Payment</Td>
                      <Td>10/10/10</Td>
                      <Td>Shuvo</Td>
                    </Tr>
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && trx?.transactions?.length < 1 && (
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
                    paging={trx?.paginate?.metadata?.paging}
                    hasNextPage={trx?.paginate?.metadata?.hasNextPage}
                    hasPreviousPage={trx?.paginate?.metadata?.hasPreviousPage}
                    currentPage={trx?.paginate?.metadata?.currentPage}
                    lisener={(page) => callApi(id, page)}
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

export default SingleDeliveryTransactions;
