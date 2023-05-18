import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Row, Spinner } from 'reactstrap';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Breadcrumb from '../../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../../components/GlobalWrapper';
import { useGlobalContext } from '../../../../context/GlobalContext';
import { SINGLE_ADMIN } from '../../../../network/Api';
import requestApi from '../../../../network/httpRequest';
import {
  addAdmin,
  addSellerCredential,
  addShopCredential,
  editAdmin,
} from '../../../../store/AdminControl/Admin/adminAction';

function CreateAdmin() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { id } = useParams();

  const { status, loading, admins } = useSelector((state) => state.adminReducer);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [activeStatus, setActiveStatus] = useState('');

  // const { userType: userType, _id: accountId } = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { userType, shop, seller } = currentUser;

  const updateData = (data) => {
    const { email, name, phone_number, status, adminType } = data;

    setName(name);
    setEmail(email);
    setPhoneNumber(phone_number);
    setActiveStatus(status);
    setRole(adminType);
  };

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
      history.push('/admin/list', { replace: true });
    }
  };

  useEffect(() => {
    if (id) {
      const findAdmin = admins.find((admin) => admin._id === id);

      if (findAdmin) {
        updateData(findAdmin);
        // console.log(findAdmin);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === 'admin') {
      const data = {
        name,
        email,
        password,
        role,
        number: phoneNumber,
        adminType: role,
      };

      if (id) {
        dispatch(
          editAdmin({
            ...data,
            id,
            status: activeStatus,
          })
        );
      } else {
        dispatch(addAdmin(data));
      }
    } else if (userType === 'seller') {
      dispatch(
        addSellerCredential({
          email,
          password,
          sellerId: seller?._id,
        })
      );
    } else {
      dispatch(
        addShopCredential({
          email,
          password,
          shopId: shop?._id,
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
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setRole('');
      }
    }
  }, [status]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem={id ? 'Edit' : 'Create'}
            title={userType === 'shop' ? 'Shop Crediantial' : userType === 'seller' ? 'Seller Crediantial' : 'Admin'}
            isRefresh={false}
          />

          <Form onSubmit={handleSubmit}>
            <Card>
              <CardBody>
                <div className="py-3">
                  <h5>
                    {userType === 'shop'
                      ? 'Shop Crediantial Informations'
                      : userType === 'Seller'
                      ? 'Shop Crediantial Informations'
                      : 'Admin Informations'}
                  </h5>
                  <hr />
                </div>
                {userType === 'admin' && (
                  <Row className="mb-3">
                    <Col xl={6} className="mb-3 mb-xl-0">
                      <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        style={{ width: '100%' }}
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
                        style={{ width: '100%' }}
                        type="number"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value.toString())}
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
                      style={{ width: '100%' }}
                      value={email}
                      type="gmail"
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </Col>

                  <Col xl={6}>
                    {id ? (
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={activeStatus}
                          label="Role"
                          onChange={(event) => setActiveStatus(event.target.value)}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    ) : null}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xl={6}>
                    <TextField
                      id="password"
                      label={`${id ? 'New Password' : 'Password'}`}
                      variant="outlined"
                      style={{ width: '100%' }}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required={!id}
                    />
                  </Col>
                  {userType === 'admin' && (
                    <Col xl={6} className="mb-3 mb-xl-0">
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={role}
                          label="Role"
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="customerService">Customer Service</MenuItem>
                        </Select>
                      </FormControl>
                    </Col>
                  )}
                </Row>
                <div className="pt-3 my-3 d-flex justify-content-center">
                  <Button color="primary" className="px-5" type="submit" disabled={loading}>
                    {loading ? (
                      <Spinner border="animation" variant="info" size="sm"></Spinner>
                    ) : id ? (
                      'Update'
                    ) : (
                      'Create'
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Form>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default CreateAdmin;
