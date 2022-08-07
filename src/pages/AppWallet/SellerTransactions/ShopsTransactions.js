import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
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
import Info from "../../../components/Info";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";
import TransactionsCard from "../../../components/TransactionsCard";

// const Info = ({ title, value, link  }) => {

//   return (

//   );
// };

const ShopsTransactions = () => {
  const { id } = useParams();
  const { loading, sellerTrxs } = useSelector(
    (state) => state.appWalletReducer
  );

  const history = useHistory();

  const [trx, setTrx] = useState(null);

  useEffect(() => {
    if (id) {
      const findTrx = sellerTrxs.find((item) => item._id == id);
      if (findTrx) {
        console.log(findTrx);
        setTrx(findTrx);
      } else {
        console.log("call api-------");
      }
    }
  }, [id]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Seller Shop Transactions"
              title="App Wallet"
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Shops Transactions List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Shop</Th>
                      <Th>Order</Th>
                      <Th>Oder amount</Th>
                      <Th>Delivery fee</Th>
                      <Th>Drop earning</Th>
                      <Th>Unsettled amount</Th>
                      <Th>Shop earning</Th>
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
                      <Th>Food House</Th>

                      <Td>20</Td>
                      <Td>20</Td>
                      <Td>20</Td>
                      <Td>20</Td>
                      <Td>20</Td>
                      <Td>20</Td>
                    </Tr>
                  </Tbody>
                </Table>
                {/* {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && sellerTrxs.length < 1 && (
                  <div className="text-center">
                    <h4>No Order!</h4>
                  </div>
                )} */}
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

export default ShopsTransactions;
