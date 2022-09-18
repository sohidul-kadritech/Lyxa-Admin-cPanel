import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Tooltip from "@mui/material/Tooltip";
import AppPagination from "../../../components/AppPagination";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import styled from "styled-components";
import Select from "react-select";
import {
  productStatusOptions,
  sortByOptions,
} from "../../../assets/staticData";
import {
  allDeliveryMan,
  updateDeliveryManSearchKey,
  updateDeliveryManSortByKey,
  updateDeliveryManStatusKey,
} from "../../../store/DeliveryMan/DeliveryManAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Search from "./../../../components/Search";
import TrackingDeliveryBoy from "../../../components/TrackingDeliveryBoy";
import Map from "../../../components/Map";
import moment from "moment";
import Info from "../../../components/Info";

const DeliverymanList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    sortByKey,
    statusKey,
    searchKey,
    deliveryMans,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.deliveryManReducer);

  const [track, setTrack] = useState(false);
  const [openActiveStatus, setOpenActiveStatus] = useState(false);
  const [id, setId] = useState(null);
  const [deliveryBoyName, setDeliveryBoyName] = useState('');
  const [rider, setRider] = useState(null);

  useEffect(() => {
    if (sortByKey || statusKey || searchKey) {
      callDeliveryManList(true);
    }
  }, [sortByKey, statusKey, searchKey]);

  const callDeliveryManList = (refresh = false) => {
    dispatch(allDeliveryMan(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Deliveryman"
              loading={loading}
              callList={callDeliveryManList}
              isAddNew={true}
              addNewRoute="deliveryman/add"
            />

            <Card>
              <CardBody>
                <Row className="d-flex justify-content-between">
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sort By</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={sortByKey}
                        onChange={(e) =>
                          dispatch(updateDeliveryManSortByKey(e))
                        }
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
                        onChange={(e) =>
                          dispatch(updateDeliveryManStatusKey(e))
                        }
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                  <Col lg={8}>
                    <Search dispatchFunc={updateDeliveryManSearchKey} />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Deliveryman List</CardTitle>
                <hr />
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Status</Th>
                      <Th>Live Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {deliveryMans.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Td>
                            <div style={{ maxWidth: "120px" }}>
                              <span>{item?._id}</span>
                            </div>
                          </Td>
                          <Th>{item?.name}</Th>
                          <Td>{item?.email}</Td>
                          <Td>{item?.number}</Td>
                          <Td style={{ color: item?.status === 'active' ? 'green' : 'red' }}>{item?.status}</Td>
                          <Td>
                            {item?.liveStatus === "online"
                              ? "Available"
                              : "Unavailable"}
                          </Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-0 me-lg-2 button"
                                  onClick={() =>
                                    history.push(
                                      `/deliveryman/edit/${item._id}`
                                    )
                                  }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-0 me-lg-2"
                                  onClick={() =>
                                    history.push(
                                      `/deliveryman/details/${item._id}`
                                    )
                                  }
                                >
                                  <i className="fa fa-eye" />
                                </button>
                              </Tooltip>
                              <Tooltip title="See rider current location">
                                <button
                                  className="btn btn-warning button me-0 me-lg-2"
                                  onClick={() => {
                                    setTrack(true);
                                    setRider(item)
                                  }}
                                >
                                  <i className="fa fa-map-marker" />
                                </button>
                              </Tooltip>
                              <Tooltip title="See rider active status">
                                <button
                                  className="btn btn-primary button me-0 me-lg-2"
                                  onClick={() => {
                                    setOpenActiveStatus(true);
                                    setId(item._id);
                                    setDeliveryBoyName(item?.name);
                                  }}
                                >
                                  <i className="fa fa-toggle-on" />
                                </button>
                              </Tooltip>
                            </div>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
                {!loading && deliveryMans.length < 1 && (
                  <div className="text-center">
                    <h4>No Data!</h4>
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
                    lisener={(page) => dispatch(allDeliveryMan(true, page))}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* ACTIVE STATUS OF DELIVERY BOY */}

        <Modal
          isOpen={openActiveStatus}
          toggle={() => setOpenActiveStatus(!openActiveStatus)}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">{`${deliveryBoyName} activity`}</h5>
            <button
              type="button"
              onClick={() => {
                setOpenActiveStatus(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body py-1"
          // style={{ maxHeight: "550px", overflow: "hidden scroll" }}
          >
            <TrackingDeliveryBoy riderId={id} />
          </div>
        </Modal>


        {/* DELIVERY BOY CURRENT LOCATION */}

        <Modal
          isOpen={track}
          toggle={() => {
            setTrack(!track);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Delivery boy current location.</h5>
            <button
              type="button"
              onClick={() => {
                setTrack(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body py-1"
          // style={{ maxHeight: "550px", overflow: "hidden scroll" }}
          >

            <div className='my-3'>
              <Info title='Name' value={rider?.name} />
              <Info title='Checking time' value={moment(new Date()).format("MMMM Do YYYY, h:mm:ss a")} />
            </div>

            {rider?.location ? <Map lat={rider?.location?.coordinates[0]} lng={rider?.location?.coordinates[1]} /> : <h5 className="text-center">No location found!</h5>}
          </div>
        </Modal>

      </GlobalWrapper>
    </React.Fragment>
  );
};

export default DeliverymanList;
