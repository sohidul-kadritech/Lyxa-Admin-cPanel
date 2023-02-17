/* eslint-disable max-len */
import { Grid, Paper, Stack, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Form, Row } from 'reactstrap';
import AppPagination from '../../../components/AppPagination';
import CircularLoader from '../../../components/CircularLoader';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import DropCharge from '../../../components/DropCharge';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { successMsg } from '../../../helpers/successMsg';
import {
  deleteSellerSpecialDropCharge,
  getPercentageSetting,
  getSellerSpecialDropCharge,
  updateDeliveryCut,
} from '../../../store/Settings/settingsAction';

function PercentageSetting() {
  const dispatch = useDispatch();
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
  const { loading, dropCharge, sellersDropCharge, paging, hasNextPage, hasPreviousPage, currentPage } = useSelector(
    (state) => state.settingsReducer
  );
  const [deliveryCut, setDeliveryCut] = useState([]);
  const [rangeWiseDeliveryCharge, setRangeWiseDeliveryCharge] = useState({
    from: 0,
    to: 0,
    charge: 0,
    deliveryPersonCut: 0,
  });

  const [confirm_alert, setconfirm_alert] = useState(false);
  const [sellerId, setSellerId] = useState('');

  useEffect(() => {
    dispatch(getPercentageSetting());
    dispatch(getSellerSpecialDropCharge());
  }, []);

  useEffect(() => {
    if (dropCharge) {
      setDeliveryCut(dropCharge?.deliveryRange);
    }
  }, [dropCharge]);

  // CHANGE RANGE WISE CHARGE EVENT
  const changeRangeWiseCharge = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setRangeWiseDeliveryCharge({
      ...rangeWiseDeliveryCharge,
      [name]: Number(value),
    });
  };

  // SUBMIT CHARGE RANGE WISE
  // eslint-disable-next-line consistent-return
  const submitChargeRangeWise = (e) => {
    e.preventDefault();

    if (!rangeWiseDeliveryCharge.from) {
      return successMsg('Enter From Range', 'error');
    }
    if (!rangeWiseDeliveryCharge.to) {
      return successMsg('Enter To Range', 'error');
    }
    if (!rangeWiseDeliveryCharge.charge) {
      return successMsg('Enter Charge', 'error');
    }

    if (rangeWiseDeliveryCharge.from > rangeWiseDeliveryCharge.to) {
      return successMsg('From Range should be less than To Range', 'error');
    }

    if (rangeWiseDeliveryCharge.charge < rangeWiseDeliveryCharge.deliveryPersonCut) {
      return successMsg("Delivery person cut can't be getter than charge", 'error');
    }
    // eslint-disable-next-line array-callback-return, consistent-return
    const isExistCharge = deliveryCut?.filter((item) => {
      if (rangeWiseDeliveryCharge.from >= item.from && rangeWiseDeliveryCharge.from <= item?.to) {
        return item;
      }

      if (rangeWiseDeliveryCharge.to >= item.from && rangeWiseDeliveryCharge.to <= item?.to) {
        return item;
      }
    });

    if (isExistCharge.length > 0) {
      return successMsg('Range already exist', 'error');
    }

    setDeliveryCut([...deliveryCut, rangeWiseDeliveryCharge]);
    setRangeWiseDeliveryCharge({
      from: 0,
      to: 0,
      charge: 0,
      deliveryPersonCut: 0,
    });
  };

  // DELETE DELIVERY CHARGE
  const deleteDeliveryCharge = (index) => {
    const newDeliveryCharge = [...deliveryCut];
    newDeliveryCharge.splice(index, 1);
    setDeliveryCut([...newDeliveryCharge]);
  };

  // UPDATE DELIVERY CUT
  const submitDeliveryCut = () => {
    dispatch(updateDeliveryCut(deliveryCut));
  };
  const deleteSellerDropCharge = () => {
    dispatch(deleteSellerSpecialDropCharge(sellerId));
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Percentage Setting" loading={loading} isRefresh={false} />
          <Grid container spacing={3} mb={3}>
            <Grid item md={12}>
              <Card className="mb-0">
                <CardBody>
                  <CardTitle>Global Lyxa Charge</CardTitle>
                  <hr />
                  <DropCharge
                    chargeType={dropCharge?.dropPercentageType}
                    chargeValue={dropCharge?.dropPercentage}
                    type="global"
                  />
                </CardBody>
                <hr />
                <CardBody>
                  <CardTitle>Sellers Special Charge List</CardTitle>
                  <hr />
                  <Table id="tech-companies-1" className="table table__wrapper text-center">
                    <Thead>
                      <Tr>
                        <Th>Seller</Th>
                        <Th>Charge Type</Th>
                        <Th>Charge</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody
                      style={{
                        position: 'relative',
                        backgroundColor: 'white',
                      }}
                    >
                      {sellersDropCharge.map((seller) => (
                        <Tr
                          key={Math.random()}
                          className="align-middle"
                          style={{
                            fontSize: '15px',
                            fontWeight: '500',
                          }}
                        >
                          <Th>
                            <div style={{ maxWidth: '120px' }}>
                              <span>{seller?.company_name}</span>
                            </div>
                          </Th>
                          <Td>{seller?.dropPercentageType}</Td>
                          <Td>{seller?.dropPercentage}</Td>
                          <Td>
                            <Tooltip title="Delete">
                              <button
                                type="button"
                                className="btn btn-danger button"
                                onClick={() => {
                                  setconfirm_alert(true);
                                  setSellerId(seller?._id);
                                }}
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </Tooltip>
                            {confirm_alert ? (
                              <SweetAlert
                                title="Are you sure?"
                                warning
                                showCancel
                                confirmButtonText="Yes, delete it!"
                                confirmBtnBsStyle="success"
                                cancelBtnBsStyle="danger"
                                onConfirm={() => {
                                  deleteSellerDropCharge();
                                  setconfirm_alert(false);
                                }}
                                onCancel={() => setconfirm_alert(false)}
                              >
                                {`You want to delete
                                                                 ${seller?.company_name} 
                                                                 Lyxa charge.`}
                              </SweetAlert>
                            ) : null}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {loading && (
                    <div className="text-center">
                      <CircularLoader animation="border" variant="info" />
                    </div>
                  )}
                  {!loading && sellersDropCharge.length < 1 && (
                    <div className="text-center">
                      <h4>No Data</h4>
                    </div>
                  )}
                  <div className="d-flex justify-content-center">
                    <AppPagination
                      paging={paging}
                      hasNextPage={hasNextPage}
                      hasPreviousPage={hasPreviousPage}
                      currentPage={currentPage}
                      lisener={(page) => dispatch(getSellerSpecialDropCharge(page))}
                    />
                  </div>
                </CardBody>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6}>
              <Card>
                <CardBody>
                  <CardTitle>Delivery Charge</CardTitle>
                  <hr />
                  <Form onSubmit={submitChargeRangeWise}>
                    <Row className="mt-3">
                      <Stack spacing={2} direction="row">
                        <TextField
                          id="variant name"
                          label="Range From (km)"
                          name="from"
                          variant="outlined"
                          style={{ width: '100%' }}
                          autoComplete="off"
                          value={rangeWiseDeliveryCharge?.from}
                          onChange={(event) => changeRangeWiseCharge(event)}
                          type="number"
                          required
                        />
                        <TextField
                          name="to"
                          label="Range To (km)"
                          variant="outlined"
                          style={{ width: '100%' }}
                          autoComplete="off"
                          value={rangeWiseDeliveryCharge?.to}
                          onChange={(event) => changeRangeWiseCharge(event)}
                          type="number"
                          required
                        />
                      </Stack>
                    </Row>
                    <Row>
                      <Stack spacing={2} direction="row" style={{ marginTop: '20px' }}>
                        <TextField
                          id="variant name"
                          label="Charge"
                          name="charge"
                          variant="outlined"
                          style={{ width: '144%' }}
                          autoComplete="off"
                          value={rangeWiseDeliveryCharge?.charge}
                          onChange={(event) => changeRangeWiseCharge(event)}
                          type="number"
                          required
                        />
                        <TextField
                          name="deliveryPersonCut"
                          label="Delivery Person Cut"
                          variant="outlined"
                          style={{ width: '100%' }}
                          autoComplete="off"
                          value={rangeWiseDeliveryCharge?.deliveryPersonCut}
                          onChange={(event) => changeRangeWiseCharge(event)}
                          type="number"
                          required
                        />
                        <Button
                          style={{
                            width: '40%',
                            padding: '10px 0',
                            marginLeft: '5px',
                            border: 0,
                          }}
                          color="primary"
                          type="submit"
                        >
                          Add Item
                        </Button>
                      </Stack>
                    </Row>
                  </Form>
                  <hr />
                  <Row className="mt-4">
                    <Col lg={12}>
                      <div>
                        {deliveryCut?.length > 0 && (
                          <div className="mb-4">
                            <Paper className="py-2">
                              <h5 className="text-center">Charge List</h5>
                              <hr />
                              {deliveryCut?.length > 0 &&
                                deliveryCut?.map((item, index) => (
                                  <ul key={Math.random()} style={{ listStyleType: 'square' }}>
                                    <li>
                                      <div className="d-flex justify-content-between">
                                        <span
                                          style={{
                                            fontSize: '15px',
                                            fontWeight: '500',
                                          }}
                                        >
                                          {`Range: ${item.from}km - ${item.to}km`}
                                        </span>
                                        <i
                                          className="fas fa-trash cursor-pointer me-3"
                                          style={{
                                            color: '#BD381C',
                                            fontSize: '15px',
                                          }}
                                          onClick={() => deleteDeliveryCharge(index)}
                                        ></i>
                                      </div>
                                      <p className="mb-0">{`Charge: ${item.charge} ${currency}`}</p>
                                      <p>{`Delivery Person: ${item.deliveryPersonCut} ${currency}`}</p>
                                    </li>
                                  </ul>
                                ))}
                            </Paper>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <div style={{ textAlign: 'center' }}>
                    {deliveryCut?.length > 0 && (
                      <Button
                        style={{
                          width: '40%',
                          padding: '10px 0',
                          backgroundColor: '#313131',
                          marginLeft: '5px',
                          border: 0,
                        }}
                        color="success"
                        onClick={submitDeliveryCut}
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Update'}
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Grid>
            <Grid item md={6}>
              <Card>
                <CardBody>
                  <CardTitle>Butler Delivery Charge</CardTitle>
                  <hr />
                  <Form onSubmit={submitChargeRangeWise}>
                    <Row className="mt-3">
                      <Stack spacing={2} direction="row">
                        {' '}
                        <TextField
                          id="variant name"
                          label="Range From (km)"
                          name="from"
                          variant="outlined"
                          style={{ width: '100%' }}
                          autoComplete="off"
                          value={rangeWiseDeliveryCharge?.from}
                          onChange={(event) => changeRangeWiseCharge(event)}
                          type="number"
                          required
                        />
                        <TextField
                          name="to"
                          label="Range To (km)"
                          variant="outlined"
                          style={{ width: '100%' }}
                          autoComplete="off"
                          value={rangeWiseDeliveryCharge?.to}
                          onChange={(event) => changeRangeWiseCharge(event)}
                          type="number"
                          required
                        />
                      </Stack>
                      <Stack spacing={2} direction="row" style={{ marginTop: '20px' }}>
                        <TextField
                          id="variant name"
                          label="Charge"
                          name="charge"
                          variant="outlined"
                          style={{ width: '144%' }}
                          autoComplete="off"
                          value={rangeWiseDeliveryCharge?.charge}
                          onChange={(event) => changeRangeWiseCharge(event)}
                          type="number"
                          required
                        />
                        <TextField
                          name="deliveryPersonCut"
                          label="Delivery Person Cut"
                          variant="outlined"
                          style={{ width: '100%' }}
                          autoComplete="off"
                          value={rangeWiseDeliveryCharge?.deliveryPersonCut}
                          onChange={(event) => changeRangeWiseCharge(event)}
                          type="number"
                          required
                        />
                        <Button
                          color="primary"
                          style={{
                            width: '40%',
                            padding: '10px 0',
                            marginLeft: '5px',
                            border: 0,
                          }}
                          size="md"
                          type="submit"
                        >
                          Add Item
                        </Button>
                      </Stack>
                    </Row>

                    <div style={{ textAlign: 'center' }}></div>
                  </Form>
                  <hr />
                  <Row className="mt-4">
                    <Col lg={12}>
                      <div>
                        {deliveryCut?.length > 0 && (
                          <div className="mb-4">
                            <Paper className="py-2">
                              <h5 className="text-center">Charge List</h5>
                              <hr />
                              {deliveryCut?.length > 0 &&
                                deliveryCut?.map((item, index) => (
                                  <ul key={Math.random()} style={{ listStyleType: 'square' }}>
                                    <li>
                                      <div className="d-flex justify-content-between">
                                        <span
                                          style={{
                                            fontSize: '15px',
                                            fontWeight: '500',
                                          }}
                                        >
                                          {`Range: ${item.from}km - ${item.to}km`}
                                        </span>
                                        <i
                                          className="fas fa-trash cursor-pointer me-3"
                                          style={{
                                            color: '#BD381C',
                                            fontSize: '15px',
                                          }}
                                          onClick={() => deleteDeliveryCharge(index)}
                                        ></i>
                                      </div>
                                      <p className="mb-0">{`Charge: ${item.charge} ${currency}`}</p>
                                      <p>{`Delivery Person: ${item.deliveryPersonCut} ${currency}`}</p>
                                    </li>
                                  </ul>
                                ))}
                            </Paper>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  {deliveryCut?.length > 0 && (
                    <div className="text-center">
                      <Button
                        style={{
                          width: '40%',
                          padding: '10px 0',
                          backgroundColor: '#313131',
                          marginLeft: '5px',
                          border: 0,
                        }}
                        color="success"
                        size="md"
                        className="px-4"
                        onClick={submitDeliveryCut}
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Update'}
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default PercentageSetting;
