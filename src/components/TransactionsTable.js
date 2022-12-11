import React from "react";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Spinner } from "reactstrap";
import AppPagination from "./AppPagination";
import { TrxType } from "./updateTrxsType";

const TransactionsTable = ({ trxs = [], loading }) => {
  return (
    <div>
      <Table id="tech-companies-1" className="table  table-hover text-center">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Amount</Th>
            <Th>Transaction Type</Th>
            <Th>Date</Th>
            <Th>Admin</Th>
          </Tr>
        </Thead>
        <Tbody style={{ position: "relative" }}>
          {trxs?.map((item, index) => (
            <Tr
              key={index}
              className="align-middle table-data cursor-pointer"
              style={{
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              <Th>{item?.order?.orderId}</Th>

              <Td>{item?.amount}</Td>
              <Td>{TrxType(item?.type)}</Td>
              <Td>{new Date(item?.createdAt).toLocaleDateString()}</Td>
              <Td>{item?.adminBy?.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="success" />
        </div>
      )}
      {!loading && trxs.length < 1 && (
        <div className="text-center">
          <h4>No Tansactions!</h4>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
