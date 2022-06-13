import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
  Button,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import SweetAlert from "react-bootstrap-sweetalert";
import { Tooltip } from "@mui/material";

const TableForList = ({ titles, values }) => {
  return (
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
        {values &&
          values.length > 0 &&
          values.map((item, index) => {
            return (
              <Tr
                key={index}
                className="align-middle"
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                <Th style={{ height: "50px", maxWidth: "150px" }}>
                  <img
                    // onClick={() => {
                    //   setIsOpen(true);
                    //   setSelectedImg(item?.images[0]);
                    // }}
                    className="img-fluid cursor-pointer"
                    alt=""
                    src={item?.images[0]}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
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
                      <button
                        className="btn btn-success me-3 button"
                        // onClick={() =>
                        //   history.push(
                        //     `/products/edit/${item?._id}`
                        //   )
                        // }
                      >
                        <i className="fa fa-edit" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <button
                        className="btn btn-danger button"
                        // onClick={() => {
                        //   setconfirm_alert(true);
                        // }}
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </Tooltip>
                    {/* {confirm_alert ? (
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
                                  ) : null} */}
                  </div>
                </Td>
              </Tr>
            );
          })}
      </Tbody>
    </Table>
  );
};

export default TableForList;
