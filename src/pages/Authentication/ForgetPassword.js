import PropTypes from 'prop-types';
import React from 'react';
import MetaTags from 'react-meta-tags';
import { Alert, Card, CardBody, Col, Container, Row } from 'reactstrap';

// Redux
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// availity-reactstrap-validation
import { AvField, AvForm } from 'availity-reactstrap-validation';

// action
import { userForgetPassword } from '../../store/actions';

// import images
import logoSm from '../../assets/images/logo-sm.png';

function ForgetPasswordPage({ userForgetPassword, history, forgetError, forgetSuccessMsg }) {
  function handleValidSubmit(event, values) {
    userForgetPassword(values, history);
  }

  return (
    <>
      <MetaTags>
        <title>Forget Password | Veltrix - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2"></i>
        </Link>
      </div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={4}>
              <Card className="overflow-hidden">
                <div className="bg-primary">
                  <div className="text-primary text-center p-4">
                    <h5 className="text-white font-size-20 p-2">Forget Password</h5>
                    <a href="index.html" className="logo logo-admin">
                      <img src={logoSm} height="24" alt="logo" />
                    </a>
                  </div>
                </div>
                <CardBody className="p-4">
                  {forgetError && forgetError ? (
                    <Alert color="danger" style={{ marginTop: '13px' }} className="mt-5">
                      {forgetError}
                    </Alert>
                  ) : null}
                  {forgetSuccessMsg ? (
                    <Alert color="success" style={{ marginTop: '13px' }} className="mt-5">
                      {forgetSuccessMsg}
                    </Alert>
                  ) : null}

                  <AvForm className="form-horizontal mt-4" onValidSubmit={(e, v) => handleValidSubmit(e, v)}>
                    <div className="mb-3">
                      <AvField
                        name="email"
                        label="Email"
                        className="form-control"
                        placeholder="Enter email"
                        type="email"
                        required
                      />
                    </div>
                    <Row className="mb-3">
                      <Col className="text-end">
                        <button className="btn btn-primary w-md waves-effect waves-light" type="submit">
                          Reset
                        </button>
                      </Col>
                    </Row>
                  </AvForm>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Remember It ?{' '}
                  <Link to="login" className="fw-medium text-primary">
                    {' '}
                    Sign In here{' '}
                  </Link>{' '}
                </p>
                <p>
                  © {new Date().getFullYear()} Veltrix. Crafted with <i className="mdi mdi-heart text-danger" /> by
                  Themesbrand
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
  return { forgetError, forgetSuccessMsg };
};

export default withRouter(connect(mapStatetoProps, { userForgetPassword })(ForgetPasswordPage));
