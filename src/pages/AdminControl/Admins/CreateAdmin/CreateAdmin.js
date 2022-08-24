import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../../components/GlobalWrapper";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  CardBody,
  Spinner,
  Form,
} from "reactstrap";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { useDispatch } from "react-redux";
import {
  addAdmin,
  addSellerCredential,
  addShopCredential,
  editAdmin,
} from "../../../../store/AdminControl/Admin/adminAction";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import requestApi from "../../../../network/httpRequest";
import { SINGLE_ADMIN } from "../../../../network/Api";

const CreateAdmin = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { id } = useParams();

  const { status, loading, admins } = useSelector(
    (state) => state.adminReducer
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  const { account_type: accountType, _id: accountId } = JSON.parse(
    localStorage.getItem("admin")
  );

  useEffect(() => {
    if (id) {
      const findAdmin = admins.find((admin) => admin._id == id);

      if (findAdmin) {
        updateData(findAdmin);
        // console.log(findAdmin);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  // CALL API FOR SINGLE ADMIN

  const callApi = async (id) => {
    const { data } = await requestApi().request(SINGLE_ADMIN, {
      params: {
        id,
      },
    });

    if (data.status) {
      updateData(data.data.admin);
    } else {
      history.push("/admin/list", { replace: true });
    }
  };

  const updateData = (data) => {
    const { email, name, phone_number, status } = data;

    setName(name);
    setEmail(email);
    setPhoneNumber(phone_number);
    setActiveStatus(status);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountType === "admin") {
      console.log("ceate admin");
      if (id) {
        dispatch(
          editAdmin({
            id,
            name,
            email,
            role,
            number: phoneNumber,
            status: activeStatus,
          })
        );
      } else {
        dispatch(
          addAdmin({
            name,
            email,
            password,
            role,
            number: phoneNumber,
          })
        );
      }
    } else if (accountType === "seller") {
      dispatch(
        addSellerCredential({
          email,
          password,
          sellerId: accountId,
        })
      );
    } else {
      dispatch(
        addShopCredential({
          email,
          password,
          shopId: accountId,
        })
      );
    }
  };

  // SUCCESS
  useEffect(() => {
    if (status) {
      if (id) {
        history.goBack();
      } else {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setRole("");
      }
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={id ? "Edit" : "Create"}
              title={
                accountType === "shop"
                  ? "Shop Crediantial"
                  : accountType === "seller"
                  ? "Seller Crediantial"
                  : "Admin"
              }
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />

            <Form onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <div className="py-3">
                    <h5>
                      {accountType === "shop"
                        ? "Shop Crediantial Informations"
                        : accountType === "Seller"
                        ? "Shop Crediantial Informations"
                        : "Admin Informations"}
                    </h5>
                    <hr />
                  </div>
                  {accountType === "admin" && (
                    <Row className="mb-3">
                      <Col xl={6} className="mb-3 mb-xl-0">
                        <TextField
                          id="name"
                          label="Name"
                          variant="outlined"
                          style={{ width: "100%" }}
                          autoComplete="off"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          required
                        />
                      </Col>

                      <Col xl={6} className="mb-3 mb-xl-0">
                        <TextField
                          id="phoneNumber"
                          label="Phone Number"
                          variant="outlined"
                          style={{ width: "100%" }}
                          type="number"
                          value={phoneNumber}
                          onChange={(event) =>
                            setPhoneNumber(event.target.value.toString())
                          }
                          required
                        />
                      </Col>
                    </Row>
                  )}
                  <Row className="mb-3">
                    <Col xl={6} className="mb-3 mb-xl-0">
                      <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        style={{ width: "100%" }}
                        value={email}
                        type="gmail"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </Col>

                    <Col xl={6}>
                      {id ? (
                        <FormControl fullWidth required>
                          <InputLabel id="demo-simple-select-label">
                            Status
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={activeStatus}
                            label="Role"
                            onChange={(event) =>
                              setActiveStatus(event.target.value)
                            }
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          id="password"
                          label="Password"
                          variant="outlined"
                          style={{ width: "100%" }}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required
                        />
                      )}
                    </Col>
                  </Row>

                  {accountType === "admin" && (
                    <Row className="mb-3">
                      <Col xl={6} className="mb-3 mb-xl-0">
                        <FormControl fullWidth required>
                          <InputLabel id="demo-simple-select-label">
                            Role
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                          >
                            <MenuItem value={"admin"}>Admin</MenuItem>
                            <MenuItem value={"customer_service"}>
                              Customer Service
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Col>
                    </Row>
                  )}

                  <div className="pt-3 my-3 d-flex justify-content-center">
                    <Button
                      color="primary"
                      className="px-5"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner
                          border="animation"
                          variant="info"
                          size="sm"
                        ></Spinner>
                      ) : id ? (
                        "Update"
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default CreateAdmin;
