import { TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Form, Modal, Row } from 'reactstrap';
import { cancelReasonOptions, cancelReasonOptions2, statusOptions, statusOptions2 } from '../../assets/staticData';
import CircularLoader from '../../components/CircularLoader';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import SelectOption from '../../components/SelectOption';
import {
  addCancelReason,
  getAllCancelReasons,
  updateCancelReason,
  updateReasonStatusKey,
  updateReasonTypeKey,
} from '../../store/Settings/settingsAction';

function CancelReason() {
  const dispatch = useDispatch();
  const { loading, cancelReasons, status, typeKey, activeStatus } = useSelector((state) => state.settingsReducer);

  const [openModal, setOpenModal] = useState(false);
  const [cancelReason, setCancelReason] = useState({
    name: '',
    type: '',
    status: '',
  });
  const [id, setId] = useState('');

  useEffect(() => {
    if (typeKey || activeStatus) {
      dispatch(getAllCancelReasons(true));
    }
  }, [typeKey, activeStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCancelReason({ ...cancelReason, [name]: value });
  };

  const submitCancelReason = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateCancelReason({ ...cancelReason, id }));
    } else {
      dispatch(addCancelReason(cancelReason));
    }
  };

  const callReasonsList = (refresh = false) => {
    dispatch(getAllCancelReasons(refresh));
  };

  const setReasonData = (item) => {
    setCancelReason({
      name: item.name,
      type: item.type,
      status: item.status,
    });
    setId(item._id);
    setOpenModal(true);
  };

  useEffect(() => {
    if (status) {
      setId(null);
      setOpenModal(false);
    }
  }, [status]);

  // MODIFIED TYPE
  const updateType = (type) => {
    let modifiedType = '';
    if (type === 'shopCancel') {
      modifiedType = 'Shop';
    } else if (type === 'userCancel') {
      modifiedType = 'User';
    } else if (type === 'userRefund') {
      modifiedType = 'User Refund';
    } else {
      modifiedType = 'Admin';
    }

    return modifiedType;
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Cancel Reason" loading={loading} callList={callReasonsList} />
          {/* FILTERS */}
          <Card>
            <CardBody>
              <Row>
                <Col lg={4}>
                  <div className="mb-4">
                    <SelectOption
                      label="Select Status"
                      options={statusOptions}
                      classNamePrefix="select2-selection"
                      value={activeStatus}
                      onChange={(e) => dispatch(updateReasonStatusKey(e.target.value))}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-4">
                    <SelectOption
                      label="Select Type"
                      options={cancelReasonOptions2}
                      classNamePrefix="select2-selection"
                      value={typeKey}
                      onChange={(e) => dispatch(updateReasonTypeKey(e.target.value))}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle className="h4"> Reason List</CardTitle>
                <Button
                  onClick={() => {
                    setOpenModal(!openModal);
                    setCancelReason({
                      name: '',
                      type: '',
                      status: '',
                    });
                    setId(null);
                  }}
                >
                  Add New
                </Button>
              </div>
              <hr />
              <Table id="tech-companies-1" className="table  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>SL</Th>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                    <Th>Created At</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {cancelReasons.map((item, index) => (
                    <Tr
                      key={index}
                      className="align-middle"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Td>{index + 1}</Td>
                      <Td>{item?.name}</Td>
                      <Td>{updateType(item?.type)}</Td>
                      <Td>
                        <div
                          className={`text-capitalize ${
                            item?.status === 'active' ? 'active-status' : 'inactive-status'
                          }`}
                        >
                          {item?.status}
                        </div>
                      </Td>
                      <Td>{new Date(item?.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <div>
                          <Tooltip title="Update">
                            <button
                              type="button"
                              className="btn btn-success me-0 me-xl-2 button"
                              onClick={() => setReasonData(item)}
                            >
                              <i className="fa fa-edit" />
                            </button>
                          </Tooltip>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && (
                <div className="text-center">
                  <CircularLoader />
                </div>
              )}
              {!loading && cancelReasons.length < 1 && (
                <div className="text-center">
                  <h4>No Data!</h4>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>

      <Modal
        isOpen={openModal}
        toggle={() => {
          setOpenModal(!openModal);
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Cancel Reason</h5>
          <button
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Form onSubmit={submitCancelReason}>
            <div className="mb-4">
              <TextField
                name="name"
                label="Reason"
                variant="outlined"
                style={{ width: '100%' }}
                autoComplete="off"
                value={cancelReason.name}
                onChange={(e) => handleChange(e)}
                required
                type="text"
              />
            </div>
            <div className="mb-4">
              <SelectOption
                label="Type"
                name="type"
                value={cancelReason.type}
                onChange={(e) => handleChange(e)}
                options={cancelReasonOptions}
              />
            </div>
            <div className="mb-4">
              <SelectOption
                label="Status"
                name="status"
                value={cancelReason.status}
                onChange={(e) => handleChange(e)}
                options={statusOptions2}
              />
            </div>

            <div className="d-flex justify-content-center mt-3">
              <Button color="primary" disabled={loading} type="submit" className="px-4">
                {loading ? 'Loading...' : id ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </GlobalWrapper>
  );
}

export default CancelReason;
