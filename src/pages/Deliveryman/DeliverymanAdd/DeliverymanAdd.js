/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import PhoneInput, { getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Container, Form, Label, Row, Spinner } from 'reactstrap';
import { activeOptions, shiftOptions, zoneOption } from '../../../assets/staticData';
import formatBytes from '../../../common/imageFormatBytes';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { callApi } from '../../../components/SingleApiCall';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import { GET_ALL_ZONE, IMAGE_UPLOAD, SINGLE_DELIVERY_MAN } from '../../../network/Api';
import AXIOS from '../../../network/axios';
import requestApi from '../../../network/httpRequest';
import { addDeliveryMan, editDeliveryMan } from '../../../store/DeliveryMan/DeliveryManAction';

function DeliverymanAdd() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const { loading, deliveryMans, status } = useSelector((state) => state.deliveryManReducer);

  const { currentUser } = useGlobalContext();

  console.log('===> ', currentUser);
  // eslint-disable-next-line no-undef
  const queryClient = useQueryClient();

  const apiurl = currentUser?.userType === 'admin' ? GET_ALL_ZONE : '';

  console.log('===> url: ', apiurl);

  const getAllZones = useQuery([apiurl], () => AXIOS.get(apiurl));

  console.log('===> ', getAllZones?.data?.data?.zones);

  const [deliveryBoyAddress, setDeliveryBoyAddress] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [address, setAddress] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState({
    country: 'BD',
    number: '',
  });
  const [pin, setPin] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeStatus, setActiveStatus] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNum, setVehicleNum] = useState('');
  const [nid, setNid] = useState('');
  const [profile, setProfile] = useState();
  const [vehicleDoc, setVehicleDoc] = useState('');
  const [contractPaper, setContractPaper] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shift, setShift] = useState('');
  const [zone, setZone] = useState('');
  // console.log(shift);

  const handlePhoneChange = (value) => {
    setPhone((prev) => ({ ...prev, number: value }));
  };

  // UPDATE DATA
  const updateData = (data) => {
    console.log(data);
    const {
      name,
      email,
      number,
      status,
      nationalIdDocument,
      vehicleRegistrationDocument,
      vehicleType,
      vehicleNumber,
      contractImage,
      image,
      countryCode,
      isLogin,
      shift,
    } = data;

    const findStatus = activeOptions.find((option) => option.value === status);
    const findShift = shiftOptions.find((option) => option.value === shift);
    setShift(findShift);
    setIsEditMode(true);
    setName(name);
    setEmail(email);
    setPhone({
      number: `+${getCountryCallingCode('BD')}${number}`,
      country: 'BD',
    });
    setActiveStatus(findStatus);
    setNid(nationalIdDocument);
    setProfile(image);
    setVehicleDoc(vehicleRegistrationDocument);
    setVehicleType(vehicleType);
    setVehicleNum(vehicleNumber);
    setContractPaper(contractImage);
    setIsLoggedIn(isLogin);
  };

  // ID FROM PARAMSnumber
  useEffect(async () => {
    if (id) {
      const findDeliveryMan = deliveryMans.find((man) => man._id === id);
      if (findDeliveryMan) {
        updateData(findDeliveryMan);
      } else {
        const data = await callApi(id, SINGLE_DELIVERY_MAN, 'delivery');
        if (data) {
          updateData(data);
        } else {
          history.push('/deliveryman/list', { replace: true });
        }
      }
    }
  }, [id]);

  //  UPLAOD IMAGE TO SERVER
  // eslint-disable-next-line consistent-return
  const imageUploadToServer = async (image) => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await requestApi().request(IMAGE_UPLOAD, {
        method: 'POST',
        data: formData,
      });

      if (data.status) {
        return data.data.url;
      }
      console.log(data.error);
    } catch (error) {
      console.log(error.message);
    }
  };

  // SUBMIT DATA
  const formatNumber = (numberObj) => {
    const countryCode = numberObj.country;
    const countrySFix = `+${getCountryCallingCode(countryCode)}`;
    const number = numberObj.number.slice(countrySFix.length);

    return { countryCode, number };
  };

  const submitData = (nidUrl, docUrl, contractUrl, profileUrl, isLoggedIn) => {
    console.log(isLoggedIn);
    const { number, countryCode } = formatNumber(phone);
    const data = {
      name,
      email,
      password,
      number,
      countryCode,
      vehicleType,
      vehicleNumber: vehicleNum,
      nationalIdDocument: nidUrl,
      vehicleRegistrationDocument: docUrl,
      contractImage: contractUrl,
      image: profileUrl,
      shift: shift.value,
    };

    if (id) {
      dispatch(
        editDeliveryMan({
          ...data,
          isLogin: isLoggedIn,
          id,
          status: activeStatus?.value,
          // eslint-disable-next-line prettier/prettier
        })
      );
    } else {
      dispatch(
        addDeliveryMan({
          ...data,
          deliveryBoyAddress,
          // eslint-disable-next-line prettier/prettier
        })
      );
    }
  };

  const uploadImages = async (isLoggedIn) => {
    let nidUrl = null;
    let docUrl = null;
    let contractUrl = null;
    let profileUrl = null;

    setIsLoading(true);
    if (nid) {
      if (typeof nid === 'string') {
        nidUrl = nid;
      } else {
        nidUrl = await imageUploadToServer(nid);
      }
    }
    if (profile) {
      if (typeof profile === 'string') {
        profileUrl = profile;
      } else {
        profileUrl = await imageUploadToServer(profile);
      }
    }
    if (vehicleDoc) {
      if (typeof vehicleDoc === 'string') {
        docUrl = vehicleDoc;
      } else {
        docUrl = await imageUploadToServer(vehicleDoc);
      }
    }
    if (contractPaper) {
      if (typeof contractPaper === 'string') {
        contractUrl = contractPaper;
      } else {
        contractUrl = await imageUploadToServer(contractPaper);
      }
    }

    if (nidUrl && docUrl && contractUrl && profileUrl) {
      setIsLoading(false);
      submitData(nidUrl, docUrl, contractUrl, profileUrl, isLoggedIn);
    }
  };

  // VALIDATIONS
  // eslint-disable-next-line consistent-return
  const submitDeliveryman = (e, isLoggedIn) => {
    e.preventDefault();
    if (!vehicleType) {
      return successMsg('select Vahicle Type');
    }

    if (!nid || !vehicleDoc) {
      return successMsg('select Images');
    }

    const re = /\S+@\S+\.\S+/;
    const isValid = re.test(email);

    if (!isValid) {
      return successMsg('Invalid Email');
    }

    if (!isValidPhoneNumber(phone.number)) {
      setIsValidPhone(false);
      return successMsg('Invalid Phone');
    }

    uploadImages(isLoggedIn);
  };

  // SUCCESS
  useEffect(() => {
    if (status) {
      if (id) {
        history.goBack();
      } else {
        setName('');
        setEmail('');
        setPassword('');
        setPhone({
          number: '',
          country: '',
        });
        setPin('');
        setActiveStatus('');
        setAddress(null);
        setVehicleType('');
        setVehicleNum('');
        setNid(null);
        setVehicleDoc(null);
        setContractPaper(null);
        setDeliveryBoyAddress('');
        window.scrollTo(0, 0);
      }
    }
  }, [status]);

  // IMAGE

  const handleAcceptedFiles = (files, type) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
        // eslint-disable-next-line prettier/prettier
      })
    );

    if (type === 'nid') {
      setNid(files[0]);
    } else if (type === 'contract') {
      setContractPaper(files[0]);
    } else if (type === 'profile') {
      setProfile(files[0]);
    } else {
      setVehicleDoc(files[0]);
    }
  };

  return (
    <Box>
      <GlobalWrapper>
        <Box className="page-content">
          <Container fluid>
            <Breadcrumb maintitle="Lyxa" breadcrumbItem={id ? 'Edit' : 'Add'} title="Deliveryman" isRefresh={false} />
            <Form onSubmit={submitDeliveryman}>
              <Card>
                <CardBody>
                  <Row className="pb-3 ">
                    <Box className="mb-3">
                      <h5>Delivery Man Informations</h5>
                      <hr />
                    </Box>

                    <Col lg={6}>
                      <Box className="mb-4">
                        <Label>Name</Label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter  Name"
                          name="name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Box>
                      <Box className="mb-4">
                        <label className="control-label">Phone</label>
                        <PhoneInput
                          defaultCountry="BD"
                          placeholder="Enter phone number"
                          value={phone.number}
                          international
                          countryCallingCodeEditable={false}
                          onCountryChange={(e) => {
                            setPhone((prev) => ({ ...prev, country: e }));
                          }}
                          onChange={(value) => {
                            handlePhoneChange(value);
                          }}
                          onBlur={() => {
                            setIsValidPhone(isValidPhoneNumber(phone.number));
                          }}
                        />
                        {!isValidPhone && <Box style={{ color: 'red', fontSize: '12px' }}>Number is invalid</Box>}
                      </Box>

                      <Box className="mb-4">
                        <label className="control-label">Vehicle Type</label>
                        <input
                          className="form-control"
                          name="Vehicle Type"
                          type="text"
                          placeholder="Vahicle Type"
                          required
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                        />
                      </Box>
                      <Box className="mb-4">
                        <Label>Vehicle Number</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="vahicleNumber"
                          placeholder="Enter Vahicle Number"
                          value={vehicleNum}
                          onChange={(e) => setVehicleNum(e.target.value)}
                          required
                        />
                      </Box>
                      <Box className="mb-4">
                        <Label>Shift</Label>
                        <Select
                          palceholder="Select Shift"
                          name="shift"
                          options={shiftOptions}
                          classNamePrefix="select2-selection"
                          required
                          value={shift}
                          onChange={(e) => setShift(e)}
                          defaultValue=""
                        />
                      </Box>
                      <Box className="mb-4">
                        <Label>Select Zone</Label>
                        <Select
                          palceholder="Select Zone"
                          name="zoneId"
                          options={zoneOption}
                          classNamePrefix="select2-selection"
                          required
                          value={shift}
                          onChange={(e) => setShift(e)}
                          defaultValue=""
                        />
                      </Box>
                    </Col>

                    <Col lg={6}>
                      <Box className="mb-4">
                        <Label>Email</Label>
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </Box>

                      <Box className="mb-4">
                        <Label>{id ? 'New Password' : 'Password'}</Label>
                        <input
                          className="form-control"
                          type="text"
                          name="password"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required={!id}
                        />
                      </Box>

                      {!id ? (
                        <Box className="mb-4">
                          <Label>Zip Code</Label>
                          <input
                            className="form-control"
                            type="number"
                            name="pin"
                            placeholder="Enter Zip Code"
                            required
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                          />
                        </Box>
                      ) : (
                        <Box className="mb-4">
                          <label className="control-label">Status</label>
                          <Select
                            palceholder="Select Status"
                            name="status"
                            options={activeOptions}
                            classNamePrefix="select2-selection"
                            required
                            value={activeStatus}
                            onChange={(e) => setActiveStatus(e)}
                            defaultValue=""
                          />
                        </Box>
                      )}
                      {!id && (
                        <Box className="mb-4">
                          <Label>Address</Label>
                          <textarea
                            className="form-control"
                            name="phone"
                            type="text"
                            placeholder="Enter Address"
                            required
                            multiple
                            rows="4"
                            value={deliveryBoyAddress}
                            onChange={(e) => setDeliveryBoyAddress(e.target.value)}
                          />
                        </Box>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6}>
                      <Label>Profile Image</Label>
                      <Box className="mb-5">
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, 'profile');
                          }}
                          accept=".jpg, .jpeg, .png"
                          maxSize={1000 * 1000}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box className="dropzone">
                              <Box
                                className="dz-message needsclick"
                                {...getRootProps()}
                                // onClick={() => setmodal_fullscreen(true)}
                              >
                                <input {...getInputProps()} />
                                <Box className="mb-3">
                                  <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                </Box>
                                <h4>Drop files here or click to upload.</h4>
                                <small
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  * Max Image size allowed Id 1 Mb.
                                </small>
                              </Box>
                            </Box>
                          )}
                        </Dropzone>
                        <Box className="dropzone-previews mt-3" id="file-previews">
                          {profile && (
                            <Card
                              className="
                            mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete
                            "
                            >
                              <Box className="p-2">
                                <Row className="align-items-center position-relative">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      // height="80"
                                      style={{
                                        maxWidth: '80px',
                                      }}
                                      className=" bg-light"
                                      src={profile.preview ? profile.preview : profile}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link to="#" className="text-muted font-weight-bold">
                                      {profile.name ? profile.name : 'Profile'}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{profile.formattedSize && profile.formattedSize}</strong>
                                    </p>
                                  </Col>

                                  <Box
                                    className="position-absolute"
                                    style={{
                                      left: '0px',
                                      top: '0px',
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: 'flex-end',
                                    }}
                                  >
                                    <i
                                      onClick={() => setProfile(null)}
                                      className="mdi mdi-delete text-danger "
                                      style={{
                                        fontSize: '25px',
                                        cursor: 'pointer',
                                      }}
                                    ></i>
                                  </Box>
                                </Row>
                              </Box>
                            </Card>
                          )}
                        </Box>
                      </Box>
                    </Col>
                    <Col lg={6}>
                      <Label> National ID</Label>
                      <Box className="mb-5">
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, 'nid');
                          }}
                          accept=".jpg, .jpeg, .png"
                          maxSize={1000 * 1000}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box className="dropzone">
                              <Box className="dz-message needsclick" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Box className="mb-3">
                                  <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                </Box>
                                <h4>Drop files here or click to upload.</h4>
                                <small
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  * Max Image size allowed Id 1 Mb.
                                </small>
                              </Box>
                            </Box>
                          )}
                        </Dropzone>
                        <Box className="dropzone-previews mt-3" id="file-previews">
                          {nid && (
                            <Card
                              className="
                            mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete
                            "
                            >
                              <Box className="p-2">
                                <Row className="align-items-center position-relative">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      // height="80"
                                      style={{
                                        maxWidth: '80px',
                                      }}
                                      className=" bg-light"
                                      src={nid.preview ? nid.preview : nid}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link to="#" className="text-muted font-weight-bold">
                                      {nid.name ? nid.name : 'NID'}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{nid.formattedSize && nid.formattedSize}</strong>
                                    </p>
                                  </Col>

                                  <Box
                                    className="position-absolute"
                                    style={{
                                      left: '0px',
                                      top: '0px',
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: 'flex-end',
                                    }}
                                  >
                                    <i
                                      onClick={() => setNid(null)}
                                      className="mdi mdi-delete text-danger "
                                      style={{
                                        fontSize: '25px',
                                        cursor: 'pointer',
                                      }}
                                    ></i>
                                  </Box>
                                </Row>
                              </Box>
                            </Card>
                          )}
                        </Box>
                      </Box>
                    </Col>
                    <Col lg={6}>
                      <Label>Vehicle Document</Label>
                      <Box className="mb-5">
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, 'doc');
                          }}
                          accept=".jpg, .jpeg, .png"
                          maxSize={1000 * 1000}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box className="dropzone">
                              <Box className="dz-message needsclick" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Box className="mb-3">
                                  <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                </Box>
                                <h4>Drop files here or click to upload.</h4>
                                <small
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  * Max Image size allowed Id 1 Mb.
                                </small>
                              </Box>
                            </Box>
                          )}
                        </Dropzone>
                        <Box className="dropzone-previews mt-3" id="file-previews">
                          {vehicleDoc && (
                            <Card
                              className="
                            mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete
                            "
                            >
                              <Box className="p-2">
                                <Row className="align-items-center position-relative">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      // height="80"
                                      style={{
                                        maxWidth: '80px',
                                      }}
                                      className=" bg-light"
                                      src={vehicleDoc.preview ? vehicleDoc.preview : vehicleDoc}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link to="#" className="text-muted font-weight-bold">
                                      {vehicleDoc.name ? vehicleDoc.name : 'Vehicle Document'}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{vehicleDoc.formattedSize && vehicleDoc.formattedSize}</strong>
                                    </p>
                                  </Col>

                                  <Box
                                    className="position-absolute"
                                    style={{
                                      left: '0px',
                                      top: '0px',
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: 'flex-end',
                                    }}
                                  >
                                    <i
                                      onClick={() => setVehicleDoc(null)}
                                      className="mdi mdi-delete text-danger "
                                      style={{
                                        fontSize: '25px',
                                        cursor: 'pointer',
                                      }}
                                    ></i>
                                  </Box>
                                </Row>
                              </Box>
                            </Card>
                          )}
                        </Box>
                      </Box>
                    </Col>
                    <Col lg={6}>
                      <Label>Contract Paper</Label>
                      <Box className="mb-5">
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, 'contract');
                          }}
                          accept=".jpg, .jpeg, .png"
                          maxSize={1000 * 1000}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box className="dropzone">
                              <Box className="dz-message needsclick" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Box className="mb-3">
                                  <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                </Box>
                                <h4>Drop files here or click to upload.</h4>
                                <small
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  * Max Image size allowed Id 1 Mb.
                                </small>
                              </Box>
                            </Box>
                          )}
                        </Dropzone>
                        <Box className="dropzone-previews mt-3" id="file-previews">
                          {contractPaper && (
                            <Card
                              className="
                            mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete
                            "
                            >
                              <Box className="p-2">
                                <Row className="align-items-center position-relative">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      style={{
                                        maxWidth: '80px',
                                      }}
                                      className=" bg-light"
                                      src={contractPaper?.preview ? contractPaper.preview : contractPaper}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link to="#" className="text-muted font-weight-bold">
                                      {contractPaper?.name ? contractPaper.name : 'Contract Paper'}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{contractPaper?.formattedSize && contractPaper.formattedSize}</strong>
                                    </p>
                                  </Col>

                                  <Box
                                    className="position-absolute"
                                    style={{
                                      left: '0px',
                                      top: '0px',
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: 'flex-end',
                                    }}
                                  >
                                    <i
                                      onClick={() => setContractPaper(null)}
                                      className="mdi mdi-delete text-danger "
                                      style={{
                                        fontSize: '25px',
                                        cursor: 'pointer',
                                      }}
                                    ></i>
                                  </Box>
                                </Row>
                              </Box>
                            </Card>
                          )}
                        </Box>
                      </Box>
                    </Col>
                  </Row>
                  <Box className="my-5 d-flex justify-content-center">
                    <Button color="primary" className="px-5" type="submit" disabled={isLoading || loading}>
                      {loading || isLoading ? (
                        <Spinner animation="border" size="sm" variant="success"></Spinner>
                      ) : id ? (
                        'Save'
                      ) : (
                        'Add'
                      )}
                    </Button>
                  </Box>
                  {isEditMode && (
                    <Box className="my-5 d-flex justify-content-center">
                      <Button
                        color="primary"
                        className="px-5"
                        type="submit"
                        disabled={isLoading || loading || !isLoggedIn}
                        onClick={(e) => {
                          submitDeliveryman(e, false);
                        }}
                      >
                        {isLoggedIn ? 'Force Logout' : 'Not Logged In'}
                      </Button>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </Form>
          </Container>
        </Box>
      </GlobalWrapper>
    </Box>
  );
}

export default DeliverymanAdd;
