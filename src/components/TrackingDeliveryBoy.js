import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import moment from 'moment';
import React, { useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, Col, Row, Spinner } from 'reactstrap';
import {
  trackDeliveryBoy,
  updateActivityEndDate,
  updateActivityStartDate,
} from '../store/DeliveryMan/DeliveryManAction';
import AppPagination from './AppPagination';
import GlobalWrapper from './GlobalWrapper';
import TableImgItem from './TableImgItem';

function TrackingDeliveryBoy({ riderId }) {
  const {
    loading,
    statusPaging,
    statusHasNextPage,
    statusHasPreviousPage,
    statusCurrentPage,
    startDate,
    endDate,
    riderAllActivity,
    deliveryBoySummery,
  } = useSelector((state) => state.deliveryManReducer);

  const dispatch = useDispatch();

  // TRACK DELIVERY

  useEffect(() => {
    if (riderId) {
      if (startDate || endDate) {
        dispatch(trackDeliveryBoy(riderId));
      }
    }
  }, [riderId, startDate, endDate]);

  const calcActiveTime = (min) => {
    const hour = Math.floor(min / 60);
    const minutes = min % 60;

    return `${hour > 0 ? `${hour}h` : ''} ${minutes} min's`;
  };

  return (
    <GlobalWrapper>
      <Card>
        <CardBody>
          <div>
            <span>Total Active Time : </span>
            <span>{`${calcActiveTime(deliveryBoySummery?.totalMinutes)}`}</span>
          </div>
          <div className="d-flex my-3  ">
            <div className=" w-100">
              <label>Start Date</label>
              <div className="form-group mb-0 w-100">
                <Flatpickr
                  className="form-control d-block"
                  id="startDate"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(selectedDates, dateStr) => dispatch(updateActivityStartDate(dateStr))}
                  options={{
                    altInput: true,
                    altFormat: 'F j, Y',
                    dateFormat: 'Y-m-d',
                  }}
                />
              </div>
            </div>
            <div className="ms-2 w-100">
              <label>End Date</label>
              <div className="form-group mb-0">
                <Flatpickr
                  className="form-control w-100"
                  id="endDate"
                  placeholder="Select End Date"
                  value={endDate}
                  onChange={(selectedDates, dateStr) => dispatch(updateActivityEndDate(dateStr))}
                  options={{
                    altInput: true,
                    altFormat: 'F j, Y',
                    dateFormat: 'Y-m-d',
                  }}
                />
              </div>
            </div>
          </div>

          <Table id="tech-companies-1" className="table  table-hover text-center">
            <Thead>
              <Tr>
                <Th>Time In</Th>
                <Th>Time Out</Th>
                <Th>Active Time</Th>
              </Tr>
            </Thead>
            <Tbody style={{ position: 'relative' }}>
              {riderAllActivity?.map((item, index) => (
                <Tr
                  key={index}
                  className="align-middle"
                  style={{
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  <Th>
                    <TableImgItem
                      altImg={AccountBalanceIcon}
                      name={moment(item?.timeIn).format('h:mm a')}
                      id={moment(item?.timeIn).format('D-MM-YYYY')}
                    />
                  </Th>
                  <Th>
                    <TableImgItem
                      altImg={AccountBalanceIcon}
                      name={moment(item?.timeOut).format('h:mm a')}
                      id={moment(item?.timeOut).format('D-MM-YYYY')}
                    />
                  </Th>

                  <Td>{calcActiveTime(item?.activeTotal)}</Td>
                </Tr>
              ))}
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
  );
}

export default TrackingDeliveryBoy;
