import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import Info from '../../../components/Info';

function DropTransactionsDetails() {
  const { id } = useParams();
  const history = useHistory();

  const { dropTrxs } = useSelector((state) => state.appWalletReducer);

  const [trx, setTrx] = useState(null);

  useEffect(() => {
    if (id) {
      const findTrx = dropTrxs.find((item) => item._id === id);
      if (findTrx) {
        console.log(findTrx);
        setTrx(findTrx);
      } else {
        console.log('call api-------');
      }
    } else {
      history.push('/add-wallet/drop-transactions', { replace: true });
    }
  }, [id]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Lyxa Transaction Details" title="App Wallet" isRefresh={false} />
          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Transaction Details</CardTitle>
                  <hr />
                  <Info title="Payment Method" value={trx?.paymentMethod} />
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
  );
}

export default DropTransactionsDetails;
