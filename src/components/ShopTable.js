import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import CircularLoader from './CircularLoader';
import TableImgItem from './TableImgItem';
import ThreeDotsMenu from './ThreeDotsMenu';

function ShopTable({ shops = [] }) {
  const history = useHistory();

  const { loading } = useSelector((state) => state.shopReducer);

  // eslint-disable-next-line no-unused-vars
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { account_type, adminType } = useSelector((store) => store.Login.admin);

  // GO TO SHOP PRODUCT LIST

  const goToShopProductList = (shopId) => {
    history.push({
      pathname: `/products/list`,
      search: `?shopId=${shopId}`,
    });
  };

  // GO TO SHOP ORDER LIST

  const goToShopOrderList = (shopId) => {
    history.push({
      pathname: `/orders/list`,
      search: `?shopId=${shopId}`,
    });
  };

  // HANDLE ACTION MENU

  const handleMenu = (menu, item) => {
    if (menu === 'Edit') {
      history.push(`/shops/edit/${item._id}`);
    } else if (menu === 'Products') {
      goToShopProductList(item._id);
    } else if (menu === 'Orders') {
      goToShopOrderList(item._id);
    }
  };

  const goToDetails = (id) => {
    history.push(`/shops/details/${id}`);
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

      <Table id="tech-companies-1" className="table table__wrapper table-hover text-center">
        <Thead>
          <Tr>
            <Th>Shop</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Assigned deals</Th>
            <Th>Featured</Th>
            <Th>Orders</Th>
            <Th>Live Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody style={{ position: 'relative' }}>
          {shops.map((item) => (
            <Tr
              key={item?._id}
              className="align-middle text-capitalize cursor-pointer"
              style={{
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              <Th onClick={() => goToDetails(item?._id)}>
                <TableImgItem
                  img={item?.shopLogo}
                  altImg={RoomOutlinedIcon}
                  name={item?.shopName}
                  subTitle={item?.seller.name}
                  id={item?.autoGenId}
                />
              </Th>

              <Td onClick={() => goToDetails(item?._id)}>{item?.shopType}</Td>
              <Td onClick={() => goToDetails(item?._id)}>
                <div className={`${item?.shopStatus === 'active' ? 'active-status' : 'inactive-status'}`}>
                  {item?.shopStatus}
                </div>
              </Td>
              <Td onClick={() => goToDetails(item?._id)}>
                {item?.deals.length > 0
                  ? item?.deals.map((item) => (
                      <div key={item?.name}>
                        <p>{item?.name}</p>
                      </div>
                    ))
                  : '--'}
              </Td>
              <Td onClick={() => goToDetails(item?._id)}>{item?.isFeatured ? 'Yes' : 'NO'}</Td>
              <Td onClick={() => goToDetails(item?._id)}>{item?.totalOrder}</Td>
              <Td onClick={() => goToDetails(item?._id)}>{item?.liveStatus}</Td>
              <Td>
                <ThreeDotsMenu
                  handleMenuClick={(menu) => handleMenu(menu, item)}
                  menuItems={[
                    account_type !== 'shop' && 'Edit',
                    'Details',
                    account_type === 'admin' && adminType !== 'customerService' && 'Products',
                    'Orders',
                  ]}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {loading && <CircularLoader />}
      {!loading && shops.length < 1 && (
        <div className="text-center">
          <h4>No Shop!</h4>
        </div>
      )}
    </div>
  );
}

export default ShopTable;
