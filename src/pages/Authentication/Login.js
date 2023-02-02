import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Modal,
  Spinner,
  Form,
  Button,
} from "reactstrap";

// Redux
import { connect, useSelector } from "react-redux";
import { withRouter, Link, useHistory } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// actions
import { adminAuth, apiError } from "../../store/actions";

// import images
import lyxaLogo from "../../assets/images/lyxa.png";
import { toast } from "react-toastify";
import GlobalWrapper from "./../../components/GlobalWrapper";
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { FormControlLabel } from "@material-ui/core";
import Footer from "../../components/VerticalLayout/Footer";
import LockResetIcon from "@mui/icons-material/LockReset";
import styled from "styled-components";
// import { successMsg } from "../../helpers/successMsg";
// import requestApi from "../../network/httpRequest";
import { FORGET_PASS } from "../../network/Api";
import axios from "axios";

const Login = (props) => {
  const history = useHistory();

  const { admin, accessToken, message, loading } = useSelector(
    (state) => state.Login
  );

  const [type, setType] = useState("admin");

  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [forgetPassData, setForgetPassData] = useState({
    type: "",
    to_email: "",
  });
  const [isLoading, setIsloading] = useState(false);
  const [forgetStatus, setForgetStatus] = useState({
    status: "",
    msg: "",
  });

  useEffect(() => {
    // console.log(admin);
    if (accessToken) {
      toast.success(message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      if (
        admin?.account_type == "admin" &&
        admin?.adminType === "customerService"
      ) {
        history.push("/orders/list");
      } else {
        history.push("/dashboard");
      }
    }
  }, [accessToken]);

  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    // console.log({ values, type });
    props.adminAuth({ ...values, type }, props.history);
  };

  // ROLL CHANGE

  const handleLoginRoleChange = (e) => {
    setType(e.target.value);
  };

  // FORGET PASSWORD INPUT CHANGE

  const handleChangeForgetPass = (e) => {
    const { name, value } = e.target;

    setForgetPassData({ ...forgetPassData, [name]: value });
  };

  // SUBMIT FORGET PASS

  const submitForgetPass = async (e) => {
    e.preventDefault();

    if (!forgetPassData.type) {
      return setForgetStatus({ status: "error", msg: "Select Role" });
    }
    if (!forgetPassData.to_email) {
      return setForgetStatus({ status: "error", msg: "Enter Valid Email" });
    }

    let emailRex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/;

    if (!forgetPassData.to_email.match(emailRex)) {
      return setForgetStatus({ status: "error", msg: " Invalid Email" });
    }

    try {
      setIsloading(true);
      const { data } = await axios({
        method: "POST",
        url: FORGET_PASS,
        data: {
          ...forgetPassData,
          type: forgetPassData.type,
        },
      });

      if (data) {
        setIsloading(false);

        if (data.status) {
          setForgetStatus({
            msg: `${data.message} Successfully`,
            status: "success",
          });
          setForgetPassData({
            type: "",
            to_email: "",
          });
        } else {
          setForgetStatus({ msg: data.message, status: "error" });
        }
      }
    } catch (e) {
      console.log(e.message);
      setIsloading(false);
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | Lyxa</title>
      </MetaTags>

      <GlobalWrapper>
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={4}>
                <Card className="overflow-hidden">
                  <div className="bg-dark">
                    <div className="text-primary text-center p-4">
                      <h5 className="text-white font-size-20">
                        Welcome Back !
                      </h5>
                      <p className="text-white-50">
                        Sign in to continue to Lyxa.
                      </p>
                      <Link to="/" className="logo logo-admin">
                        <img src={lyxaLogo} height="24" alt="logo" />
                      </Link>
                    </div>
                  </div>

                  <CardBody className="p-4">
                    <div className="p-3">
                      <AvForm
                        className="form-horizontal mt-4"
                        onValidSubmit={(e, v) => {
                          handleValidSubmit(e, v);
                        }}
                      >
                        {props.error ? (
                          <Alert color="danger">{props.error}</Alert>
                        ) : null}

                        <div className="mb-2">
                          <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">
                              Login As
                            </FormLabel>
                            <RadioGroup
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="controlled-radio-buttons-group"
                              value={type}
                              onChange={handleLoginRoleChange}
                            >
                              <div className="d-flex justify-content-center flex-wrap">
                                <FormControlLabel
                                  value="admin"
                                  control={<Radio />}
                                  label="Admin"
                                />
                                <FormControlLabel
                                  value="customerService"
                                  control={<Radio />}
                                  label="Customer Service"
                                />
                                <FormControlLabel
                                  value="seller"
                                  control={<Radio />}
                                  label="Seller"
                                />
                                <FormControlLabel
                                  value="shop"
                                  control={<Radio />}
                                  label="Shop"
                                />
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </div>

                        <div className="mb-3">
                          <AvField
                            name="email"
                            label="Email"
                            value=""
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <AvField
                            name="password"
                            label="Password"
                            value=""
                            type="password"
                            required
                            placeholder="Enter Password"
                          />
                        </div>

                        <ForgatPassword className="mb-3">
                          <LockResetIcon />
                          <span
                            className=" ms-1 cursor-pointer"
                            onClick={() => {
                              setIsForgetPassword(!isForgetPassword);
                              setForgetStatus({ status: "", msg: "" });
                              setForgetPassData({
                                ...forgetPassData,
                                type:
                                  type === "customerService" ? "admin" : type,
                              });
                            }}
                          >
                            Forget Password
                          </span>
                        </ForgatPassword>

                        <Row className="mb-3">
                          <Col sm={12} className="text-center">
                            <button
                              className="btn btn-dark w-md waves-effect waves-light"
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? "Loading..." : "Log In"}
                            </button>
                          </Col>
                        </Row>
                      </AvForm>
                    </div>
                  </CardBody>
                </Card>
                <Footer />
              </Col>
            </Row>
          </Container>
        </div>

        <Modal
          isOpen={isForgetPassword}
          toggle={() => {
            setIsForgetPassword(!isForgetPassword);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Forget Password</h5>

            <button
              type="button"
              onClick={() => {
                setIsForgetPassword(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {forgetStatus.msg ? (
              <Alert
                color={forgetStatus.status === "error" ? "danger" : "success"}
              >
                {forgetStatus.msg}
              </Alert>
            ) : null}
            {forgetStatus.status !== "success" ? (
              <Form onSubmit={submitForgetPass}>
                <div className="mb-2">
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Role
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="type"
                      value={forgetPassData.type}
                      onChange={handleChangeForgetPass}
                      required
                    >
                      <div className="d-flex justify-content-center flex-wrap">
                        <FormControlLabel
                          value="admin"
                          control={<Radio />}
                          label="Admin / Customer Service"
                        />
                        <FormControlLabel
                          value="seller"
                          control={<Radio />}
                          label="Seller"
                        />
                        <FormControlLabel
                          value="shop"
                          control={<Radio />}
                          label="Shop"
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="mb-4">
                  <TextField
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                    label="Your Email"
                    name="to_email"
                    value={forgetPassData.to_email}
                    onChange={handleChangeForgetPass}
                  />
                </div>

                <div className="d-flex justify-content-center">
                  <Button
                    color="success"
                    size="lg"
                    className="px-4"
                    type="submit"
                    style={{ width: "150px" }}
                    disabled={
                      isLoading ||
                      !forgetPassData.to_email ||
                      !forgetPassData.type
                    }
                  >
                    {isLoading ? (
                      <Spinner color="danger" size="sm"></Spinner>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </Form>
            ) : null}
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const ForgatPassword = styled.div`
  &:hover {
    color: #f73f3f;
    font-weight: 500;
  }
`;

const mapStateToProps = (state) => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { adminAuth, apiError })(Login)
);

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
};
