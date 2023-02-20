import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardTitle, Col, Container, Label, Row, Spinner } from 'reactstrap';
import { activeOptions } from '../../assets/staticData';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import { addCuisine, editCuisine, getAllCuisine } from '../../store/Shop/shopAction';

function Cuisine() {
  const dispatch = useDispatch();

  const { loading, cuisines, status } = useSelector((state) => state.shopReducer);

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [activeStatus, setActiveStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const callCuisineList = (refresh = false) => {
    dispatch(getAllCuisine(refresh));
  };

  useEffect(() => {
    callCuisineList();
  }, []);

  const submitDataToServer = () => {
    setIsLoading(true);
    if (id) {
      dispatch(
        editCuisine({
          id,
          name,
          status: activeStatus.value,
        })
      );
    } else {
      dispatch(addCuisine(name));
    }
  };

  // SUBMIT DATA
  // eslint-disable-next-line consistent-return
  const submitCuisine = () => {
    if (!name) {
      return toast.warn('Please Add Cuisine Name', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    submitDataToServer();
  };

  const EditData = (cId, cName, cStatus) => {
    const findStatus = activeOptions.find((status) => status.value === cStatus);
    setId(cId);
    setName(cName);
    setActiveStatus(findStatus);
  };

  // SUCCESS
  useEffect(() => {
    if (status) {
      setIsLoading(false);
      setName('');
      setId('');
      setActiveStatus(null);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="Cuisines"
            title="Shop"
            loading={loading}
            callList={callCuisineList}
          />

          <Row>
            <Col md={4}>
              <Card>
                <CardBody>
                  <div className="mb-4">
                    <Label>Name</Label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Cuisine Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {id && (
                    <div className="mb-4">
                      <label className="control-label">Status</label>
                      <Select
                        palceholder="Select Status"
                        options={activeOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={activeStatus}
                        onChange={(e) => setActiveStatus(e)}
                        defaultValue=""
                      />
                    </div>
                  )}
                  <div className="d-flex justify-content-center">
                    <Button outline color="success" onClick={submitCuisine}>
                      {isLoading ? <span>Loading....</span> : id ? 'Edit' : 'Add'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col md={8}>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md={3} className="text-end" />
                  </Row>
                  <CardTitle className="h4"> Cuisines List</CardTitle>
                  <Table id="tech-companies-1" className="table table-hover text-center">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Status</Th>
                        <Th>Created At</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody style={{ position: 'relative' }}>
                      {cuisines.map((item, index) => (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: '15px',
                            fontWeight: '500',
                          }}
                        >
                          <Th>{item.name}</Th>

                          <Td>
                            <div
                              className={`text-capitalize ${
                                item?.status === 'active' ? 'active-status' : 'inactive-status'
                              }`}
                            >
                              {item?.status}
                            </div>
                          </Td>
                          <Td>{new Date(item.createdAt).toLocaleDateString()}</Td>
                          <Td>
                            <Tooltip title="Edit">
                              <button
                                type="button"
                                className="btn btn-success me-2 button"
                                onClick={() => EditData(item._id, item.name, item.status)}
                              >
                                <i className="fa fa-edit" />
                              </button>
                            </Tooltip>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {loading && (
                    <div className="text-center">
                      <Spinner animation="border" variant="info" />
                    </div>
                  )}
                  {!loading && cuisines.length < 1 && (
                    <div className="text-center">
                      <h4>No Data</h4>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default Cuisine;
