import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Lightbox from "react-image-lightbox";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Carousel,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import ThreeDotsMenu from "./ThreeDotsMenu";
import TableImgItem from "./TableImgItem";

const ShopTable = ({ shops = [] }) => {
  const history = useHistory();

  const { loading } = useSelector((state) => state.shopReducer);

  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { account_type, adminType } = JSON.parse(localStorage.getItem("admin"));

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
    if (menu === "Edit") {
      history.push(`/shops/edit/${item._id}`);
    } else if (menu === "Products") {
      goToShopProductList(item._id);
    } else if (menu === "Orders") {
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
          enableZoom={true}
          imageCaption="img"
          onCloseRequest={() => {
            setIsOpen(!isOpen);
          }}
        />
      )}

      <Table
        id="tech-companies-1"
        className="table table__wrapper table-hover text-center"
      >
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
        <Tbody style={{ position: "relative" }}>
          {shops.map((item, index) => {
            return (
              <Tr
                key={index}
                className="align-middle text-capitalize cursor-pointer"
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
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
                  <div
                    className={`${
                      item?.shopStatus === "active"
                        ? "active-status"
                        : "inactive-status"
                    }`}
                  >
                    {item?.shopStatus}
                  </div>
                </Td>
                <Td onClick={() => goToDetails(item?._id)}>
                  {item?.deals.length > 0
                    ? item?.deals.map((item, index) => (
                        <div key={index}>
                          <p>{item?.name}</p>
                        </div>
                      ))
                    : "--"}
                </Td>
                <Td onClick={() => goToDetails(item?._id)}>
                  {item?.isFeatured ? "Yes" : "NO"}
                </Td>
                <Td onClick={() => goToDetails(item?._id)}>
                  {item?.totalOrder}
                </Td>
                <Td onClick={() => goToDetails(item?._id)}>
                  {item?.liveStatus}
                </Td>
                <Td>
                  <ThreeDotsMenu
                    handleMenuClick={(menu) => handleMenu(menu, item)}
                    menuItems={[
                      account_type !== "shop" && "Edit",
                      "Details",
                      account_type === "admin" &&
                        adminType !== "customerService" &&
                        "Products",
                      "Orders",
                    ]}
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
                    position: "fixed",
                    left: "50%",
                    top: "50%",
                  }}
                  animation="border"
                  color="danger"
                />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {!loading && shops.length < 1 && (
        <div className="text-center">
          <h4>No Shop!</h4>
        </div>
      )}
    </div>
  );
};

export default ShopTable;
