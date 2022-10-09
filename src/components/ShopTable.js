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

const ShopTable = ({ shops = [] }) => {
  const history = useHistory();
  const dispatch = useDispatch();

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
        className="table table__wrapper table-striped table-bordered table-hover text-center"
      >
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Logo</Th>
            <Th>Name</Th>
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
                className="align-middle"
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                <Td>
                  <div style={{ maxWidth: "120px" }}>
                    <span>{item?.autoGenId}</span>
                  </div>
                </Td>
                <Th className="d-flex justify-content-center align-items-center">
                  <div className="image__wrapper">
                    <img
                      onClick={() => {
                        setIsOpen(true);
                        setSelectedImg(item?.shopLogo);
                      }}
                      className="img-fluid cursor-pointer"
                      alt=""
                      src={item.shopLogo}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </Th>

                <Td>{item?.shopName}</Td>
                <Td>{item?.shopType}</Td>
                <Td style={{ color: item?.shopStatus === 'active' ? 'green' : 'red' }}>{item?.shopStatus}</Td>
                <Td>
                  {item?.deals.length > 0
                    ? item?.deals.map((item, index) => (
                      <div key={index}>
                        <p>{item?.name}</p>
                      </div>
                    ))
                    : "N/A"}
                </Td>
                <Td>{item?.isFeatured ? "Yes" : "NO"}</Td>
                <Td>{item?.totalOrder}</Td>
                <Td>{item?.liveStatus}</Td>
                <Td>
                  <div>
                    <Tooltip title="Edit">
                      <button
                        className="btn btn-success me-1 button"
                        onClick={() => history.push(`/shops/edit/${item._id}`)}
                      >
                        <i className="fa fa-edit" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Details">
                      <button
                        className="btn btn-info button me-1"
                        onClick={() => {
                          history.push(`/shops/details/${item._id}`);
                        }}
                      >
                        <i className="fa fa-eye" />
                      </button>
                    </Tooltip>
                    {(account_type === 'admin' && adminType !== 'customerService') && <Tooltip title="See products">
                      <button
                        className="btn btn-success button me-1"
                        onClick={() => goToShopProductList(item._id)}
                      >
                        <i className="fab fa-product-hunt"></i>
                      </button>
                    </Tooltip>}
                    <Tooltip title="See orders ">
                      <button
                        className="btn btn-primary button"
                        onClick={() => goToShopOrderList(item._id)}
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                    </Tooltip>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="info" />
        </div>
      )}
      {!loading && shops.length < 1 && (
        <div className="text-center">
          <h4>No Shop!</h4>
        </div>
      )}
    </div>
  );
};

export default ShopTable;
