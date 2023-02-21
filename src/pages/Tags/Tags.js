import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, Col, Container, Label, Modal, Row, Spinner } from 'reactstrap';
import {
  activeOptions,
  productStatusOptions,
  shopTypeOptions,
  shopTypeOptions2,
  sortByOptions,
} from '../../assets/staticData';
import AppPagination from '../../components/AppPagination';
import CircularLoader from '../../components/CircularLoader';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import Search from '../../components/Search';
import { successMsg } from '../../helpers/successMsg';
import {
  addTag,
  editTag,
  getAllTags,
  updateShopSearchKey,
  updateShopStatusKey,
  updateShopType,
  updateSortByKey,
} from '../../store/Shop/shopAction';

function Tags() {
  const dispatch = useDispatch();

  const {
    loading,
    tags,
    status,
    searchKey,
    statusKey,
    typeKey,
    sortByKey,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.shopReducer);

  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState({ label: 'Select Tag Type', value: '' });
  const [id, setId] = useState(null);
  const [activeStatus, setActiveStatus] = useState({ label: 'Select Tag Type', value: '' });

  useEffect(() => {
    dispatch(updateShopType({ label: 'All', value: 'all' }));
    dispatch(updateShopSearchKey(''));
    dispatch(updateSortByKey({ label: 'Desc', value: 'desc' }));
    dispatch(updateShopStatusKey({ label: 'All', value: 'all' }));
  }, []);

  const callTagList = (refresh = false) => {
    dispatch(getAllTags(refresh));
  };

  useEffect(() => {
    if (searchKey || statusKey || typeKey || sortByKey) {
      callTagList(true);
    }
  }, [searchKey, statusKey, typeKey, sortByKey]);

  // eslint-disable-next-line consistent-return
  const submitTag = () => {
    if (!name) {
      return successMsg('Please Enter  Name', 'error');
    }
    if (!type.value) {
      return successMsg('Please Select  Type', 'error');
    }
    if (id && !activeStatus.value) {
      return successMsg('Please Select  Type', 'error');
    }

    const data = {
      name,
      type: type.value,
    };

    if (id) {
      dispatch(
        editTag({
          ...data,
          id,
          status: activeStatus?.value,
        })
      );
    } else {
      dispatch(addTag(data));
    }
  };

  useEffect(() => {
    if (status) {
      setName('');
      setType({ label: 'Select Tag Type', value: '' });
      setId(null);
      setActiveStatus('');
      setOpenModal(false);
    }
  }, [status]);

  // FATCH DATA FOR UPDATE
  const setUpdateData = (tag) => {
    const findType = shopTypeOptions2.find((item) => item?.value === tag.type);
    const findStatus = activeOptions.find((item) => item?.value === tag.status);

    setOpenModal(true);
    setId(tag?._id);
    setName(tag?.name);
    setType(findType);
    setActiveStatus(findStatus);
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Tags" title="Shop" loading={loading} callList={callTagList} />
          <Card>
            <CardBody>
              <Row>
                <Col lg={4}>
                  <div className="mb-4">
                    <label className="control-label">Sort By</label>
                    <Select
                      palceholder="Select Status"
                      options={sortByOptions}
                      classNamePrefix="select2-selection"
                      value={sortByKey}
                      onChange={(e) => dispatch(updateSortByKey(e))}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-4">
                    <label className="control-label">Type</label>
                    <Select
                      palceholder="Select Status"
                      options={shopTypeOptions}
                      classNamePrefix="select2-selection"
                      required
                      value={typeKey}
                      onChange={(e) => dispatch(updateShopType(e))}
                      defaultValue=""
                    />
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-4">
                    <label className="control-label">Status</label>
                    <Select
                      palceholder="Select Status"
                      options={productStatusOptions}
                      classNamePrefix="select2-selection"
                      required
                      value={statusKey}
                      onChange={(e) => dispatch(updateShopStatusKey(e))}
                      defaultValue=""
                    />
                  </div>
                </Col>
              </Row>
              <Row className="d-flex justify-content-center">
                <Col lg={8}>
                  <Search dispatchFunc={updateShopSearchKey} placeholder="Search by name" />
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="d-flex justify-content-end align-items-center">
                <Button
                  className="btn btn-success"
                  onClick={() => {
                    setOpenModal(!openModal);
                    setId(null);
                    setName('');
                    setType({ label: 'Select Tag', value: '' });
                  }}
                >
                  Add New
                </Button>
              </div>
              <hr />
              <Table id="tech-companies-1" className="table  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                    <Th>Created At</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {tags?.map((item, index) => (
                    <Tr
                      key={index}
                      className="align-middle"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th>{item?.name}</Th>
                      <Th>{item?.type}</Th>
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
                        <Tooltip title="Edit">
                          <button
                            type="button"
                            className="btn btn-success me-2 button"
                            onClick={() => setUpdateData(item)}
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
                  <CircularLoader />
                </div>
              )}
              {!loading && tags.length < 1 && (
                <div className="text-center">
                  <h4>No Tag!</h4>
                </div>
              )}
            </CardBody>
          </Card>

          <Row>
            <Col xl={12}>
              <div className="d-flex justify-content-center">
                <AppPagination
                  paging={paging}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  currentPage={currentPage}
                  lisener={(page) => dispatch(getAllTags(true, null, page))}
                />
              </div>
            </Col>
          </Row>
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
          <h5 className="modal-title mt-0">{`${id ? 'Edit' : 'Add'}`} Tag</h5>
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
          <div className="mb-4">
            <Label>Name</Label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Enter Tag Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="control-label">Type</label>
            <Select
              palceholder="Select type"
              options={shopTypeOptions2}
              name="type"
              classNamePrefix="select2-selection"
              required
              value={type}
              onChange={(e) => setType(e)}
            />
          </div>
          {id && (
            <div className="mb-4">
              <label className="control-label">Status</label>
              <Select
                palceholder="Select Status"
                options={activeOptions}
                name="status"
                classNamePrefix="select2-selection"
                required
                value={activeStatus}
                onChange={(e) => setActiveStatus(e)}
              />
            </div>
          )}

          <Button className="mt-3 px-4" color="success" disabled={loading} onClick={submitTag}>
            {loading ? <Spinner animation="border" size="sm" variant="success" /> : id ? 'Edit' : 'Add'}
          </Button>
        </div>
      </Modal>
    </GlobalWrapper>
  );
}

export default Tags;
