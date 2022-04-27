import React, { useState, useEffect } from "react";
import GlobalWrapper from "./../../../components/GlobalWrapper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Label,
  Form,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Flatpickr from "react-flatpickr";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addSeller, editSeller } from "../../../store/Seller/sellerAction";
import { useParams,useHistory } from "react-router-dom";

const SellerAdd = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const { loading, status, sellers } = useSelector(
    (state) => state.sellerReducer
  );

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNum, setAccountNum] = useState("");

  useEffect(() => {
    if (id) {
      const findSeller = sellers.find((item) => item._id == id);
      console.log({ findSeller });
      if (findSeller) {
        const {
          account_name,
          account_number,
          bank_name,
          company_name,
          dob,
          email,
          gender,
          name,
          phone_number,
        } = findSeller;

        setName(name);
        setGender(gender);
        setEmail(email);
        setPassword(password);
        setDateOfBirth(dob);
        setCompanyName(company_name);
        setPhoneNum(phone_number);
        // setAddress("");
        setBankName(bank_name);
        setAccountName(account_name);
        setAccountNum(account_number);
      } else {
        console.log("call api---");
      }
    }
  }, [id]);

  // SUBMIT SELLER

  const submitSeller = () => {
    if (
      !name ||
      !gender ||
      !email ||
      (!id && !password) ||
      !dateOfBirth ||
      !companyName ||
      !phoneNum ||
      !bankName ||
      !accountName ||
      !accountNum ||
      (!id && !address)
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

    submitDate();
  };

  const submitDate = () => {
    if (id) {
      dispatch(
        editSeller({
          id,
          name,
          gender,
          phone_number: phoneNum,
          company_name: companyName,
          email,
          profile_photo:
            "https://miro.medium.com/max/1187/1*0FqDC0_r1f5xFz3IywLYRA.jpeg",
          dob: dateOfBirth,
          account_type: "seller",
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNum,
          certificate_of_incorporation:
            "https://miro.medium.com/max/1187/1*0FqDC0_r1f5xFz3IywLYRA.jpeg",
          national_id:
            "https://miro.medium.com/max/1187/1*0FqDC0_r1f5xFz3IywLYRA.jpeg",
        })
      );
    } else {
      dispatch(
        addSeller({
          name,
          gender,
          phone_number: phoneNum,
          company_name: companyName,
          email,
          password,
          profile_photo:
            "https://miro.medium.com/max/1187/1*0FqDC0_r1f5xFz3IywLYRA.jpeg",
          dob: dateOfBirth,
          account_type: "seller",
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNum,
          certificate_of_incorporation:
            "https://miro.medium.com/max/1187/1*0FqDC0_r1f5xFz3IywLYRA.jpeg",
          national_id:
            "https://miro.medium.com/max/1187/1*0FqDC0_r1f5xFz3IywLYRA.jpeg",
        })
      );
    }
  };

  useEffect(() => {
    if (status) {
      if (id) {
        history.push("/seller/list");
      } else {
        setName("");
        setGender("");
        setEmail("");
        setPassword("");
        setDateOfBirth("");
        setCompanyName("");
        setPhoneNum("");
        setAddress("");
        setBankName("");
        setAccountName("");
        setAccountNum("");
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
              breadcrumbItem={id ? "Edit" : "Add"}
              title="Seller"
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <div className="py-3">
                  <h5>Seller Informations</h5>
                  <hr />
                </div>
                <Row>
                  <Col xl={6}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      placeholder="Enter Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      placeholder="Enter a Email Id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Col>
                </Row>

                {!id && (
                  <Row className="mt-4">
                    <Col xl={6}>
                      <TextField
                        id="outlined-textarea"
                        label="Address"
                        placeholder="Enter Address"
                        multiline
                        style={{ width: "100%" }}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </Col>
                    <Col xl={6} className="mt-4 mt-xl-0">
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        placeholder="Enter a Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Col>
                  </Row>
                )}

                <Row className="mt-4">
                  <Col xl={6}>
                    <DatePickerWrapper className="form-group mb-0">
                      <Flatpickr
                        className="form-control d-block"
                        id="dateOfBirth"
                        placeholder="Select  Date of Birth"
                        value={dateOfBirth}
                        onChange={(selectedDates, dateStr, instance) =>
                          setDateOfBirth(dateStr)
                        }
                        options={{
                          altInput: true,
                          altFormat: "F j, Y",
                          dateFormat: "Y-m-d",
                        }}
                      />
                    </DatePickerWrapper>
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Company Name"
                      variant="outlined"
                      placeholder="Enter Companay Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <TextField
                      id="outlined-textarea"
                      label="Phone Number"
                      placeholder="Enter Phone Number"
                      style={{ width: "100%" }}
                      type="number"
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value.toString())}
                      required
                    />
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Bank Name"
                      variant="outlined"
                      placeholder="Enter Bank Name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Account Name"
                      variant="outlined"
                      placeholder="Enter Account Name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      required
                    />
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Account Number"
                      variant="outlined"
                      placeholder="Enter Account Number"
                      value={accountNum}
                      onChange={(e) => setAccountNum(e.target.value)}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Gender
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={gender}
                        label="Gender"
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        <MenuItem value="male">Mele </MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <Label>Profile Photo</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            // handleAcceptedFiles(acceptedFiles);
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick"
                                {...getRootProps()}
                                // onClick={() => setmodal_fullscreen(true)}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-3">
                                  <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                </div>
                                <h4>Drop files here or click to upload.</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
                          {/* {selectedFiles.map((f, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center position-relative">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      // height="80"
                                      style={{
                                        maxWidth: "80px",
                                      }}
                                      className=" bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>

                                  <div
                                    className="position-absolute"
                                    style={{
                                      left: "0px",
                                      top: "0px",
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <i
                                      // onClick={() => removeSelection(i)}
                                      className="mdi mdi-delete text-danger "
                                      style={{
                                        fontSize: "25px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  </div>
                                </Row>
                              </div>
                            </Card>
                          );
                        })} */}
                        </div>
                      </Form>
                    </div>
                  </Col>
                  <Col xl={6}>
                    <Label>Certificate Of Incorporation</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            // handleAcceptedFiles(acceptedFiles);
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick"
                                {...getRootProps()}
                                // onClick={() => setmodal_fullscreen(true)}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-3">
                                  <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                </div>
                                <h4>Drop files here or click to upload.</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
                          {/* {selectedFiles.map((f, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center position-relative">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      // height="80"
                                      style={{
                                        maxWidth: "80px",
                                      }}
                                      className=" bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>

                                  <div
                                    className="position-absolute"
                                    style={{
                                      left: "0px",
                                      top: "0px",
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <i
                                      // onClick={() => removeSelection(i)}
                                      className="mdi mdi-delete text-danger "
                                      style={{
                                        fontSize: "25px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  </div>
                                </Row>
                              </div>
                            </Card>
                          );
                        })} */}
                        </div>
                      </Form>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <Label>National ID</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            // handleAcceptedFiles(acceptedFiles);
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick"
                                {...getRootProps()}
                                // onClick={() => setmodal_fullscreen(true)}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-3">
                                  <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                </div>
                                <h4>Drop files here or click to upload.</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
                          {/* {selectedFiles.map((f, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center position-relative">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      // height="80"
                                      style={{
                                        maxWidth: "80px",
                                      }}
                                      className=" bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>

                                  <div
                                    className="position-absolute"
                                    style={{
                                      left: "0px",
                                      top: "0px",
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <i
                                      // onClick={() => removeSelection(i)}
                                      className="mdi mdi-delete text-danger "
                                      style={{
                                        fontSize: "25px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  </div>
                                </Row>
                              </div>
                            </Card>
                          );
                        })} */}
                        </div>
                      </Form>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    color="primary"
                    onClick={submitSeller}
                    className="px-5"
                  >
                    {loading ? (
                      <Spinner
                        animation="border"
                        variant="info"
                        size="sm"
                      ></Spinner>
                    ) : id ? (
                      "Edit"
                    ) : (
                      "Add"
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

const DatePickerWrapper = styled.div`
  input {
    padding: 17px 10px !important;
  }
`;

const ImageView = styled.div`
  width: 100% !important;
  max-width: 300px;
  position: relative;
  width: 100%;
  .img_view {
    opacity: 1;
    transition: 0.5s ease;
    backface-visibility: hidden;
  }
  .button__wrapper {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;
    .remove__btn {
      background-color: yellow;
      font-size: 18px;
      color: red;
    }
  }
  &:hover {
    .img_view {
      opacity: 0.3;
    }
    .button__wrapper {
      opacity: 1;
    }
  }
`;

export default SellerAdd;
