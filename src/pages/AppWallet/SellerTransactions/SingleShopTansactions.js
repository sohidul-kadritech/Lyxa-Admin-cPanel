import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
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
import { getShopTrxs } from "../../../store/appWallet/appWalletAction";
import AppPagination from "../../../components/AppPagination";

const SingleShopTransactions = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const {
    loading,
    shopTrxs,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
  } = useSelector((state) => state.appWalletReducer);

  const [shop, setShop] = useState("");

  const { shopName } = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (searchParams.get("seller")) {
      setShop(searchParams.get("seller"));
    } else {
      setShop(shopName);
    }
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      if (shopTrxs.length < 1) {
        dispatch(getShopTrxs(true, id));
      }
    } else {
      history.push("/", { replace: true });
    }
  }, [id]);

  const summary = [
    { title: "Drop Earning", value: 120 },
    { title: "Shop Earning", value: 120 },
    { title: "Unsetlled Amount", value: 100 },
    { title: "Total Profit", value: 100 },
  ];

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={shop}
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
                      // onClick={() =>
                      //   history.push("/add-wallet/shop-transactions/1")
                      // }
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
                {!loading && shopTrxs.length < 1 && (
                  <div className="text-center">
                    <h4>No Tansactions!</h4>
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
                    lisener={(page) => dispatch(getShopTrxs(true, id, page))}
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

export default SingleShopTransactions;
