import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { trackDeliveryBoy } from "../store/DeliveryMan/DeliveryManAction";
import GlobalWrapper from "./GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import AppPagination from "./AppPagination";
import moment from "moment";

const TrackingDeliveryBoy = ({ riderId }) => {
  const {
    loading,
    statusPaging,
    statusHasNextPage,
    statusHasPreviousPage,
    statusCurrentPage,
    riderAllActiveStatus,
  } = useSelector((state) => state.deliveryManReducer);

  const dispatch = useDispatch();

  // TRACK DELIVERY

  useEffect(() => {
    if (riderId) {
      dispatch(trackDeliveryBoy(riderId));
    }
    return;
  }, [riderId]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <Card>
          <CardBody>
            <Table
              id="tech-companies-1"
              className="table table__wrapper table-striped table-bordered table-hover text-center"
            >
              <Thead>
                <Tr>
                  <Th>Status</Th>
                  <Th>Time</Th>
                </Tr>
              </Thead>
              <Tbody style={{ position: "relative" }}>
                {riderAllActiveStatus?.map((item, index) => {
                  return (
                    <Tr
                      key={index}
                      className="align-middle"
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      <Th>{item?.status}</Th>
                      <Td>
                        {moment(item?.time).format("MMMM Do YYYY, h:mm:ss a")}
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
            {!loading && riderAllActiveStatus.length < 1 && (
              <div className="text-center">
                <h4>No Status yet!</h4>
              </div>
            )}
          </CardBody>
        </Card>
        <Row>
          <Col xl={12}>
            <div className="d-flex justify-content-center">
              <AppPagination
                paging={statusPaging}
                hasNextPage={statusHasNextPage}
                hasPreviousPage={statusHasPreviousPage}
                currentPage={statusCurrentPage}
                lisener={(page) => dispatch(trackDeliveryBoy(riderId, page))}
              />
            </div>
          </Col>
        </Row>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default TrackingDeliveryBoy;
