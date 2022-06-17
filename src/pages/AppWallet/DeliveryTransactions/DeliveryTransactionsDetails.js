import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Info from "../../../components/Info";

const DeliveryTransactionsDetails = () => {
  const { id } = useParams();
  const history = useHistory();

  const { loading, deliveryTrxs } = useSelector(
    (state) => state.appWalletReducer
  );

  const [trx, setTrx] = useState(null);

  useEffect(() => {
    if (id) {
      const findTrx = deliveryTrxs.find((item) => item._id == id);
      if (findTrx) {
        console.log(findTrx);
        setTrx(findTrx);
      } else {
        console.log("call api-------");
      }
    } else {
      history.push("/add-wallet/delivery-transactions", { replace: true });
    }
  }, [id]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Delivery Transaction Details"
              title="App Wallet"
              isRefresh={false}
            />
            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <CardTitle>Transaction Details</CardTitle>
                    <hr />
                    <Info
                      title="Delivery Boy"
                      value={trx?.deliveryBoy?.name}
                      link={`/deliveryman/details/${trx?.deliveryBoy?._id}`}
                    />
                    <Info title="Amount" value={trx?.amount} />
                    <Info title="Admin Note" value={trx?.adminNote} />
                    <Info title="User Note" value={trx?.userNote} />
                    <Info title="Status" value={trx?.status} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default DeliveryTransactionsDetails;
