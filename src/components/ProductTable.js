import React, { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Spinner } from "reactstrap";
import { Tooltip } from "@mui/material";

import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProductStatus } from "../store/Product/productAction";
import styled from "styled-components";
import ThreeDotsMenu from "./ThreeDotsMenu";

const ProductTable = ({ products, loading }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const updateStatus = (id, status) => {
    dispatch(
      updateProductStatus({
        id,
        status: status === "active" ? "inactive" : "active",
      })
    );
  };

  // HANDLE MENU 

  const handleMenu = (menu, item) => {
    if (menu === 'Edit') {
      history.push(`/products/edit/${item?._id}`)
    } else if (menu === 'Update Status') {
      updateStatus(item?._id, item?.status)
    } else {
      history.push(`/products/details/${item?._id}`);
    }
  }

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
            <Th>Product</Th>
            <Th>Shop Name</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody style={{ position: "relative" }}>
          {products?.length > 0 &&
            products?.map((item, index) => {
              return (
                <Tr
                  key={index}
                  className="align-middle"
                  style={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  <Th className="d-flex">
                    <div style={{ width: "50px" }}>
                      <img
                        className="w-100 h-100"
                        lazy="loading"
                        style={{ borderRadius: "6px" }}
                        src={item?.images[0]}
                        alt=""
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedImg(item?.images[0]);
                        }}
                      />
                    </div>
                    <div
                      style={{ flex: "1", textAlign: "left" }}
                      className="ps-2"
                    >
                      <p className="mb-0 text-black">{item?.name}</p>
                      <p className="text-muted-50 mb-0">{`ID: ${item?.autoGenId}`}</p>
                    </div>
                  </Th>
                  <Td>{item?.shop?.shopName}</Td>
                  <Td>{item?.category?.name}</Td>
                  <Td>
                    <p>{item?.price}</p>
                    <p>{item?.shopEndTimeText}</p>
                  </Td>
                  <Td><div className={`${item?.status === 'active' ? 'active-status' : 'inactive-status'}`}>{item?.status}</div></Td>
                  <Td>
                    <ThreeDotsMenu
                      handleMenuClick={(menu) =>
                        handleMenu(menu, item)
                      }
                      menuItems={[
                        "Edit",
                        "Details",
                        'Update Status'
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

      {!loading && products?.length < 1 && (
        <div className="text-center">
          <h4>No Product!</h4>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
