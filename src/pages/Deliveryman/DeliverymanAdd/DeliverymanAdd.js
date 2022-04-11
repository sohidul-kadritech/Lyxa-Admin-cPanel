import React, { useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import Switch from "react-switch";
import  Flatpickr  from "react-flatpickr";

const DeliverymanAdd = () => {
  const [country, setCountry] = useState(undefined);
  const [switch3, setswitch3] = useState(true);

  const optionGroup = [
    {
      label: "Picnic",
      options: [
        { label: "Mustard", value: "Mustard" },
        { label: "Ketchup", value: "Ketchup" },
        { label: "Relish", value: "Relish" },
      ],
    },
    {
      label: "Camping",
      options: [
        { label: "Tent", value: "Tent" },
        { label: "Flashlight", value: "Flashlight" },
        { label: "Toilet Paper", value: "Toilet Paper" },
      ],
    },
  ];

  const genders = [
    {
      label: "Gender",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Others", value: "others" },
      ],
    },

  ];

  return (
    <div>
      <React.Fragment>
        <GlobalWrapper>
          <div className="page-content">
            <Container fluid={true}>
              <Breadcrumb
                maintitle="Drop"
                breadcrumbItem={"Add"}
                title="Deliveryman"
                // loading={loading}
                // callList={callCarList}
                isRefresh={false}
              />

              <Card>
                <CardBody>
                  <form>
                    <Row className="pb-3 ">
                      <div className="mb-3">
                        <h5>Delivery Man Informations</h5>
                        <hr />
                      </div>
                      <Col lg={6}>
                        <div className="mb-4">
                          <Label>Name</Label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Shop Name"
                            required
                          />
                        </div>

                        <div className="mb-4">
                        <Label>Date of Birth</Label>
                          <Flatpickr
                            className="form-control d-block"
                            id="dateOfBirth"
                            placeholder="Select Date of Birth"
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
                        </div>

                        <div className="mb-4">
                          <Label>Country</Label>
                          <Select
                            value={country}
                            // onChange={() => {
                            //   handleSelectGroup()
                            // }}
                            palceholder="Select Country"
                            options={optionGroup}
                            classNamePrefix="select2-selection"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <Label>Region</Label>
                          <Select
                            // value={selectedGroup}
                            // onChange={() => {
                            //   handleSelectGroup()
                            // }}
                            palceholder="Select Region"
                            options={optionGroup}
                            classNamePrefix="select2-selection"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>City</Label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter City Name"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Pin Code</Label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter Pin Code"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Phone Number</Label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter Phone Number"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Address</Label>
                          <Input
                            type="textarea"
                            id="textarea"
                            // onChange={e => {
                            //   textareachange(e)
                            // }}
                            maxLength="225"
                            rows="3"
                            placeholder="Enter Shop Address"
                            requried
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-4">
                          <Label>Email</Label>
                          <input
                            className="form-control"
                            type="email"
                         
                            placeholder="Enter Email"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Password</Label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Password"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Gender</Label>
                          <Select
                            // value={country}
                            // onChange={() => {
                            //   handleSelectGroup()
                            // }}
                            palceholder="Select Gender"
                            options={genders}
                            classNamePrefix="select2-selection"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Vahicle Number</Label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter Vahicle Number"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Vahicle Type</Label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Vahicle Type"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Bank Name</Label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Bank Name"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Account Name</Label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Account Name"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Account Number</Label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter Account Number"
                            required
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col xl={6}>
                        <div className="d-flex justify-content-center flex-column">
                          <h6>Profile Photo</h6>
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
                          <h6>Vahicle Photo</h6>
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
                          <h6>Vehicle Registration Document</h6>
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
                          <h6>National id</h6>
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

                    <div className="my-5 d-flex justify-content-center">
                      <Button type="submit" color="primary" className="px-5">
                        {" "}
                        Add{" "}
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </GlobalWrapper>
      </React.Fragment>
    </div>
  );
};

export default DeliverymanAdd;
