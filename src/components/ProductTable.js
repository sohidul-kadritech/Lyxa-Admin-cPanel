import React, { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
  Form,
  Label,
  Modal,
} from "reactstrap";
import { Tooltip } from "@mui/material";

import SweetAlert from "react-bootstrap-sweetalert";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../store/Product/productAction";

const ProductTable = ({ products, loading }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
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
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Shop Name</Th>
            <Th>Price</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody style={{ position: "relative" }}>
          {products &&
            products.length > 0 &&
            products.map((item, index) => {
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
                          setSelectedImg(item?.images[0]);
                        }}
                        className="img-fluid cursor-pointer"
                        alt=""
                        src={item?.images[0]}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  </Th>

                  <Td style={{ maxWidth: "140px" }}>{item?.name}</Td>
                  <Td>{item?.shop?.shopName}</Td>
                  <Td>
                    <p>{item?.price}</p>
                    <p>{item?.shopEndTimeText}</p>
                  </Td>
                  <Td>{item?.status}</Td>
                  <Td>
                    <div>
                      <Tooltip title="Edit">
                        <button
                          className="btn btn-success  button"
                          onClick={() =>
                            history.push(`/products/edit/${item?._id}`)
                          }
                        >
                          <i className="fa fa-edit" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Details">
                        <button
                          className="btn btn-info button"
                          onClick={() => {
                            history.push(`/products/details/${item?._id}`);
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
                            handleDelete(item?._id);
                            setconfirm_alert(false);
                            setsuccess_dlg(true);
                            setdynamic_title("Deleted");
                            setdynamic_description(
                              "Your file has been deleted."
                            );
                          }}
                          onCancel={() => setconfirm_alert(false)}
                        >
                          You want to delete this Product.
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
      {!loading && products.length < 1 && (
        <div className="text-center">
          <h4>No Data</h4>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
