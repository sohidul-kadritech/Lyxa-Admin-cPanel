import { Tooltip } from '@mui/material';
import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

function TableForList({ values }) {
  return (
    <Table id="tech-companies-1" className="table table__wrapper table-striped table-bordered table-hover text-center">
      <Thead>
        <Tr>
          <Th>Image</Th>
          <Th>Name</Th>
          <Th>Shop Name</Th>
          <Th>Price</Th>
          <Th>Status</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody style={{ position: 'relative' }}>
        {values &&
          values.length > 0 &&
          values.map((item) => (
            <Tr
              key={Math.random()}
              className="align-middle"
              style={{
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              <Th style={{ height: '50px', maxWidth: '150px' }}>
                <img
                  className="img-fluid cursor-pointer"
                  alt=""
                  src={item?.images[0]}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Th>

              <Td>{item?.name}</Td>
              <Td>{item?.shop?.shopName}</Td>
              <Td>
                <p>{item?.price}</p>
                <p>{item?.shopEndTimeText}</p>
              </Td>
              <Td>{item?.status}</Td>
              <Td>
                <div>
                  <Tooltip title="Edit">
                    <button type="button" className="btn btn-success me-3 button">
                      <i className="fa fa-edit" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <button type="button" className="btn btn-danger button">
                      <i className="fa fa-trash" />
                    </button>
                  </Tooltip>
                </div>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
}

export default TableForList;
