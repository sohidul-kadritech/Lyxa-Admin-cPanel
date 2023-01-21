import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import Select from "react-select";
import Switch from "react-switch";
import Flatpickr from "react-flatpickr";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import { toast } from "react-toastify";
import {
  addDeliveryMan,
  editDeliveryMan,
} from "../../../store/DeliveryMan/DeliveryManAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  activeOptions,
  DeliveryBoyVehicleOPtions,
} from "../../../assets/staticData";
import requestApi from "../../../network/httpRequest";
import { IMAGE_UPLOAD, SINGLE_DELIVERY_MAN } from "../../../network/Api";
import { useHistory } from "react-router-dom";
import Dropzone from "react-dropzone";
import formatBytes from "../../../common/imageFormatBytes";
import { callApi } from "../../../components/SingleApiCall";
import { successMsg } from "../../../helpers/successMsg";

const DeliverymanAdd = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const { loading, deliveryMans, status } = useSelector(
    (state) => state.deliveryManReducer
  );

  const [deliveryBoyAddress, setDeliveryBoyAddress] = useState("");
  const [address, setAddress] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  // const [latLng, setLatLng] = useState(null);
  // const [fullAddress, setFullAddress] = useState("");
  // const [country, setCountry] = useState("");
  // const [state, setState] = useState("");
  // const [city, setCity] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNum, setVehicleNum] = useState("");
  const [nid, setNid] = useState("");
  const [vehicleDoc, setVehicleDoc] = useState("");
  const [contractPaper, setContractPaper] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ID FROM PARAMSnumber

  useEffect(async () => {
    if (id) {
      const findDeliveryMan = deliveryMans.find((man) => man._id == id);
      if (findDeliveryMan) {
        updateData(findDeliveryMan);
      } else {
        const data = await callApi(id, SINGLE_DELIVERY_MAN, "delivery");
        if (data) {
          updateData(data);
        } else {
          history.push("/deliveryman/list", { replace: true });
        }
      }
    }
  }, [id]);

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
    } = data;
    const findStatus = activeOptions.find((option) => option.value === status);
    const findVahicleType = DeliveryBoyVehicleOPtions.find(
      (option) => option.value === vehicleType
    );
    setName(name);
    setEmail(email);
    setPhone(number);
    setActiveStatus(findStatus);
    setNid(nationalIdDocument);
    setVehicleDoc(vehicleRegistrationDocument);
    setVehicleType(findVahicleType);
    setVehicleNum(vehicleNumber);
    setContractPaper(contractImage);
  };

  // ADDRESS

  // useEffect(() => {
  //   if (address) {
  //     const {
  //       geometry: { location },
  //       address_components,
  //       formatted_address,
  //     } = address;
  //     getLatLng(address).then((latlng) => setLatLng(latlng));
  //     setFullAddress(formatted_address);

  //     address_components.forEach((address_component) => {
  //       if (address_component.types.includes("country")) {
  //         setCountry(address_component.long_name);
  //       } else if (address_component.types.includes("locality")) {
  //         setCity(address_component.long_name);
  //       } else if (address_component.types.includes("sublocality")) {
  //         setState(address_component.long_name);
  //       }
  //     });
  //   }
  // }, [address]);

  // VALIDATIONS

  const submitDeliveryman = (e) => {
    e.preventDefault();
    if (!vehicleType) {
      return successMsg("select Vahicle Type");
    }

    if (!nid || !vehicleDoc) {
      return successMsg("select Images");
    }

    let re = /\S+@\S+\.\S+/;
    const isValid = re.test(email);

    if (!isValid) {
      return successMsg("Invalid Email");
    }

    uploadImages();
  };

  const uploadImages = async () => {
    let nidUrl = null;
    let docUrl = null;
    let contractUrl = null;
    setIsLoading(true);
    if (nid) {
      if (typeof nid === "string") {
        nidUrl = nid;
      } else {
        nidUrl = await imageUploadToServer(nid);
      }
    }
    if (vehicleDoc) {
      if (typeof vehicleDoc === "string") {
        docUrl = vehicleDoc;
      } else {
        docUrl = await imageUploadToServer(vehicleDoc);
      }
    }
    if (contractPaper) {
      if (typeof contractPaper === "string") {
        contractUrl = contractPaper;
      } else {
        contractUrl = await imageUploadToServer(contractPaper);
      }
    }

    if (nidUrl && docUrl && contractUrl) {
      setIsLoading(false);
      submitData(nidUrl, docUrl, contractUrl);
    }
  };

  //  UPLAOD IMAGE TO SERVER

  const imageUploadToServer = async (image) => {
    try {
      let formData = new FormData();
      formData.append("image", image);

      const { data } = await requestApi().request(IMAGE_UPLOAD, {
        method: "POST",
        data: formData,
      });

      if (data.status) {
        return data.data.url;
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // SUBMIT DATA

  const submitData = (nidUrl, docUrl, contractUrl) => {
    const data = {
      name,
      email,
      password,
      number: phone,
      vehicleType: vehicleType.value,
      vehicleNumber: vehicleNum,
      nationalIdDocument: nidUrl,
      vehicleRegistrationDocument: docUrl,
      contractImage: contractUrl,
    };

    if (id) {
      dispatch(
        editDeliveryMan({
          ...data,
          id,
          status: activeStatus?.value,
        })
      );
    } else {
      dispatch(
        addDeliveryMan({
          ...data,
          deliveryBoyAddress,
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
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setPin("");
        setActiveStatus("");
        setAddress(null);
        setVehicleType("");
        setVehicleNum("");
        setNid(null);
        setVehicleDoc(null);
        setContractPaper(null);
        setDeliveryBoyAddress("");
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
      })
    );

    if (type === "nid") {
      setNid(files[0]);
    } else if (type === "contract") {
      setContractPaper(files[0]);
    } else {
      setVehicleDoc(files[0]);
    }
  };

  return (
    <div>
      <React.Fragment>
        <GlobalWrapper>
          <div className="page-content">
            <Container fluid={true}>
              <Breadcrumb
                maintitle="Lyxa"
                breadcrumbItem={id ? "Edit" : "Add"}
                title="Deliveryman"
                // loading={loading}
                // callList={callCarList}
                isRefresh={false}
              />
              <Form onSubmit={submitDeliveryman}>
                <Card>
                  <CardBody>
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
                            placeholder="Enter  Name"
                            name="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>

                        <div className="mb-4">
                          <Label>Phone</Label>
                          <input
                            className="form-control"
                            name="phone"
                            type="phone"
                            placeholder="Enter Phone number"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="control-label">Vehicle Type</label>
                          <Select
                            palceholder="Select Vahicle Type"
                            options={DeliveryBoyVehicleOPtions}
                            classNamePrefix="select2-selection"
                            name="vahicaleType"
                            required
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e)}
                            defaultValue={""}
                          />
                        </div>

                        <div className="mb-4">
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
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-4">
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
                        </div>

                        <div className="mb-4">
                          <Label>{id ? "New Password" : "Password"}</Label>
                          <input
                            className="form-control"
                            type="text"
                            name="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!id}
                          />
                        </div>

                        {!id ? (
                          <div className="mb-4">
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
                          </div>
                        ) : (
                          <div className="mb-4">
                            <label className="control-label">Status</label>
                            <Select
                              palceholder="Select Status"
                              name="status"
                              options={activeOptions}
                              classNamePrefix="select2-selection"
                              required
                              value={activeStatus}
                              onChange={(e) => setActiveStatus(e)}
                              defaultValue={""}
                            />
                          </div>
                        )}

                        {!id && (
                          <div className="mb-4">
                            <Label>Address</Label>
                            {/* <PlacesAutocomplete
                              value={selectedAddress}
                              onChange={handleAddressChange}
                              onSelect={handleAddressSelect}
                              onError={(error) => {
                                console.log(error);
                              }}
                              clearItemsOnError={true}
                              shouldFetchSuggestions={
                                selectedAddress.length > 3
                              }
                            >
                              {({
                                getInputProps,
                                suggestions,
                                getSuggestionItemProps,
                                loading,
                              }) => (
                                <div>
                                  <input
                                    {...getInputProps({
                                      placeholder: "Search Places ...",
                                      className: "location-search-input",
                                      //
                                    })}
                                    type="text"
                                    name="address"
                                    required
                                    id="outlined-required"
                                    label="Address"
                                    className="form-control"
                                    value={selectedAddress}
                                  />
                                  <div
                                    className="autocomplete-dropdown-container"
                                    style={{
                                      fontSize: "14px",
                                      fontFamily: "emoji",
                                      color: "black",
                                    }}
                                  >
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion, index) => {
                                      const className = suggestion.active
                                        ? "suggestion-item--active"
                                        : "suggestion-item";

                                      // inline style for demonstration purpose
                                      const style = suggestion.active
                                        ? {
                                          backgroundColor: "#fafafa",
                                          cursor: "pointer",
                                        }
                                        : {
                                          backgroundColor: "#ffffff",
                                          cursor: "pointer",
                                        };
                                      return (
                                        <div
                                          // style={{padding: "20px 0px !important"}}
                                          {...getSuggestionItemProps(
                                            suggestion,
                                            {
                                              className,
                                              style,
                                            }
                                          )}
                                          key={index}
                                        >
                                          <i
                                            className="ti-location-pin me-1"
                                            style={{ color: "black" }}
                                          />
                                          <span>{suggestion.description}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </PlacesAutocomplete> */}
                            <textarea
                              className="form-control"
                              name="phone"
                              type="text"
                              placeholder="Enter Address"
                              required
                              multiple
                              rows="4"
                              value={deliveryBoyAddress}
                              onChange={(e) =>
                                setDeliveryBoyAddress(e.target.value)
                              }
                            />
                          </div>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={6}>
                        <Label> National ID</Label>
                        <div className="mb-5">
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles, "nid");
                            }}
                            accept=".jpg, .jpeg, .png"
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
                            {nid && (
                              <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
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
                                        src={nid.preview ? nid.preview : nid}
                                        alt=""
                                      />
                                    </Col>
                                    <Col>
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {nid.name ? nid.name : "NID"}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>
                                          {nid.formattedSize &&
                                            nid.formattedSize}
                                        </strong>
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
                                        onClick={() => setNid(null)}
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
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <Label>Vehicle Document</Label>
                        <div className="mb-5">
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles, "doc");
                            }}
                            accept=".jpg, .jpeg, .png"
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
                            {vehicleDoc && (
                              <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
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
                                        src={
                                          vehicleDoc.preview
                                            ? vehicleDoc.preview
                                            : vehicleDoc
                                        }
                                        alt=""
                                      />
                                    </Col>
                                    <Col>
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {vehicleDoc.name
                                          ? vehicleDoc.name
                                          : "Vehicle Document"}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>
                                          {vehicleDoc.formattedSize &&
                                            vehicleDoc.formattedSize}
                                        </strong>
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
                                        onClick={() => setVehicleDoc(null)}
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
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={6}>
                        <Label>Contract Paper</Label>
                        <div className="mb-5">
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles, "contract");
                            }}
                            accept=".jpg, .jpeg, .png"
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone">
                                <div
                                  className="dz-message needsclick"
                                  {...getRootProps()}
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
                            {contractPaper && (
                              <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
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
                                        src={
                                          contractPaper?.preview
                                            ? contractPaper.preview
                                            : contractPaper
                                        }
                                        alt=""
                                      />
                                    </Col>
                                    <Col>
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {contractPaper?.name
                                          ? contractPaper.name
                                          : "Contract Paper"}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>
                                          {contractPaper?.formattedSize &&
                                            contractPaper.formattedSize}
                                        </strong>
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
                                        onClick={() => setContractPaper(null)}
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
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="my-5 d-flex justify-content-center">
                      <Button
                        color="primary"
                        className="px-5"
                        type="submit"
                        disabled={isLoading || loading}
                      >
                        {loading || isLoading ? (
                          <Spinner
                            animation="border"
                            size="sm"
                            variant="success"
                          ></Spinner>
                        ) : id ? (
                          "Save"
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Form>
            </Container>
          </div>
        </GlobalWrapper>
      </React.Fragment>
    </div>
  );
};

export default DeliverymanAdd;
