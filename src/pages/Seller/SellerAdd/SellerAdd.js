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
import { useParams, useHistory, Link } from "react-router-dom";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import requestApi from "../../../network/httpRequest";
import { IMAGE_UPLOAD } from "../../../network/Api";

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
  const [address, setAddress] = useState(null);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [pin, setPin] = useState("");
  const [sellerStatus, setSellerStatus] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [subType, setSubType] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [latLng, setLatLng] = useState({});
  const [fullAddress, setFullAddress] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [certificate, setCertificate] = useState("");
  const [nid, setNid] = useState("");
  const [contactPaper, setContactPaper] = useState("");

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

    if (type == "profile") {
      setProfilePhoto(files[0]);
    } else if (type == "certificate") {
      setCertificate(files[0]);
    } else if (type == "nid") {
      setNid(files[0]);
    } else {
      setContactPaper(files[0]);
    }
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

  // GET LAT LNG

  useEffect(() => {
    if (address) {
      getLatLng(address).then((latlng) => setLatLng(latlng));
      const {
        geometry: { location },
        formatted_address,
        address_components,
        place_id,
      } = address;
      // console.log("placeId",place_id)
      setFullAddress(formatted_address);
      // setPickupPlaceId(place_id);
    }
  }, [address]);

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
      !sellerType ||
      !sellerStatus ||
      ((sellerType == "food" || sellerType == "grocery") && !subType)
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

    if (!id && !address) {
      return toast.warn("Please Select a Address", {
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

    if (!profilePhoto || !certificate || !nid || !contactPaper) {
      return toast.warn("Please Select Images", {
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

    //  submitDate();

    uploadImage();
  };

  // Upload Image
  const uploadImage = async () => {
    if (
      typeof profilePhoto == "string" ||
      typeof certificate == "string" ||
      typeof nid == "string" ||
      typeof contactPaper == "string"
    ) {
      submitData(profilePhoto, certificate, nid, contactPaper);
    } else {
      let profileUrl = null;
      let certificateUrl = null;
      let nidUrl = null;
      let contactUrl = null;

      if (profilePhoto) {
        profileUrl = await imageUploadToServer(profilePhoto);
      }
      if (certificate) {
        certificateUrl = await imageUploadToServer(certificate);
      }
      if (nid) {
        nidUrl = await imageUploadToServer(nid);
      }
      if (contactPaper) {
        contactUrl = await imageUploadToServer(contactPaper);
      }
      submitData(profileUrl, certificateUrl, nidUrl, contactUrl);
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

  const submitData = (profileUrl, certificateUrl, nidUrl, contactUrl) => {
    if (address) {
      const {
        geometry: { location },
        address_components,
      } = address;
      // console.log("placeId",place_id)
      // setPickupFullAddress(formatted_address);
      // setPickupPlaceId(place_id)
      var country_long_name;
      var country_short_name;
      var locality_long_name;
      var sub_locality_long_name;

      address_components.forEach((address_component) => {
        if (address_component.types.includes("country")) {
          country_long_name = address_component.long_name;
          country_short_name = address_component.short_name;
        } else if (address_component.types.includes("locality")) {
          locality_long_name = address_component.long_name;
        } else if (address_component.types.includes("sublocality")) {
          sub_locality_long_name = address_component.long_name;
        }
      });
    }

    const data = {
      name,
      gender,
      phone_number: phoneNum,
      company_name: companyName,
      email,
      password,
      profile_photo: profileUrl,
      dob: dateOfBirth,
      account_type: "seller",
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNum,
      certificate_of_incorporation: certificateUrl,
      national_id: nidUrl,
      sellerContractPaper: contactUrl,
      sellerAddress: {
        address: fullAddress,
        latitude: latLng.lat,
        longitude: latLng.lng,
        city: locality_long_name,
        state: sub_locality_long_name,
        country: country_long_name,
        placeId: address?.place_id,
        pin,
        primary: true,
        note: "",
      },
      sellerType,
      subType,
      sellerStatus,
    };

    // console.log({ data });

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
      dispatch(addSeller(data));
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
        setAddress(null);
        setSelectedAddress("");
        setPin("");
        sellerType("");
        setSellerStatus("");
        setSubType("");
        setProfilePhoto(null);
        setCertificate(null);
        setNid(null);
        setContactPaper(null)
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
                            <TextField
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
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">
                        Gender
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={gender}
                        label="Gender"
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <MenuItem value="male">Mele </MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Pin Code"
                      variant="outlined"
                      placeholder="Enter Pin Code"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">
                        Seller Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sellerType}
                        label="Gender"
                        onChange={(e) => {
                          setSellerType(e.target.value);
                          setSubType("");
                        }}
                      >
                        <MenuItem value="food">Food</MenuItem>
                        <MenuItem value="grocery">Grocery</MenuItem>
                        <MenuItem value="pharmacy">Pharmacy</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col xl={6} className="mt-4 mt-xl-0">
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sellerStatus}
                        label="Status"
                        onChange={(e) => setSellerStatus(e.target.value)}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="archive">Archive</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    {sellerType && sellerType == "food" && (
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Sub Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={subType}
                          label="Sub Type"
                          onChange={(e) => setSubType(e.target.value)}
                          defaultValue={""}
                        >
                          <MenuItem value="restaurants">Restaurants</MenuItem>
                          <MenuItem value="foodcart">Food Cart</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    {sellerType && sellerType == "grocery" && (
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Sub Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={subType}
                          label="Sub Type"
                          onChange={(e) => setSubType(e.target.value)}
                          defaultValue={""}
                        >
                          <MenuItem value="supermarket">Supermarket</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <Label>Profile Photo</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, "profile");
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
                          {profilePhoto && (
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
                                      alt="profile"
                                      src={profilePhoto.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {profilePhoto.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {profilePhoto.formattedSize}
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
                                      onClick={() => setProfilePhoto(null)}
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
                  <Col xl={6}>
                    <Label>Certificate Of Incorporation</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, "certificate");
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
                          {certificate && (
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
                                      alt="certificate"
                                      src={certificate.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {certificate.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {certificate.formattedSize}
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
                                      onClick={() => setCertificate(null)}
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

                <Row>
                  <Col xl={6}>
                    <Label>National ID</Label>
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
                                      alt="Nid"
                                      src={nid.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {nid.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{nid.formattedSize}</strong>
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
                  <Col xl={6}>
                    <Label>Contact Paper</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, "contact");
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
                          {contactPaper && (
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
                                      alt="contactPaper"
                                      src={contactPaper.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {contactPaper.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {contactPaper.formattedSize}
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
                                      onClick={() => setContactPaper(null)}
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

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    color="primary"
                    onClick={submitSeller}
                    className="px-5"
                    disabled={loading}
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
