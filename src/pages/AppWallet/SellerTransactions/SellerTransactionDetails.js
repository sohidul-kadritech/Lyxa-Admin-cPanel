import React,{useState, useEffect} from "react";

import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Info from "../../../components/Info";

// const Info = ({ title, value, link  }) => {

    
    
//   return (
    
//   );
// };

const SellerTransactionDetails = () => {
  const { id } = useParams();
  const { loading, sellerTrxs } = useSelector(
    (state) => state.appWalletReducer
  );

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
              breadcrumbItem="Seller Transaction Details"
              title="App Wallet"
              isRefresh={false}
            />
            <Row>
              <Col lg={6}>
                <Card>
                    <CardBody>
                        <CardTitle>
                            Transaction Details
                        </CardTitle>
                        <hr />
                        <Info title='Seller' value={trx?.shop?.seller?.name} link={`/seller/details/${trx?.shop?.seller?._id}`} />
                        <Info title='Shop' value={trx?.shop?.shopName} link={`/shops/details/${trx?.shop?._id}`} />
                        <Info title='Amount' value={trx?.amount}  />
                        <Info title='Admin Note' value={trx?.adminNote}  />
                        <Info title='Status' value={trx?.status}  />
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

export default SellerTransactionDetails;
