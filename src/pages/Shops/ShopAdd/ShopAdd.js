import React, { useEffect, useMemo, useState } from "react";
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
import { useHistory, useParams, Link, useLocation } from "react-router-dom";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import {
  cuisinesList,
  foodTypeOptions,
  liveStatusOptions,
  shopDeliveryOptions,
  shopStatusOptions2,
  shopTypeOptions2,
  productVisibility,
} from "../../../assets/staticData";
import requestApi from "../../../network/httpRequest";
import { IMAGE_UPLOAD, SINGLE_SHOP } from "../../../network/Api";

const ShopAdd = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const { search, pathname } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { sellers } = useSelector((state) => state.sellerReducer);
  const { loading, status, shops } = useSelector((state) => state.shopReducer);

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
  const [address, setAddress] = useState(null);
  const [latLng, setLatLng] = useState({});
  const [fullAddress, setFullAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isCuisine, setIsCuisine] = useState(false);
  const [cuisineType, setCuisineType] = useState(null);
  const [liveStatus, setLiveStatus] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // GET SELLER

  useEffect(() => {
    dispatch(getAllSeller(true));
  }, []);

  useEffect(() => {
    if (id) {
      const findShop = shops.find((item) => item._id == id);
      if (findShop) {
        console.log({ findShop });
        updateData(findShop);
      } else {
        // console.log("call api-------");
        callApi(id);
      }
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
// FIND SELLER 
  useEffect(() => {
    if (searchParams) {
      const sellerId = searchParams.get("sellerId");
      if (sellerId) {
        const findSeller = sellers.find((item) => item._id == sellerId);
        setSeller(findSeller);
      }
    }
  }, [searchParams]);

  // UPDATE DATA
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
      liveStatus,
      freeDelivery,
    } = values;

    const findSeller = sellers.find((s) => s._id == seller._id);

    const findDeliveryType = shopDeliveryOptions.find(
      (op) => op.value == delivery
    );
    const findShopStatus = shopStatusOptions2.find(
      (x) => x.value == shopStatus
    );
    const findShopType = shopTypeOptions2.find((x) => x.value == shopType);
    const findFoodType = foodTypeOptions.find((type) => type.value == foodType);
    const findLiveStatus = liveStatusOptions.find(
      (item) => item.value == liveStatus
    );

    const findFreeDelivery = productVisibility.find(
      (item) => item.value == freeDelivery
    );

    setShopLogo(shopLogo);
    setShopBanner(shopBanner);
    setShopPhotos(shopPhotos[0]);
    setSeller(findSeller);
    setFoodType(findFoodType);
    setShopType(findShopType);
    setShopStartTime(shopStartTimeText);
    setShopEndTime(shopEndTimeText);
    setShopName(shopName);
    setShopStatus(findShopStatus);
    setDelivery(findDeliveryType);
    setMinOrderAmount(minOrderAmount);
    setTags({
      items: tags,
      value: "",
    });
    setLiveStatus(findLiveStatus);
    setFreeDelivery(findFreeDelivery);
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
      !shopType ||
      !shopStartTime ||
      !shopEndTime ||
      !shopName ||
      !shopStatus ||
      !delivery ||
      minOrderAmount <= 0 ||
      tags.items.length < 1 ||
      (!id && !pinCode) ||
      !liveStatus
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

    if (isCuisine && !cuisineType) {
      return toast.warn("Please Select Cuisine Type", {
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

  const uploadImages = async () => {
    let logoUrl = null;
    let bannerUrl = null;
    let photosUrl = null;

    if (shopLogo) {
      if (typeof shopLogo == "string") {
        logoUrl = shopLogo;
      } else {
        logoUrl = await imageUploadToServer(shopLogo);
      }
    }
    if (shopBanner) {
      if (typeof shopBanner == "string") {
        bannerUrl = shopBanner;
      } else {
        bannerUrl = await imageUploadToServer(shopBanner);
      }
    }
    if (shopPhotos) {
      if (typeof shopPhotos == "string") {
        photosUrl = shopPhotos;
      } else {
        photosUrl = await imageUploadToServer(shopPhotos);
      }
    }

    if (logoUrl && bannerUrl && photosUrl) {
      submitData(logoUrl, bannerUrl, photosUrl);
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

  // DISPACTH DATA

  const submitData = (logoUrl, bannerUrl, photosUrl) => {
    // console.log("given data---", data);
    if (id) {
      dispatch(
        editShop({
          id,
          shopType: shopType.value,
          foodType: shopType.value == "food"
              ? foodType.value
              : shopType.value == "grocery"
              ? "food cut"
              : "food cut",
          shopStartTime,
          shopEndTime,
          shopName,
          shopLogo: logoUrl,
          shopBanner: bannerUrl,
          shopPhotos: photosUrl,
          shopStatus: shopStatus.value,
          shopDescription: "desrcriptions",
          delivery: delivery.value,
          tags: tags.items,
          minOrderAmount,
          liveStatus: liveStatus.value,
          freeDelivery: freeDelivery.value,
        })
      );
    } else {
      const cuisineTypeData = cuisineType?.map((item) => item.value);
      dispatch(
        addShop({
          shopAddress: {
            address: fullAddress,
            latitude: latLng.lat,
            longitude: latLng.lng,
            city,
            state,
            country,
            placeId: address?.place_id,
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
          shopLogo: logoUrl,
          shopBanner: bannerUrl,
          shopPhotos: photosUrl,
          foodType:
            shopType.value == "food"
              ? foodType.value
              : shopType.value == "grocery"
              ? "supermarkets"
              : "supermarkets",
          shopDescription: "desrcriptions",
          isCuisine,
          cuisineType: cuisineTypeData,
          liveStatus: liveStatus.value,
        })
      );
    }
  };

  const handleAddressChange = (address) => {
    // console.log("address", address);
    setSelectedAddress(address);
  };

  const handleAddressSelect = (address, placeId) => {
    // console.log("select-------------", address, placeId);
    setSelectedAddress(address);
    geocodeByAddress(address);
    geocodeByPlaceId(placeId)
      .then((results) => setAddress(results[0]))
      .catch((error) => console.error("Error", error));
  };

  // GET LAT LNG

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
        setPinCode("");
        setShopLogo(null);
        setShopBanner(null);
        setShopPhotos(null);
        window.scroll(0, 0);
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

    if (type === "logo") {
      setShopLogo(files[0]);
    } else if (type === "banner") {
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
                      disabled={id ? true : false}
                      value={seller}
                      onChange={(event, newValue) => {
                        setSeller(newValue);
                        // console.log("new", newValue);
                      }}
                      getOptionLabel={(option, index) =>
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
                      renderInput={(params, index) => (
                        <TextField {...params} label="Select a Seller" />
                      )}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                          {...props}
                          key={option._id}
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

                    {!id ? (
                      <>
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
                                  })}
                                  disabled={id ? true : false}
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
                      </>
                    ) : (
                      <div className="mb-4">
                        <label className="control-label">Free Delivery</label>
                        <Select
                          palceholder="Select Status"
                          options={productVisibility}
                          classNamePrefix="select2-selection"
                          required
                          value={freeDelivery}
                          onChange={(e) => setFreeDelivery(e)}
                          defaultValue={""}
                        />
                      </div>
                    )}
                  </Col>
                  <Col lg={6} className="mt-4 mt-lg-0">
                    <div className="mb-4">
                      <Label>Shop Type</Label>
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

                    {foodType?.value == "restaurants" && !id && (
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={isCuisine}
                          id="flexCheckDefault"
                          onChange={(e) => setIsCuisine(e.target.checked)}
                        />
                        <label
                          className="form-check-label ms-1"
                          style={{ fontSize: "16px" }}
                          htmlFor="flexCheckDefault"
                        >
                          Is Cuisine?
                        </label>
                      </div>
                    )}

                    {isCuisine && (
                      <div className="mb-3">
                        <label className="control-label">Cuisines</label>
                        <Select
                          value={cuisineType}
                          isMulti={true}
                          onChange={(e) => {
                            setCuisineType(e);
                          }}
                          options={cuisinesList}
                          classNamePrefix="select2-selection"
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <div>
                        <div className="d-flex justify-content-between">
                          <Label>Tags</Label>
                          {foodType?.value == "restaurants" && (
                            <span style={{ color: "red" }}>
                              Must add one cuisine
                            </span>
                          )}
                        </div>
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
                      <Label>Live Status</Label>
                      <Select
                        palceholder="Select Country"
                        options={liveStatusOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={liveStatus}
                        onChange={(e) => setLiveStatus(e)}
                        defaultValue={""}
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
                                      src={shopLogo.preview ? shopLogo.preview: shopLogo}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopLogo.name ? shopLogo.name : "Shop Logo"}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {shopLogo.formattedSize && shopLogo.formattedSize}
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
                                      src={shopBanner.preview ? shopBanner.preview : shopBanner}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopBanner.name ? shopBanner.name : "Shop Banner"}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {shopBanner.formattedSize && shopBanner.formattedSize }
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
                                      src={shopPhotos.preview ? shopPhotos.preview : shopPhotos}
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopPhotos.name ? shopPhotos.name : "Shop Photos"}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        { shopPhotos.formattedSize && shopPhotos.formattedSize}
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
                  <Button
                    disabled={loading}
                    onClick={submitShop}
                    color="primary"
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
