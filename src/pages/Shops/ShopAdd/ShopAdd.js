import React, { useState } from "react";
import { Button, Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Select from "react-select";
import Switch from "react-switch";

const ShopAdd = () => {
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

  const Offsymbol = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: 12,
          color: "#fff",
          paddingRight: 2,
        }}
      ></div>
    );
  };

  const OnSymbol = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: 12,
          color: "#fff",
          paddingRight: 2,
        }}
      ></div>
    );
  };
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Add"}
              title="Shop"
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label>Seller</Label>
                      <Select
                        // value={selectedGroup}
                        // onChange={() => {
                        //   handleSelectGroup()
                        // }}
                        options={optionGroup}
                        classNamePrefix="select2-selection"
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <form>
                  <Row className="pb-3 ">
                    <div className="mb-3">
                      <h5>Shop Informations</h5>
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
                          type="text"
                          placeholder="Enter Pin Code"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="control-label">Tags</label>
                        <Select
                          // value={selectedMulti}
                          isMulti={true}
                          // onChange={() => {
                          //   handleMulti()
                          // }}
                          options={optionGroup}
                          classNamePrefix="select2-selection"
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
                        <Label>Minimum Order</Label>
                        <input
                          className="form-control"
                          type="number"
                          placeholder="Enter Minimum Order Amount"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label>Type</Label>
                        <Select
                          // value={country}
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
                        <Label>Expensive</Label>
                        <Select
                          // value={country}
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
                        <Label>Delivery Type</Label>
                        <Select
                          // value={country}
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
                        <Label>Opens At</Label>
                        <input
                          className="form-control"
                          type="time"
                          defaultValue="13:45:00"
                          id="example-time-input"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Close At</Label>
                        <input
                          className="form-control"
                          type="time"
                          defaultValue="13:45:00"
                          id="example-time-input"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Descriptions</Label>
                        <Input
                          type="textarea"
                          id="textarea"
                          // onChange={e => {
                          //   textareachange(e)
                          // }}
                          maxLength="350"
                          rows="3"
                          placeholder="Enter Descriptonons"
                          required
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col xl={6}>
                      <div className="d-flex justify-content-center flex-column">
                        <h6>Shop Logo</h6>
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
                        <h6>Shop Banner</h6>
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
                    <Col xs={6} className="d-flex justify-content-center">
                      <Label className="me-2">Featured</Label>
                      <Switch
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#02a499"
                        onChange={() => {
                          setswitch3(!switch3);
                        }}
                        checked={switch3}
                      />
                    </Col>
                    <Col xs={6} className="d-flex justify-content-center">
                      <Label className="me-2">Pickup</Label>
                      <Switch
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#02a499"
                        onChange={() => {
                          setswitch3(!switch3);
                        }}
                        checked={switch3}
                      />
                    </Col>
                  </Row>

                  <div className="my-5 d-flex justify-content-center">
                    <Button type="submit" color="primary" className="px-5"> Add </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default ShopAdd;
