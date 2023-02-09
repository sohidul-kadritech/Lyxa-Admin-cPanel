import { Tooltip } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, CardTitle, Col, Container, Row, Spinner } from 'reactstrap';
import { removeSellerCredential, removeShopCredential } from '../store/AdminControl/Admin/adminAction';
import GlobalWrapper from './GlobalWrapper';

function CredentialsTable({ data = [], loading, type }) {
  const dispatch = useDispatch();

  const removeCredential = (id) => {
    if (type === 'seller') {
      dispatch(removeSellerCredential(id));
    } else {
      dispatch(removeShopCredential(id));
    }
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={3} className="text-end" />
              </Row>
              <CardTitle className="h4"> Credentials List</CardTitle>
              <Table
                id="tech-companies-1"
                className="table table__wrapper table-striped table-bordered table-hover text-center"
              >
                <Thead>
                  <Tr>
                    <Th>Email</Th>
                    <Th>Status</Th>
                    <Th>Created At</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {data &&
                    data.length > 0 &&
                    data.map((item) => (
                      <Tr
                        key={Math.random()}
                        className="align-middle"
                        style={{
                          fontSize: '15px',
                          fontWeight: '500',
                        }}
                      >
                        <Th>{item?.email}</Th>

                        <Td
                          style={{
                            color: item?.status === 'active' || item?.shopStatus === 'active' ? 'green' : 'red',
                          }}
                        >
                          {type === 'seller' ? item?.status : item?.shopStatus}
                        </Td>
                        <Td>{moment(item?.createdAt).format('MMMM Do YYYY')}</Td>
                        <Td>
                          <Tooltip title="Remove">
                            <button
                              type="button"
                              className="btn btn-danger button me-0 me-xl-2"
                              onClick={() => removeCredential(item?._id)}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              {loading && (
                <Spinner style={{ position: 'fixed', left: '50%', top: '50%' }} animation="border" variant="info" />
              )}
              {!loading && data?.length < 1 && (
                <div className="text-center">
                  <h4>No Credentials!</h4>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default CredentialsTable;
