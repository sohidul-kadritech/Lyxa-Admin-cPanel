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

const DeliverymanAdd = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const { loading, deliveryMans, status } = useSelector(
    (state) => state.deliveryManReducer
  );

  const [selectedAddress, setSelectedAddress] = useState("");
  const [address, setAddress] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [pin, setPin] = useState("");
  const [latLng, setLatLng] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNum, setVehicleNum] = useState("");
  const [nid, setNid] = useState("");
  const [vehicleDoc, setVehicleDoc] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  // ID FROM PARAMS

  useEffect(() => {
    if (id) {
      const findDeliveryMan = deliveryMans.find((man) => man._id == id);
      if (findDeliveryMan) {
        console.log({findDeliveryMan})
        updateData(findDeliveryMan);
        // handleAddressSelect()
      } else {
        callApi(id);
      }
    }
  }, [id]);

  const callApi = async (manId) => {
    try {
      const {
        data: { status, error, data = null },
      } = await requestApi().request(SINGLE_DELIVERY_MAN, {
        params: {
          id: manId,
        },
      });
      if (status) {
        console.log(data.delivery)
        updateData(data.delivery);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE DATA

  const updateData = ({ name, email, number, status }) => {
    const findStatus = activeOptions.find((option) => option.value === status);

    setName(name);
    setEmail(email);
    setNumber(number);
    setActiveStatus(findStatus);
    setPin(pin);
  };

  // ADDRESS CHANGE

  const handleAddressChange = (address) => {
    // console.log("address", address);
    setSelectedAddress(address);
  };

  const handleAddressSelect = (address, placeId) => {
    setSelectedAddress(address);
    geocodeByAddress(address);
    geocodeByPlaceId(placeId)
      .then((results) => setAddress(results[0]))
      .catch((error) => console.error("Error", error));
  };

  // ADDRESS

  useEffect(() => {
    if (address) {
      const {
        geometry: { location },
        address_components,
        formatted_address,
      } = address;
      getLatLng(address).then((latlng) => setLatLng(latlng));
      setFullAddress(formatted_address);

      address_components.forEach((address_component) => {
        if (address_component.types.includes("country")) {
          setCountry(address_component.long_name);
        } else if (address_component.types.includes("locality")) {
          setCity(address_component.long_name);
        } else if (address_component.types.includes("sublocality")) {
          setState(address_component.long_name);
        }
      });
    }
  }, [address]);

  // VALIDATIONS

  const submitDeliveryman = () => {
    if (
      !name ||
      (!id && (!password || !address || !pin)) ||
      !email ||
      !number ||
      !vehicleType ||
      !vehicleNum ||
      !nid ||
      !vehicleDoc
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

    let re = /\S+@\S+\.\S+/;
    const isValid = re.test(email);

    if (!isValid) {
      return toast.warn("Please Enter Valid Email Address", {
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

    uploadImages();
  };

  const uploadImages = async () => {
    let nidUrl = null;
    let docUrl = null;
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


    if (nidUrl && docUrl) {
      setIsLoading(false);
      submitData(nidUrl, docUrl);
    }
  };

  //  UPLAOD IMAGE TO SERVER

  const imageUploadToServer = async (image) => {
    try {
      let formData = new FormData();
      formData.append("image", image);
      // console.log({formData})
      const { data } = await requestApi().request(IMAGE_UPLOAD, {
        method: "POST",
        data: formData,
      });
      // console.log("image upload", data)
      if (data.status) {
        // submitData(data.data.url);
        return data.data.url;
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // SUBMIT DATA

  const submitData = (nidUrl, docUrl) => {
    if (id) {
      dispatch(
        editDeliveryMan({
          id,
          name,
          email,
          number,
          status: activeStatus.value,
          vehicleType: vehicleType.value,
          vehicle_number: vehicleNum,
          national_id: nidUrl,
          vehicle_data: docUrl
        })
      );
    } else {
      dispatch(
        addDeliveryMan({
          name,
          email,
          password,
          number,
          address: {
            address: fullAddress,
            latitude: latLng.lat,
            longitude: latLng.lng,
            city,
            state,
            country,
            placeId: address?.place_id,
            pin,
            primary: true,
            note: "",
          },
          vehicleType: vehicleType.value,
          vehicle_number: vehicleNum,
          national_id: nidUrl,
          vehicle_data: docUrl
        })
      );
    }
  };

  useEffect(() => {
    if (status) {
      if (id) {
        history.goBack();
      } else {
        setName("");
        setEmail("");
        setPassword("");
        setNumber("");
        setPin("");
        setActiveStatus("");
        setAddress(null);
        setVehicleType("");
        setVehicleNum("");
        setNid(null);
        setVehicleDoc(null);
        setSelectedAddress("");
        window.scrollTo(0, 0);
      }
    }
  }, [status]);

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

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
                maintitle="Drop"
                breadcrumbItem={id ? "Edit" : "Add"}
                title="Deliveryman"
                // loading={loading}
                // callList={callCarList}
                isRefresh={false}
              />

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
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Phone Number</Label>
                        <input
                          className="form-control"
                          type="number"
                          placeholder="Enter Phone Number"
                          required
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                        />
                      </div>
                      {!id && (
                        <div className="mb-4">
                          <Label>Pin Code</Label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter Pin Code"
                            required
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="control-label">Vehicle Type</label>
                        <Select
                          palceholder="Select Status"
                          options={DeliveryBoyVehicleOPtions}
                          classNamePrefix="select2-selection"
                          required
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e)}
                          defaultValue={""}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      {id ? (
                        <div className="mb-4">
                          <label className="control-label">Status</label>
                          <Select
                            palceholder="Select Status"
                            options={activeOptions}
                            classNamePrefix="select2-selection"
                            required
                            value={activeStatus}
                            onChange={(e) => setActiveStatus(e)}
                            defaultValue={""}
                          />
                        </div>
                      ) : (
                        <div className="mb-4">
                          <Label>Password</Label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      )}
                      {!id && (
                        <div className="mb-4">
                          <Label>Address</Label>
                          <PlacesAutocomplete
                            value={selectedAddress}
                            onChange={handleAddressChange}
                            onSelect={handleAddressSelect}
                            onError={(error) => {
                              console.log(error);
                            }}
                            clearItemsOnError={true}
                            shouldFetchSuggestions={selectedAddress.length > 3}
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
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style,
                                        })}
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
                          </PlacesAutocomplete>
                        </div>
                      )}
                      <div className="mb-4">
                        <Label>Vehicle Number</Label>
                        <input
                          className="form-control"
                          type="email"
                          placeholder="Enter Email"
                          value={vehicleNum}
                          onChange={(e) => setVehicleNum(e.target.value)}
                          required
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6}>
                      <Label> National ID</Label>
                      <div className="mb-5">
                        <Form>
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles, "nid");
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
                        </Form>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Label>Vehicle Document</Label>
                      <div className="mb-5">
                        <Form>
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles, "doc");
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
                        </Form>
                      </div>
                    </Col>
                  </Row>

                  <div className="my-5 d-flex justify-content-center">
                    <Button
                      color="primary"
                      className="px-5"
                      onClick={submitDeliveryman}
                      disabled={isLoading || loading}
                    >
                      {loading || isLoading ? (
                        <Spinner
                          animation="border"
                          size="sm"
                          variant="success"
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
    </div>
  );
};

export default DeliverymanAdd;
