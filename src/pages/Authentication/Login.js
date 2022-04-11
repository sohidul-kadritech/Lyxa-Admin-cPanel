import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React, { useEffect } from "react";

import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";

// Redux
import { connect, useSelector } from "react-redux";
import { withRouter, Link, useHistory } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// actions
import { adminAuth, apiError } from "../../store/actions";

// import images
import logoSm from "../../assets/images/logo-sm.png";
import { toast } from "react-toastify";
import GlobalWrapper from "./../../components/GlobalWrapper";
import styled from "styled-components";

const Login = props => {
  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    props.adminAuth(values, props.history);
  };

  const history = useHistory();

  const { admin,accessToken,message } = useSelector(state => state.Login);

  useEffect(
    () => {
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
          progress: undefined
        });

        history.push("/dashboard");
      }
    },
    [accessToken]
  );

  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | Veltrix - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>

      <GlobalWrapper>
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={4}>
                <Card className="overflow-hidden">
                  <div className="bg-primary">
                    <div className="text-primary text-center p-4">
                      <h5 className="text-white font-size-20">
                        Welcome Back !
                      </h5>
                      <p className="text-white-50">
                        Sign in to continue to Veltrix.
                      </p>
                      <Link to="/" className="logo logo-admin">
                        <img src={logoSm} height="24" alt="logo" />
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
                        {props.error && typeof props.error === "string"
                          ? <Alert color="danger">
                              {props.error}
                            </Alert>
                          : null}

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

                        <Row className="mb-3">
                          <Col sm={12} className="text-center">
                            <button
                              className="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >
                              Log In
                            </button>
                          </Col>
                        </Row>
                      </AvForm>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    © {new Date().getFullYear()} Quicar Crafted with{" "}
                    <i className="mdi mdi-heart text-danger" /> by CODEPADDING
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { adminAuth, apiError })(Login)
);

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func
};
