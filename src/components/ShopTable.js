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
import styled from "styled-components";
import { deleteShop } from "../store/Shop/shopAction";

const ShopTable = ({ sellerId }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { shops, loading } = useSelector((state) => state.shopReducer);

  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");

  // DELETE SHOP

  const handleDelete = (shopId) => {
    dispatch(deleteShop(shopId));
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

      {success_dlg ? (
        <SweetAlert
          success
          title={dynamic_title}
          onConfirm={() => {
            setsuccess_dlg(false);
          }}
        >
          {dynamic_description}
        </SweetAlert>
      ) : null}

      <Table
        id="tech-companies-1"
        className="table table__wrapper table-striped table-bordered table-hover text-center"
      >
        <Thead>
          <Tr>
            <Th>Logo</Th>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Open/Close</Th>
            <Th>Status</Th>
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
                <Th className="d-flex justify-content-center">
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

                <Td>{item.shopName}</Td>
                <Td>{item.shopType}</Td>
                <Td>
                  <p>{item.shopStartTimeText}</p>
                  <p>{item.shopEndTimeText}</p>
                </Td>
                <Td>{item.shopStatus}</Td>
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
                    <Tooltip title="Delete">
                      <button
                        className="btn btn-danger button"
                        onClick={() => {
                          setconfirm_alert(true);
                        }}
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </Tooltip>
                    {confirm_alert ? (
                      <SweetAlert
                        title="Are you sure?"
                        warning
                        showCancel
                        confirmButtonText="Yes, delete it!"
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="danger"
                        onConfirm={() => {
                          handleDelete(item._id);
                          setconfirm_alert(false);
                          setsuccess_dlg(true);
                          setdynamic_title("Deleted");
                          setdynamic_description("Your file has been deleted.");
                        }}
                        onCancel={() => setconfirm_alert(false)}
                      >
                        You want to delete this Shop.
                      </SweetAlert>
                    ) : null}
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
          <h4>No Data</h4>
        </div>
      )}
    </div>
  );
};

export default ShopTable;
