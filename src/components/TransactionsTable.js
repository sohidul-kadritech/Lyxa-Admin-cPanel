import React from 'react';

import { useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import CircularLoader from './CircularLoader';
import { TrxType } from './updateTrxsType';

function TransactionsTable({ trxs = [], loading }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  return (
    <div>
      <Table id="tech-companies-1" className="table  table-hover text-center">
        <Thead>
          <Tr>
            <Th>Trx ID</Th>
            <Th>Amount ({currency})</Th>
            <Th>Transaction Type</Th>
            <Th>Date</Th>
            <Th>Admin</Th>
          </Tr>
        </Thead>
        <Tbody style={{ position: 'relative' }}>
          {trxs?.map((item) => (
            <Tr
              key={item?.autoGenId}
              className="align-middle table-data cursor-pointer"
              style={{
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              <Th>{item?.autoGenId}</Th>

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
          <CircularLoader />
        </div>
      )}
      {!loading && trxs.length < 1 && (
        <div className="text-center">
          <h4>No Tansactions!</h4>
        </div>
      )}
    </div>
  );
}

export default TransactionsTable;
