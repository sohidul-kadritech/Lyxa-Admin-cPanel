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

const ShopTable = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { shops, loading } = useSelector((state) => state.shopReducer);

  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // GO TO SHOP PRODUCT LIST

  const goToShopProductList = (shopId) => {
    history.push({
      pathname: `/products/list`,
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
            <Th>Logo</Th>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Assigned deals</Th>
            <Th>Featured</Th>
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
                        // width: "100%",
                        height: "100%",
                        // objectFit: "contain",
                      }}
                    />
                  </div>
                </Th>

                <Td>{item?.shopName}</Td>
                <Td>{item?.shopType}</Td>
                <Td>{item?.shopStatus}</Td>
                <Td>
                  {item?.deals.length > 0 ? (
                    <>
                      <p>{item?.deals[0]?.option}</p>
                      <p>{item?.deals[1]?.option}</p>
                      <p>{item?.deals[2]?.option}</p>
                    </>
                  ) : (
                    "N/A"
                  )}
                </Td>
                <Td>{item?.isFeatured ? "Yes" : "NO"}</Td>
                <Td>
                  <div>
                    <Tooltip title="Edit">
                      <button
                        className="btn btn-success me-2 button"
                        onClick={() => history.push(`/shops/edit/${item._id}`)}
                      >
                        <i className="fa fa-edit" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Details">
                      <button
                        className="btn btn-info button me-2"
                        onClick={() => {
                          history.push(`/shops/details/${item._id}`);
                        }}
                      >
                        <i className="fa fa-eye" />
                      </button>
                    </Tooltip>
                    <Tooltip title="See shop products">
                      <button
                        className="btn btn-success button"
                        onClick={() => goToShopProductList(item._id)}
                      >
                        <i className="fab fa-product-hunt"></i>
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
          <h4>No Product!</h4>
        </div>
      )}
    </div>
  );
};

export default ShopTable;
