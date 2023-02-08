import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { useHistory } from "react-router-dom";
import { Typography } from "@mui/material";

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
      <Tbody style={{ position: "relative" }}>
        {reviews?.length > 0 ? (
          reviews?.map((item, index) => {
            return (
              <Tr
                key={index}
                className="align-middle text-capitalize cursor-pointer"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <Td
                  onClick={() => {
                    !isFromOrder && history.push(`/orders/details/${item?.order?._id}`);
                  }}
                >
                  {item?.order?.orderId}
                </Td>
                <Td>{!item?.review ? "No Review" : item?.review}</Td>
                <Td>{item?.rating}</Td>
              </Tr>
            );
          })
        ) : (
          <Tr>
            <Td></Td>
            <Td>
              <Typography>
                <h5 className="text-center">No Data!</h5>
              </Typography>
            </Td>
            <Td></Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
}

export default ReviewTable;
