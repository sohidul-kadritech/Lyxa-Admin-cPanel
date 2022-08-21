import React from "react";
import { useSelector } from "react-redux";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Spinner } from "reactstrap";
const TransactionsTable = ({ trxs = [], loading }) => {
  const updateTrxType = (type) => {
    let newType = "";
    if (type === "adminSettlebalanceShop") {
      newType = "Settle shop";
    } else if (type === "adminAddBalanceShop") {
      newType = "Add shop credit";
    } else if (type === "sellerCashInHandAdjust") {
      newType = "Adjust hand cash";
    } else if (type === "adminRemoveBalanceShop") {
      newType = "Remove shop credit";
    } else if (type === "deliveryBoyAmountSettle") {
      newType = "Settle Rider";
    } else if (type === "deliveryBoyAdminAmountReceivedCash") {
      newType = "Received rider cash";
    } else {
      newType = "Unknown";
    }

    return newType;
  };

  return (
    <div>
      <Table
        id="tech-companies-1"
        className="table table__wrapper table-striped table-bordered table-hover text-center"
      >
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Amount</Th>
            <Th>transaction Type</Th>
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
              <Th>{item?.autoTrxId}</Th>

              <Td>{item?.amount}</Td>
              <Td>{updateTrxType(item?.type)}</Td>
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
