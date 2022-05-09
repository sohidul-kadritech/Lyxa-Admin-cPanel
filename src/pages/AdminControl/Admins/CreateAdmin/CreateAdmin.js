import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../../components/GlobalWrapper";
import {
  Card,
  Col,
  Container,
  Row,
  Modal,
  Button,
  CardTitle,
  CardBody,
  Spinner,
} from "reactstrap";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  addAdmin,
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

  useEffect(() => {
    if (id) {
      const findAdmin = admins.find((admin) => admin._id == id);
      // console.log({ findAdmin });
      if (findAdmin) {
        const { email, name, number, status } = findAdmin;
        //  console.log({adminEmail})
        setName(name);
        setEmail(email);
        setPhoneNumber(number);
        setActiveStatus(status);
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
    // console.log("from api", data);

    if (data.status) {
      const { email, name, number, status } = data.data.admin;
      //  console.log({adminEmail})
      setName(name);
      setEmail(email);
      setPhoneNumber(number);
      setActiveStatus(status);
    } else {
      history.push("/admin/list", {replace: true})
    }
  };

  const handleSubmit = () => {
    if (
      name == "" ||
      email == "" ||
      (!password && !id) ||
      phoneNumber == "" ||
      (!activeStatus && id) || !role
    ) {
      return toast.warn("Please Fill Up All Fields", {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (id) {
      dispatch(
        editAdmin({
          id,
          name,
          email,
          number: phoneNumber,
          status: activeStatus,
          role
        })
      );
    } else {
      dispatch(
        addAdmin({
          name,
          email,
          number: phoneNumber,
          password,
          role,
        })
      );
    }
  };

  // SUCCESS
  useEffect(() => {
    if (status) {
      if(id){
        history.goBack();
      }else {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setRole("")
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
              breadcrumbItem={id ? "Edit" :"Create"}
              title="Admin"
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <div className="py-3">
                  <h5>Admin Informations</h5>
                  <hr />
                </div>
                <Row>
                  <Col xl={6}>
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
                  <Col xl={6} className="mt-3 mt-xl-0">
                    <TextField
                      // id="email"
                      label="Email"
                      variant="outlined"
                      style={{ width: "100%" }}
                      value={email}
                      type="gmail"
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </Col>
                </Row>
                <Row className=" mt-4">
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
                          <MenuItem value="deactive">Deactive</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        // id="password"
                        label="Password"
                        variant="outlined"
                        style={{ width: "100%" }}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />
                    )}
                  </Col>

                  <Col xl={6} className="mt-3 mt-xl-0">
                    <TextField
                      // id="password"
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
                <Row className="mt-4">
                  <Col xl={6} className="mt-3 mt-xl-0">
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">Role</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Role"
                        onChange={e => setRole(e.target.value)}
                      >
                        <MenuItem value={'admin'}>Admin</MenuItem>
                        <MenuItem value={'seller'}>Seller</MenuItem>
                        <MenuItem value={'deliveryman'}>Delivery Man</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>

                <div className="pt-3 mt-3 d-flex justify-content-center">
                  <Button
                    color="primary"
                    className="px-5"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner
                        border="animation"
                        variant="info"
                        size="sm"
                      ></Spinner>
                    ) : id ? "Edit" : (
                      "Create"
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default CreateAdmin;
