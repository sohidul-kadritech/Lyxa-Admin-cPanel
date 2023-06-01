import React from 'react';
import { Table, Tbody, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { useGlobalContext } from '../../../context';

function PaymentHistory() {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();

  const { general } = useGlobalContext();
  const currency = general?.currency?.code?.toUpperCase();

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Payment History" title="App Wallet" />
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
                    <Th>User name & Type</Th>
                    <Th>ID</Th>
                    <Th>Amount ({currency})</Th>
                    <Th>Transactions Type</Th>
                    <Th>Date</Th>
                    <Th>Amin name & Type</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}></Tbody>
              </Table>
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default PaymentHistory;
