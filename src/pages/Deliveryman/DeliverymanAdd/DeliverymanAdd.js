import React, { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import { activeOptions } from "../../../assets/staticData";
import requestApi from "../../../network/httpRequest";
import { SINGLE_DELIVERY_MAN } from "../../../network/Api";
import {useHistory} from "react-router-dom"

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

  // ID FROM PARAMS

  useEffect(() => {
    if (id) {
      const findDeliveryMan = deliveryMans.find((man) => man._id == id);
      if (findDeliveryMan) {
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

  const submitDeliveryman = () => {
    if (
      !name ||
      (!id && (!password || !address || !pin)) ||
      !email ||
      !number
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

    submitData();
  };

  // FATCH DATA

  const submitData = () => {
    if (id) {
      dispatch(
        editDeliveryMan({
          name,
          email,
          number,
          status: activeStatus,
        })
      );
    } else {
      dispatch(
        addDeliveryMan({
          name,
          email,
          password,
          number,
          deliveryBoyAddress: {
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
        window.scrollTo(0,0)
      }
    }
  }, [status]);

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
                    </Col>
                  </Row>

                  <div className="my-5 d-flex justify-content-center">
                    <Button
                      color="primary"
                      className="px-5"
                      onClick={submitDeliveryman}
                      disabled={loading}
                    >
                      {loading ? (
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
