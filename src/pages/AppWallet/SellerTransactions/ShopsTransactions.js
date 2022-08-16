import React, { useState, useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
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
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { getSellerTrx } from "../../../store/appWallet/appWalletAction";

const ShopsTransactions = () => {
  const { loading, sellerTrxs } = useSelector(
    (state) => state.appWalletReducer
  );

  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const history = useHistory();
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState("");
  const {
    account_type,
    _id: accountId,
    company_name,
  } = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    searchParams.get("companyName")
      ? setCompanyName(searchParams.get("companyName"))
      : setCompanyName(company_name);

    let id = null;
    searchParams.get("sellerId")
      ? (id = searchParams.get("sellerId"))
      : (id = accountId);

    dispatch(getSellerTrx(true, id));

    if (!id) {
      history.push("/", { replace: true });
    }
  }, []);

  const gotToShopTrxs = (shopId, shopName) => {
    history.push({
      pathname: `/add-wallet/shop-transactions`,
      search: `?shopId=${shopId}&shopName=${shopName}`,
    });
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={companyName}
              title="App Wallet"
              isRefresh={false}
            />

            <Card className="table-data-hover">
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
                    {sellerTrxs.length > 0 &&
                      sellerTrxs.map((trx, index) => (
                        <Tr
                          key={index}
                          className="align-middle cursor-pointer"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                          onClick={() => gotToShopTrxs(trx._id, trx?.shopName)}
                        >
                          <Th title="Click to see Details">{trx?.shopName}</Th>

                          <Td>{trx?.totalOrder}</Td>
                          <Td>{trx?.orderValue?.productAmount.toFixed(2)}</Td>
                          <Td>{trx?.orderValue?.deliveryFee}</Td>
                          <Td>{trx?.earning?.dropGet}</Td>
                          <Td>{trx?.earning?.unSettleAmount}</Td>
                          <Td>{trx?.earning?.settleAmount}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && sellerTrxs.length < 1 && (
                  <div className="text-center">
                    <h4>No Transations!</h4>
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

export default ShopsTransactions;
