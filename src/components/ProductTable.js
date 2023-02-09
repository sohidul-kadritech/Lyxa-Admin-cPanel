import React, { useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Spinner } from 'reactstrap';

import Lightbox from 'react-image-lightbox';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateProductStatus } from '../store/Product/productAction';
import TableImgItem from './TableImgItem';
import ThreeDotsMenu from './ThreeDotsMenu';

function ProductTable({ products, loading }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  // eslint-disable-next-line no-unused-vars
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const updateStatus = (id, status) => {
    dispatch(
      updateProductStatus({
        id,
        status: status === 'active' ? 'inactive' : 'active',
      })
    );
  };

  // HANDLE MENU

  const handleMenu = (menu, item) => {
    if (menu === 'Edit') {
      history.push(`/products/edit/${item?._id}`);
    } else if (menu === 'Update Status') {
      updateStatus(item?._id, item?.status);
    }
  };

  // GO TO DETAILS

  const goToDetails = (id) => {
    history.push(`/products/details/${id}`);
  };

  return (
    <div>
      {isOpen && (
        <Lightbox
          mainSrc={selectedImg}
          enableZoom
          imageCaption="img"
          onCloseRequest={() => {
            setIsOpen(!isOpen);
          }}
        />
      )}

      <Table id="tech-companies-1" className="table  table-hover text-center">
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Shop</Th>
            <Th>Deal</Th>
            <Th>Price ({currency})</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody style={{ position: 'relative' }}>
          {products?.length > 0 &&
            products?.map((item) => {
              console.log(item);
              return (
                <Tr
                  key={Math.random()}
                  className="align-middle cursor-pointer"
                  style={{
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  <Th onClick={() => goToDetails(item?._id)}>
                    <TableImgItem
                      img={item?.images[0]}
                      name={item?.name}
                      subTitle={item?.category?.name}
                      id={item?.autoGenId}
                    />
                  </Th>

                  <Td onClick={() => goToDetails(item?._id)}>
                    <p>{item?.shop?.shopName}</p>
                  </Td>

                  <Td onClick={() => goToDetails(item?._id)}>
                    {item?.deals.length > 0
                      ? item?.deals.map((item) => (
                          <div key={Math.random()}>
                            <p>{item?.name}</p>
                          </div>
                        ))
                      : '--'}
                  </Td>

                  <Td onClick={() => goToDetails(item?._id)}>
                    <p>{item?.price}</p>
                    <p>{item?.shopEndTimeText}</p>
                  </Td>

                  <Td onClick={() => goToDetails(item?._id)}>
                    <div className={`${item?.status === 'active' ? 'active-status' : 'inactive-status'}`}>{`${
                      item?.status === 'active' ? 'Active' : 'Inactive'
                    }`}</div>
                  </Td>
                  <Td>
                    <ThreeDotsMenu
                      handleMenuClick={(menu) => handleMenu(menu, item)}
                      menuItems={['Edit', 'Update Status']}
                    />
                  </Td>
                </Tr>
              );
            })}
          {loading && (
            <Tr>
              <Td>
                <Spinner
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                  }}
                  animation="border"
                  color="danger"
                />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {!loading && products?.length < 1 && (
        <div className="text-center">
          <h4>No Product!</h4>
        </div>
      )}
    </div>
  );
}

export default ProductTable;
