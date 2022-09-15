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
    riderAllActivity,
  } = useSelector((state) => state.deliveryManReducer);

  const dispatch = useDispatch();

  // TRACK DELIVERY

  useEffect(() => {
    if (riderId) {
      dispatch(trackDeliveryBoy(riderId));
    }
    return;
  }, [riderId]);

  const calcActiveTime = (inTime, outTime) => {
    const startTime = moment(inTime, "HH:mm:ss a");
    const endTime = moment(outTime, "HH:mm:ss a");
    const duration = moment.duration(endTime.diff(startTime));
    const hours = parseInt(duration.asHours());
    const minutes = parseInt(duration.asMinutes()) % 60;

    return `${hours > 0 ? `${hours}h` : ''} ${minutes} min's`

  }

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
                  <Th>Date</Th>
                  <Th>Time In</Th>
                  <Th>Time Out</Th>
                  <Th>Active Time</Th>
                </Tr>
              </Thead>
              <Tbody style={{ position: "relative" }}>
                {riderAllActivity?.map((item, index) => {
                  return (
                    <Tr
                      key={index}
                      className="align-middle"
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      <Th>{moment(item?.Date).format("D-MM-YYYY")}</Th>
                      <Td>
                        {moment(item?.timeIn).format("h:mm:ss a")}
                      </Td>
                      <Td>

                        {moment(item?.timeOut).format("h:mm:ss a")}
                      </Td>
                      <Td>

                        {calcActiveTime(item?.timeIn, item?.timeOut)}
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
            {!loading && riderAllActivity?.length < 1 && (
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
