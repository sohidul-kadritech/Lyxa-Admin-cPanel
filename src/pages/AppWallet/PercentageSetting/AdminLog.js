import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Select from "react-select";
import { adminLogTypeOptions, sortByOptions } from "../../../assets/staticData";
import {
  getAdminLogHistory,
  updateAdminLogSortKey,
  updateAdminLogTypeKey,
} from "../../../store/Settings/settingsAction";
import moment from "moment";
import AppPagination from "./../../../components/AppPagination";

const AdminLog = () => {
  const dispatch = useDispatch();
  const {
    loading,
    adminLogType,
    logSortBy,
    adminLogs,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.settingsReducer);

  useEffect(() => {
    if (adminLogType || logSortBy) {
      callLogList(true);
    }
  }, [adminLogType, logSortBy]);

  const callLogList = (refresh = false) => {
    dispatch(getAdminLogHistory(refresh));
  };

  // HISTORY TYPE 

  const historyType = (type) => {
    let newType = '';
    if (type === 'maxDiscount') {
      newType = 'Max Discount'
    } else if (type === 'nearByShopKm') {
      newType = 'Near By ShopKm'
    } else if (type === 'searchDeliveryBoyKm') {
      newType = 'Search Delivery Boy Km'
    } else if (type === 'globalDropCharge') {
      newType = 'Global Drop Charge'
    } else if (type === 'globalDeliveryCut') {
      newType = 'Global Delivery Cut'
    } else if (type === 'specificSellerDropCharge') {
      newType = 'Specific Seller Drop Charge'
    } else if (type === 'specificSellerDeliveryCut') {
      newType = 'Specific Seller Delivery Cut'
    } else if (type === 'sellerDropChargeReset') {
      newType = 'Seller Drop Charge Reset'
    } else {
      newType = 'Unknown'
    }

    return newType;
  }

  // GET NEW VALUE

  // const getNewValue = (value) => {
  //   let newValue = null;

  //   if (typeof value === 'Number' || typeof value === 'String') {
  //     newValue = value;
  //   } else if (Array.isArray(value)) {
  //     if (value.length > 1) {
  //       let list = []
  //       value.map(item => {
  //         if (typeof item === 'number') {

  //           list = [...list, item]

  //         } else {
  //           list = [...list, item?.deliveryPersonCut];

  //         }
  //       })
  //       newValue = list;
  //     } else {
  //       newValue = value[0]
  //     }
  //   } else {
  //     newValue = 0
  //   }

  //   return newValue;
  // }

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Percentage Settings History"
              title="Admin"
              loading={loading}
              callList={callLogList}
            />

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
                        value={logSortBy}
                        onChange={(e) => dispatch(updateAdminLogSortKey(e))}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Type</label>
                      <Select
                        palceholder="Select Status"
                        options={adminLogTypeOptions}
                        classNamePrefix="select2-selection"
                        value={adminLogType}
                        onChange={(e) => dispatch(updateAdminLogTypeKey(e))}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4">Percentage History</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Old Value</Th>
                      <Th>New Value</Th>
                      <Th>Admin</Th>
                      <Th>Created Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {adminLogs?.map((item, index) => (
                      <Tr
                        key={index}
                        className="align-middle"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                      >
                        <Th>{historyType(item?.type)}</Th>
                        {/* <Td>{item?.type === "globalDropCharge" ? `${item?.oldValue?.dropPercentage} ${item?.oldValue?.dropPercentageType === 'amount' ? 'NGN' : '%'}` : item?.type === "specificSellerDeliveryCut" ? item?.oldValue[0] : }</Td> */}
                        <Td>{ }</Td>
                        <Td>{ }</Td>
                        <Td>
                          {item?.admin?.name}
                        </Td>
                        <Td>
                          {moment(item?.date).format("MMMM Do YYYY, h:mm:ss a")}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {!loading && adminLogs.length < 1 && (
                  <div className="text-center">
                    <h4>No History!</h4>
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
                    lisener={(page) => dispatch(getAdminLogHistory(true, page))}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default AdminLog;
