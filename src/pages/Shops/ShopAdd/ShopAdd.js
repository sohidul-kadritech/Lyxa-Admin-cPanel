import React, { useEffect, useState } from "react";
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
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Select from "react-select";
import Switch from "react-switch";
import Dropzone from "react-dropzone";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getAllSeller } from "../../../store/Seller/sellerAction";
import { Autocomplete, Box, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { addShop, editShop } from "../../../store/Shop/shopAction";
import { useHistory, useParams, Link } from "react-router-dom";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import {
  foodTypeOptions,
  shopDeliveryOptions,
  shopStatusOptions2,
  shopTypeOptions2,
} from "../../../assets/staticData";
import requestApi from "../../../network/httpRequest";
import { IMAGE_UPLOAD, SINGLE_SHOP } from "../../../network/Api";

import { imageUpload } from "../../../store/ImageUpload/imageUploadAction";

const ShopAdd = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const { sellers } = useSelector((state) => state.sellerReducer);
  const { loading, status, shops } = useSelector((state) => state.shopReducer);
  const { image: uploadImage, imageStatus } = useSelector(
    (state) => state.imageUploadReducer
  );

  const [tags, setTags] = useState({
    items: [],
    value: "",
  });

  const [seller, setSeller] = useState(null);
  const [searchSellerKey, setSearchSellerKey] = useState("");
  const [shopType, setShopType] = useState(null);
  const [shopStartTime, setShopStartTime] = useState("");
  const [shopEndTime, setShopEndTime] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopLogo, setShopLogo] = useState(null);
  const [shopBanner, setShopBanner] = useState(null);
  const [shopPhotos, setShopPhotos] = useState(null);
  const [shopStatus, setShopStatus] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [foodType, setFoodType] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [address, setAddress] = useState({});
  const [latLng, setLatLng] = useState({});
  const [fullAddress, setFullAddress] = useState("");
  const [pinCode, setPinCode] = useState("");

  // GET SELLER

  useEffect(() => {
    dispatch(getAllSeller(true));
  }, []);

  useEffect(() => {
    if (sellers.length > 0) {
      if (id) {
        const findShop = shops.find((item) => item._id == id);
        if (findShop) {
          console.log({ findShop });
          updateData(findShop);
        } else {
          console.log("call api-------");
          callApi(id);
        }
      }
    } else {
      console.log("not found sellers");
      history.goBack();
    }
  }, [id]);

  const callApi = async (shopId) => {
    const { data } = await requestApi().request(SINGLE_SHOP, {
      params: {
        id: shopId,
      },
    });
    // console.log(banner)
    if (data.status) {
      console.log("single shop from api", data.data.shop);
      updateData(data.data.shop);
    } else {
      history.push("/shop/list", { replace: true });
    }
  };

  const updateData = (values) => {
    const {
      delivery,
      seller,
      minOrderAmount,
      shopBanner,
      shopEndTimeText,
      shopLogo,
      shopName,
      shopPhotos,
      shopStartTimeText,
      shopStatus,
      shopType,
      foodType,
      tags,
      address,
    } = values;

    const findSeller = sellers.find((s) => s._id == seller._id);

    const findDeliveryType = shopDeliveryOptions.find(
      (op) => op.value == delivery
    );
    const findShopStatus = shopStatusOptions2.find(
      (x) => x.value == shopStatus
    );
    const findShopType = shopTypeOptions2.find((x) => x.value == shopType);
    // console.log({ findShopType });
    const findFoodType = foodTypeOptions.find((type) => type.value == foodType);

    setSeller(findSeller);
    setFoodType(findFoodType);
    setShopType(findShopType);
    setShopStartTime(shopStartTimeText);
    setShopEndTime(shopEndTimeText);
    setShopName(shopName);
    setShopStatus(findShopStatus);
    setDelivery(findDeliveryType);
    setMinOrderAmount(minOrderAmount);
    // setSelectedAddress(address.address);
    handleAddressSelect(address.address);

    setPinCode(address.pin);
    setTags({
      items: tags,
      value: "",
    });
  };

  // TAGS

  const handleTagAdd = (evt) => {
    // console.log(evt.key);
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      let value = tags.value.trim();

      if (value) {
        setTags({
          items: [...tags.items, tags.value],
          value: "",
        });
      }
    }
  };

  const handleTagChange = (evt) => {
    setTags({
      ...tags,
      value: evt.target.value,
    });
    // console.log(tags);
  };

  const handleTagDelete = (item) => {
    setTags({
      ...tags,
      items: tags.items.filter((i) => i != item),
    });
  };

  // SUBMIT SELLER

  const submitShop = () => {
    if (!seller) {
      return toast.warn("Select a Seller", {
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
    if (
      (!shopType ||
        !shopStartTime ||
        !shopEndTime ||
        !shopName ||
        !shopStatus ||
        !delivery ||
        minOrderAmount <= 0 ||
        tags.items.length < 1,
      !pinCode)
    ) {
      return toast.warn("Please Fillup All Fields", {
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

    if (Object.keys(address).length < 1) {
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
    if (!shopLogo || !shopBanner || !shopPhotos) {
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

    uploadImages();

    
    // submitData();
  };

  const uploadImages = async() =>{
    let logoUrl = null;
    let bannerUrl = null;
    let photosUrl = null;

    if (shopLogo) {
      let formData = new FormData();
      formData.append("image", shopLogo);
      // console.log({formData})
      const { data } = await requestApi().request(IMAGE_UPLOAD, {
        method: "POST",
        data: formData,
      });
      // console.log("image upload", data)
      if (data.status) {
        // submitData(data.data.url);
        logoUrl = data.data.url;
      }
    }
    if (shopBanner) {
      let formData = new FormData();
      formData.append("image", shopBanner);
      // console.log({formData})
      const { data } = await requestApi().request(IMAGE_UPLOAD, {
        method: "POST",
        data: formData,
      });
      // console.log("image upload", data)
      if (data.status) {
        // submitData(data.data.url);
        bannerUrl = data.data.url;
      }
    }
    if (shopPhotos) {
      let formData = new FormData();
      formData.append("image", shopPhotos);
      // console.log({formData})
      const { data } = await requestApi().request(IMAGE_UPLOAD, {
        method: "POST",
        data: formData,
      });
      // console.log("image upload", data)
      if (data.status) {
        // submitData(data.data.url);
        photosUrl = data.data.url;
      }
    }
    // console.log({logoUrl,bannerUrl,photosUrl})
    submitData(logoUrl, bannerUrl, photosUrl)
  }

  // DISPACTH DATA

  const submitData = (logoUrl, bannerUrl, photosUrl) => {
    if (Object.keys(address).length > 0) {
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
      shopAddress: {
        address: fullAddress,
        latitude: latLng.lat,
        longitude: latLng.lng,
        city: locality_long_name,
        state: sub_locality_long_name,
        country: country_long_name,
        pin: pinCode,
        primary: true,
        note: "",
      },
      seller: seller._id,
      shopName,
      shopType: shopType.value,
      shopStartTime,
      shopEndTime,
      shopStatus: shopStatus.value,
      delivery: delivery.value,
      minOrderAmount,
      tags: tags.items,
      shopLogo:logoUrl,
      shopBanner:bannerUrl,
      shopPhotos: photosUrl,
      foodType: shopType.value == "food" ? foodType.value : "",
      shopDescription: "desrcriptions",
    };

    console.log("given data---", data);

    if (id) {
      dispatch(
        editShop({
          ...data,
          id,
        })
      );
    } else {
      dispatch(addShop(data));
    }
  };

  const handleAddressChange = (address) => {
    // console.log("address", address);
    setSelectedAddress(address);
  };

  const handleAddressSelect = (address, placeId) => {
    console.log("select-------------", address, placeId);
    setSelectedAddress(address);
    geocodeByAddress(address);
    geocodeByPlaceId(placeId)
      .then((results) => setAddress(results[0]))
      .catch((error) => console.error("Error", error));
  };

  // GET LAT LNG

  useEffect(() => {
    if (Object.keys(address).length > 0) {
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

  // SUCCESS

  useEffect(() => {
    if (status) {
      if (id) {
        history.push("/shops/list");
      } else {
        setSeller(null);
        setShopType(null);
        setShopStartTime("");
        setShopEndTime("");
        setShopName("");
        setShopStatus(null);
        setDelivery(null);
        setMinOrderAmount(0);
        setTags({
          items: [],
          value: "",
        });
        setSelectedAddress("");
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

    if (type == "logo") {
      setShopLogo(files[0]);
    }
    if (type == "banner") {
      setShopBanner(files[0]);
    } else {
      setShopPhotos(files[0]);
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={id ? "Edit" : "Add"}
              title="Shop"
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <Autocomplete
                      className="cursor-pointer"
                      value={seller}
                      onChange={(event, newValue) => {
                        setSeller(newValue);
                        // console.log("new", newValue);
                      }}
                      getOptionLabel={(option) =>
                        option.name ? option.name : ""
                      }
                      isOptionEqualToValue={
                        (option, value) => option._id == value._id
                        // console.log({value})
                      }
                      inputValue={searchSellerKey}
                      onInputChange={(event, newInputValue) => {
                        setSearchSellerKey(newInputValue);
                        // console.log("input value", newInputValue);
                      }}
                      id="controllable-states-demo"
                      options={sellers.length > 0 ? sellers : []}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select a Seller" />
                      )}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                          {...props}
                        >
                          <img
                            loading="lazy"
                            width="60"
                            src={option.profile_photo}
                            alt=""
                          />
                          {option.name}
                        </Box>
                      )}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
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
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <Label>Opens At</Label>
                      <input
                        className="form-control"
                        type="time"
                        id="example-time-input"
                        required
                        value={shopStartTime}
                        onChange={(e) => setShopStartTime(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <Label>Close At</Label>
                      <input
                        className="form-control"
                        type="time"
                        id="example-time-input"
                        required
                        value={shopEndTime}
                        onChange={(e) => setShopEndTime(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="control-label">Status</label>
                      <Select
                        palceholder="Select Status"
                        options={shopStatusOptions2}
                        classNamePrefix="select2-selection"
                        required
                        value={shopStatus}
                        onChange={(e) => setShopStatus(e)}
                        defaultValue={""}
                      />
                    </div>

                    <div className="mb-4">
                      <div>
                        <Label>Tags</Label>
                        <input
                          value={tags.value}
                          placeholder="Type Tag Name and press `Enter`..."
                          onKeyDown={handleTagAdd}
                          onChange={handleTagChange}
                          className="form-control"
                        />
                      </div>
                      {tags.items.length > 0 && (
                        <Paper className="mt-4 p-3">
                          {tags.items.map((item, index) => (
                            <TagWrapper className="tag-item" key={index}>
                              {item}
                              <button
                                type="button"
                                className="button"
                                onClick={() => handleTagDelete(item)}
                              >
                                &times;
                              </button>
                            </TagWrapper>
                          ))}
                        </Paper>
                      )}
                    </div>
                  </Col>
                  <Col lg={6} className="mt-4 mt-lg-0">
                    <div className="mb-4">
                      <Label>Minimum Order</Label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter Minimum Order Amount"
                        required
                        value={minOrderAmount}
                        onChange={(e) => setMinOrderAmount(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <Label>Type</Label>
                      <Select
                        palceholder="Select Country"
                        options={shopTypeOptions2}
                        classNamePrefix="select2-selection"
                        required
                        value={shopType}
                        onChange={(e) => setShopType(e)}
                        defaultValue={""}
                      />
                    </div>

                    {shopType && shopType.value == "food" && (
                      <div className="mb-4">
                        <Label>Food Type</Label>
                        <Select
                          palceholder="Select Country"
                          options={foodTypeOptions}
                          classNamePrefix="select2-selection"
                          required
                          value={foodType}
                          onChange={(e) => setFoodType(e)}
                          defaultValue={""}
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <Label>Delivery Type</Label>
                      <Select
                        palceholder="Select Country"
                        options={shopDeliveryOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={delivery}
                        onChange={(e) => setDelivery(e)}
                        defaultValue={""}
                      />
                    </div>

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
                              label="Pickup Location"
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

                    <div className="mb-4">
                      <Label>Pin Code</Label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter Pin Code"
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <Label>Shop Logo</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, "logo");
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
                          {shopLogo && (
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
                                      src={shopLogo.preview}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopLogo.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{shopLogo.formattedSize}</strong>
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
                                      onClick={() => setShopLogo(null)}
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
                    <Label>Shop Banner</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, "banner");
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
                          {shopBanner && (
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
                                      src={shopBanner.preview}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopBanner.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {shopBanner.formattedSize}
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
                                      onClick={() => setShopBanner(null)}
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
                    <Label>Shop Photos</Label>
                    <div className="mb-5">
                      <Form>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles, "photos");
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
                          {shopPhotos && (
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
                                      src={shopPhotos.preview}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopPhotos.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {shopPhotos.formattedSize}
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
                                      onClick={() => setShopPhotos(null)}
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
                  <Button onClick={submitShop} color="primary" className="px-5">
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

const TagWrapper = styled.div`
  background-color: #d4d5d6;
  display: inline-block;
  font-size: 14px;
  border-radius: 30px;
  height: 30px;
  padding: 0 4px 0 1rem;
  display: inline-flex;
  align-items: center;
  margin: 0 0.3rem 0.3rem 0;

  .button {
    background-color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font: inherit;
    margin-left: 10px;
    font-weight: bold;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default ShopAdd;
