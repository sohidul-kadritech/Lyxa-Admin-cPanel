import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../../../components/GlobalWrapper";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAdmin,
  getAllAdmin,
  setStatusFalse,
} from "../../../../store/AdminControl/Admin/adminAction";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from 'react-router-dom';

const AdminList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, admins } = useSelector((state) => state.adminReducer);

  // const [confirm_alert, setconfirm_alert] = useState(false);
  // const [success_dlg, setsuccess_dlg] = useState(false);
  // const [dynamic_title, setdynamic_title] = useState("");
  // const [dynamic_description, setdynamic_description] = useState("")

  useEffect(() => {
   
      callAdminList();
      dispatch(setStatusFalse())
    
  }, []);

  const callAdminList = (refresh = false) => {
    dispatch(getAllAdmin(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          {/* {success_dlg ? (
            <SweetAlert
              success
              title={dynamic_title}
              onConfirm={() => {
                setsuccess_dlg(false);
              }}
            >
              {dynamic_description}
            </SweetAlert>
          ) : null} */}
          <Breadcrumb
            maintitle="Drop"
            breadcrumbItem={"List"}
            title="Admin"
            loading={loading}
            callList={callAdminList}
            isAddNew={true}
            addNewRoute={"admin/create"}
          />
          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={3} className="text-end" />
              </Row>
              <CardTitle className="h4"> Admins List</CardTitle>
              <Table
                id="tech-companies-1"
                className="table table__wrapper table-striped table-bordered table-hover text-center"
              >
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Status</Th>
                    <Th>Role</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: "relative" }}>
                  {admins.map((item, index) => {
                    return (
                      <Tr
                        key={index}
                        className="align-middle"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                      >
                        <Th>{item.name}</Th>

                        <Td>{item.email}</Td>
                        <Td>{item.number}</Td>
                        <Td>{item.status}</Td>
                        <Td>{"role"}</Td>
                        <Td>
                          <div>
                            <button
                              className="btn btn-info me-3 button"
                              onClick={() =>
                                history.push(`/admin/edit/${item._id}`)
                              }
                            >
                              <i className="fa fa-edit" />
                            </button>
                            <button
                              className="btn btn-danger button"
                              onClick={() =>
                                // 
                                // setconfirm_alert(true)
                                dispatch(deleteAdmin({ id: item._id }))
                              }
                            >
                              <i className="fa fa-trash" />
                            </button>
                            {/* {confirm_alert ? (
                              <SweetAlert
                                title="Are you sure?"
                                warning
                                showCancel
                                confirmButtonText="Yes, delete it!"
                                confirmBtnBsStyle="success"
                                cancelBtnBsStyle="danger"
                                onConfirm={() => {
                                  setconfirm_alert(false);
                                  setsuccess_dlg(true);
                                  
                                  setdynamic_title("Deleted");
                                  setdynamic_description(
                                    "Your file has been deleted."
                                  );
                                }}
                                onCancel={() => setconfirm_alert(false)}
                              >
                                Are You Sure You Want to Delete This Admin?
                              </SweetAlert>
                            ) : null} */}
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              {/* {loading && (
                    <Spinner
                      style={{ position: "fixed", left: "50%", top: "50%" }}
                      animation="border"
                      variant="info"
                    />
                  )} */}
            </CardBody>
          </Card>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default AdminList;
