/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import MetaTags from 'react-meta-tags';

import { Alert, Button, Card, CardBody, Col, Container, Form, Modal, Row, Spinner } from 'reactstrap';

// Redux
import { connect, useSelector } from 'react-redux';
import { Link, useHistory, withRouter } from 'react-router-dom';

// availity-reactstrap-validation
import { AvField, AvForm } from 'availity-reactstrap-validation';

// import images
import { FormControlLabel } from '@material-ui/core';
import LockResetIcon from '@mui/icons-material/LockReset';
import { FormControl, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import styled from 'styled-components';
// import { successMsg } from "../../helpers/successMsg";
// import requestApi from "../../network/httpRequest";
import axios from 'axios';
import lyxaLogo from '../../assets/images/lyxa.png';
import GlobalWrapper from '../../components/GlobalWrapper';
import Footer from '../../components/VerticalLayout/Footer';
import { useGlobalContext } from '../../context';
import { FORGET_PASS } from '../../network/Api';
import { adminAuth, apiError } from '../../store/actions';

function Login(props) {
  const history = useHistory();
  const { admin, loading } = useSelector((state) => state.Login);
  const [type, setType] = useState('admin');
  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const [forgetPassData, setForgetPassData] = useState({
    type: '',
    to_email: '',
  });

  const [isLoading, setIsloading] = useState(false);

  const [forgetStatus, setForgetStatus] = useState({
    status: '',
    msg: '',
  });

  const { dispatchCurrentUser } = useGlobalContext();

  useEffect(() => {
    if (admin?.account_type) {
      console.log({ accountType: admin?.account_type });
      dispatchCurrentUser({
        type: admin?.account_type,
        payload: { [admin?.account_type]: admin, isCurrentUser: true },
      });

      if (type === 'customerService') {
        history.push('/orders/list');
      } else {
        history.push('/');
      }
    }
  }, [admin]);

  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    // eslint-disable-next-line react/destructuring-assignment
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
  // eslint-disable-next-line consistent-return
  const submitForgetPass = async (e) => {
    e.preventDefault();

    if (!forgetPassData.type) {
      return setForgetStatus({ status: 'error', msg: 'Select Role' });
    }
    if (!forgetPassData.to_email) {
      return setForgetStatus({ status: 'error', msg: 'Enter Valid Email' });
    }

    // eslint-disable-next-line no-useless-escape
    const emailRex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!forgetPassData.to_email.match(emailRex)) {
      return setForgetStatus({ status: 'error', msg: ' Invalid Email' });
    }

    try {
      setIsloading(true);
      const resp = await axios({
        method: 'POST',
        url: FORGET_PASS,
        data: {
          ...forgetPassData,
          type: forgetPassData.type,
        },
      });

      const { data } = resp;

      if (data) {
        setIsloading(false);

        if (data.status) {
          setForgetStatus({
            msg: `${data.message} Successfully`,
            status: 'success',
          });
          setForgetPassData({
            type: '',
            to_email: '',
          });
        } else {
          setForgetStatus({ msg: data.message, status: 'error' });
        }
      }
    } catch (e) {
      console.log(e.message);
      setIsloading(false);
    }
  };

  return (
    <>
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
                      <h5 className="text-white font-size-20">Welcome Back !</h5>
                      <p className="text-white-50">Sign in to continue to Lyxa.</p>
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
                        {props.error ? <Alert color="danger">{props.error}</Alert> : null}

                        <div className="mb-2">
                          <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Login As</FormLabel>
                            <RadioGroup
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="controlled-radio-buttons-group"
                              value={type}
                              onChange={handleLoginRoleChange}
                            >
                              <div className="d-flex justify-content-center flex-wrap">
                                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                                <FormControlLabel
                                  value="customerService"
                                  control={<Radio />}
                                  label="Customer Service"
                                />
                                <FormControlLabel value="seller" control={<Radio />} label="Seller" />
                                <FormControlLabel value="shop" control={<Radio />} label="Shop" />
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
                              setForgetStatus({ status: '', msg: '' });
                              setForgetPassData({
                                ...forgetPassData,
                                type: type === 'customerService' ? 'admin' : type,
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
                              {loading ? 'Loading...' : 'Log In'}
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
          centered
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
              <Alert color={forgetStatus.status === 'error' ? 'danger' : 'success'}>{forgetStatus.msg}</Alert>
            ) : null}
            {forgetStatus.status !== 'success' ? (
              <Form onSubmit={submitForgetPass}>
                <div className="mb-2">
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Role</FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="type"
                      value={forgetPassData.type}
                      onChange={handleChangeForgetPass}
                      required
                    >
                      <div className="d-flex justify-content-center flex-wrap">
                        <FormControlLabel value="admin" control={<Radio />} label="Admin / Customer Service" />
                        <FormControlLabel value="seller" control={<Radio />} label="Seller" />
                        <FormControlLabel value="shop" control={<Radio />} label="Shop" />
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
                    style={{ width: '150px' }}
                    disabled={isLoading || !forgetPassData.to_email || !forgetPassData.type}
                  >
                    {isLoading ? <Spinner color="danger" size="sm"></Spinner> : 'Send'}
                  </Button>
                </div>
              </Form>
            ) : null}
          </div>
        </Modal>
      </GlobalWrapper>
    </>
  );
}

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

export default withRouter(connect(mapStateToProps, { adminAuth, apiError })(Login));

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
};
