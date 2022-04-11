import React from "react";
import GlobalWrapper from "./../../../components/GlobalWrapper";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Flatpickr from "react-flatpickr";
import styled from "styled-components";

const SellerAdd = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Add"}
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
                    />
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Gender
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Gender"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Men </MenuItem>
                        <MenuItem value={20}>Woman</MenuItem>
                        <MenuItem value={30}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <DatePickerWrapper className="form-group mb-0">
                      <Flatpickr
                        className="form-control d-block"
                        id="dateOfBirth"
                        placeholder="Select  Date of Birth"
                        // value={dateOfBirth}
                        // onChange={(selectedDates, dateStr, instance) =>
                        //   setDateOfBirth(dateStr)
                        // }
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
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Gender"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Pharmacy </MenuItem>
                        <MenuItem value={20}>Grocery</MenuItem>
                        <MenuItem value={30}>Resturant</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Tags
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Gender"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Tags 1 </MenuItem>
                        <MenuItem value={20}>Tags 2</MenuItem>
                        <MenuItem value={30}>Tags 3</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Delivery Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Gender"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Self </MenuItem>
                        <MenuItem value={20}>Drop</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      placeholder="Enter a Email Id"
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Password"
                      variant="outlined"
                      placeholder="Enter a Password"
                    />
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <TextField
                      id="outlined-textarea"
                      label="Address"
                      placeholder="Enter Address"
                      multiline
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Bank Name"
                      variant="outlined"
                      placeholder="Enter Bank Name"
                    />
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Account Number"
                      variant="outlined"
                      placeholder="Enter Account Number"
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <div className="d-flex justify-content-center flex-column">
                      <h6>Upload Seller Image</h6>
                      <Card className="cursor-pointer">
                        <div
                          className="d-flex justify-content-center align-content-center"
                          style={{
                            border: "1px solid rgb(207 207 207)",
                            height: "145px",
                          }}
                        >
                          {/* {licenseFrontImage ? (
                                <ImageView>
                                  <>
                                    <img
                                      // src={licenseFrontImage}
                                      className="img-thumbnail img__view"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                      }}
                                      alt=""
                                    />
                                    <div className="button__wrapper">
                                      <button
                                        className="btn btn-danger "
                                        // onClick={() => handleDelete(item.id)}
                                        // onClick={() => setLicenseFrontImage("")}
                                      >
                                        <i className="fa fa-trash" />
                                      </button>
                                    </div>
                                  </>
                                </ImageView>
                              ) : (
                                <div
                                  style={{ width: "100%", height: "100%" }}
                                  className="d-flex justify-content-center align-items-center"
                                  // onClick={() => handleImage(4)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ width: "50px" }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeWidth="2" d="M12 4v16m8-8H4" />
                                  </svg>
                                </div>
                              )} */}
                          <div
                            style={{ width: "100%", height: "100%" }}
                            className="d-flex justify-content-center align-items-center"
                            // onClick={() => handleImage(4)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ width: "50px" }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Col>
                  <Col xl={6}>
                    <div className="d-flex justify-content-center flex-column">
                      <h6>Upload Certification Of Incorporation</h6>
                      <Card className="cursor-pointer">
                        <div
                          className="d-flex justify-content-center align-content-center"
                          style={{
                            border: "1px solid rgb(207 207 207)",
                            height: "145px",
                          }}
                        >
                          {/* {licenseFrontImage ? (
                                <ImageView>
                                  <>
                                    <img
                                      // src={licenseFrontImage}
                                      className="img-thumbnail img__view"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                      }}
                                      alt=""
                                    />
                                    <div className="button__wrapper">
                                      <button
                                        className="btn btn-danger "
                                        // onClick={() => handleDelete(item.id)}
                                        // onClick={() => setLicenseFrontImage("")}
                                      >
                                        <i className="fa fa-trash" />
                                      </button>
                                    </div>
                                  </>
                                </ImageView>
                              ) : (
                                <div
                                  style={{ width: "100%", height: "100%" }}
                                  className="d-flex justify-content-center align-items-center"
                                  // onClick={() => handleImage(4)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ width: "50px" }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeWidth="2" d="M12 4v16m8-8H4" />
                                  </svg>
                                </div>
                              )} */}
                          <div
                            style={{ width: "100%", height: "100%" }}
                            className="d-flex justify-content-center align-items-center"
                            // onClick={() => handleImage(4)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ width: "50px" }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <div className="d-flex justify-content-center flex-column">
                      <h6>Upload National ID</h6>
                      <Card className="cursor-pointer">
                        <div
                          className="d-flex justify-content-center align-content-center"
                          style={{
                            border: "1px solid rgb(207 207 207)",
                            height: "145px",
                          }}
                        >
                          {/* {licenseFrontImage ? (
                                <ImageView>
                                  <>
                                    <img
                                      // src={licenseFrontImage}
                                      className="img-thumbnail img__view"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                      }}
                                      alt=""
                                    />
                                    <div className="button__wrapper">
                                      <button
                                        className="btn btn-danger "
                                        // onClick={() => handleDelete(item.id)}
                                        // onClick={() => setLicenseFrontImage("")}
                                      >
                                        <i className="fa fa-trash" />
                                      </button>
                                    </div>
                                  </>
                                </ImageView>
                              ) : (
                                <div
                                  style={{ width: "100%", height: "100%" }}
                                  className="d-flex justify-content-center align-items-center"
                                  // onClick={() => handleImage(4)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ width: "50px" }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeWidth="2" d="M12 4v16m8-8H4" />
                                  </svg>
                                </div>
                              )} */}
                          <div
                            style={{ width: "100%", height: "100%" }}
                            className="d-flex justify-content-center align-items-center"
                            // onClick={() => handleImage(4)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ width: "50px" }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-center">
                  <Button color="primary" className="px-5">
                    Add
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
