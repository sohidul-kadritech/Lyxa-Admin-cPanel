import { useHistory } from 'react-router-dom';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

function ReviewTable({ reviews, isFromOrder }) {
  const history = useHistory();
  return (
    <Table id="tech-companies-1" className="table table__wrapper table-hover text-center">
      <Thead>
        <Tr>
          <Th>Order ID</Th>
          <Th>Order Reviews</Th>
          <Th>Rating</Th>
        </Tr>
      </Thead>
      <Tbody style={{ position: 'relative' }}>
        {reviews?.length > 0 ? (
          reviews?.map((item) => (
            <Tr
              key={Math.random()}
              className="align-middle text-capitalize cursor-pointer"
              style={{
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              <Td
                onClick={() => {
                  // eslint-disable-next-line no-unused-expressions
                  !isFromOrder && history.push(`/orders/details/${item?.order?._id}`);
                }}
              >
                {item?.order?.orderId}
              </Td>
              <Td>{!item?.review ? 'No Review' : item?.review}</Td>
              <Td>{item?.rating}</Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td></Td>
            <Td>
              <h5 className="text-center">No Data!</h5>
            </Td>
            <Td></Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
}

export default ReviewTable;
