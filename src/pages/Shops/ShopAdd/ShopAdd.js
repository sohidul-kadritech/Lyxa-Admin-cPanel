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
import Switch from "react-switch";
import Dropzone from "react-dropzone";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getAllSeller } from "../../../store/Seller/sellerAction";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  addCuisine,
  addShop,
  editShop,
  getAllCuisine,
} from "../../../store/Shop/shopAction";
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
  const { loading, status, shops, cuisines } = useSelector(
    (state) => state.shopReducer
  );

  const [tags, setTags] = useState({
    items: [],
    value: "",
  });

  const [seller, setSeller] = useState(null);
  const [searchSellerKey, setSearchSellerKey] = useState("");
  const [shopType, setShopType] = useState("");
  const [shopStartTime, setShopStartTime] = useState("");
  const [shopEndTime, setShopEndTime] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopLogo, setShopLogo] = useState(null);
  const [shopBanner, setShopBanner] = useState(null);
  const [shopPhotos, setShopPhotos] = useState(null);
  const [shopStatus, setShopStatus] = useState("");
  const [delivery, setDelivery] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [foodType, setFoodType] = useState("");

  const [selectedAddress, setSelectedAddress] = useState("");
  const [address, setAddress] = useState("");
  const [latLng, setLatLng] = useState({});
  const [fullAddress, setFullAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isCuisine, setIsCuisine] = useState(false);
  const [liveStatus, setLiveStatus] = useState("");
  const [freeDelivery, setFreeDelivery] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [searchCuisineKey, setSearchCuisineKey] = useState("");

  // GET SELLER

  useEffect(() => {
    dispatch(getAllSeller(true));
  }, []);

  // GET CUISINES

  useEffect(() => {
    if (isCuisine) {
      dispatch(getAllCuisine(true));
    }
  }, [isCuisine]);

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
  const updateData = async (values) => {
    const {
      delivery,
      seller: { _id: sellerId },
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
      address
    } = values;

    const findSeller =  sellers.find((s) => s._id == sellerId);
    // console.log({sellerId})

    setShopLogo(shopLogo);
    setShopBanner(shopBanner);
    setShopPhotos(shopPhotos[0]);
    setSeller(findSeller);
    setFoodType(foodType);
    setShopType(shopType);
    setShopStartTime(shopStartTimeText);
    setShopEndTime(shopEndTimeText);
    setShopName(shopName);
    setShopStatus(shopStatus);
    setDelivery(delivery);
    setMinOrderAmount(minOrderAmount);
    setTags({
      items: tags,
      value: "",
    });
    setLiveStatus(liveStatus);
    setFreeDelivery(freeDelivery);
    setPinCode(address.pin)
    handleAddressSelect(address.address, address.placeId)
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

  const submitShop = (e) => {
    e.preventDefault()
    if (!seller) {
      return warningMessage('Select a seller');
    }
    if (tags.items.length < 1) {
      return warningMessage('Please Add Shop Tag');
    }

    if (!id && !address) {
      return warningMessage('Select Shop Address')
    }
    if (!shopLogo || !shopBanner || !shopPhotos) {
      return warningMessage('Choose Image')
    }


    uploadImages();

    // submitData();
  };

  const uploadImages = async () => {
    let logoUrl = null;
    let bannerUrl = null;
    let photosUrl = null;
    setIsLoading(true);
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
      setIsLoading(false);
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
    const cuisinesList = selectedCuisines?.map(item => item?._id)
    if (id) {
      dispatch(
        editShop({
          id,
          shopType: shopType,
          foodType:
            shopType == "food"
              ? foodType
              : shopType == "grocery"
              ? "supermarkets"
              : "food cut",
          shopStartTime,
          shopEndTime,
          shopName,
          shopLogo: logoUrl,
          shopBanner: bannerUrl,
          shopPhotos: photosUrl,
          shopStatus: shopStatus,
          shopDescription: "desrcriptions",
          delivery: delivery,
          tags: tags.items,
          minOrderAmount,
          liveStatus: liveStatus,
           freeDelivery,
          isCuisine,
          cuisineType: cuisinesList,
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
          }
        })
      );
    } else {
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
          shopType: shopType,
          shopStartTime,
          shopEndTime,
          shopStatus: shopStatus,
          delivery: delivery,
          minOrderAmount,
          tags: tags.items,
          shopLogo: logoUrl,
          shopBanner: bannerUrl,
          shopPhotos: photosUrl,
          foodType:
            shopType == "food"
              ? foodType
              : shopType == "grocery"
              ? "supermarkets"
              : "",
          shopDescription: "desrcriptions",
          isCuisine,
          cuisineType: cuisinesList,
          liveStatus: liveStatus,
        })
      );
    }
  };

  // ADDRESS CHANGE

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
        setShopType("");
        setShopStartTime("");
        setShopEndTime("");
        setShopName("");
        setShopStatus("");
        setDelivery("");
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
        setFoodType("");
        setSelectedCuisines([]);
        setSearchCuisineKey("");
        setLiveStatus("");
        setIsCuisine(false);
        setFreeDelivery("")
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


  // CUISINES ADD

  const addNewCuisine = (item) => {
    // console.log({ item });
    setSelectedCuisines([...selectedCuisines, item]);
  };

  // CUISINE REMOVE

  const handleCuisineDelete = (index) => {
    let list = [...selectedCuisines];
    list.splice(index,1)
    setSelectedCuisines(list)
  };

  const warningMessage = (message) =>{
    toast.warn(message, {
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
                      // disabled={id ? true : false}
                      value={seller}
                      onChange={(event, newValue) => {
                        setSeller(newValue);
                        // console.log("new", newValue);
                      }}
                      getOptionLabel={(option, index) =>
                        option.name ? option.name : ""
                      }
                      isOptionEqualToValue={
                        (option, value) => option?._id == value?._id
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
                <Form onSubmit={submitShop}>
                <Row className="pb-3 ">
                  <div className="mb-3">
                    <h5>Shop Informations</h5>
                    <hr />
                  </div>
                  <Col lg={6}>
                    <div className="mb-4">
                      <TextField
                        type="text"
                        className="form-control"
                        placeholder="Enter Shop Name"
                        required
                        label="Name"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <TextField
                        className="form-control"
                        type="time"
                        id="example-time-input"
                        required
                        value={shopStartTime}
                        label="Open At"
                        onChange={(e) => setShopStartTime(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <TextField
                        type="time"
                        className="form-control"
                        // id="example-time-input"
                        label="Close At"
                        required
                        value={shopEndTime}
                        onChange={(e) => setShopEndTime(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Status
                        </InputLabel>
                        <Select
                          id="demo-simple-select"
                          value={shopStatus}
                          onChange={(e) => setShopStatus(e.target.value)}
                          label="Status"
                        >
                          {shopStatusOptions2.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="mb-4">
                      <TextField
                        className="form-control"
                        type="number"
                        placeholder="Enter Minimum Order Amount"
                        required
                        label="Minimum Order"
                        value={minOrderAmount}
                        onChange={(e) => setMinOrderAmount(e.target.value)}
                      />
                    </div>

          
                        <div className="mb-4">
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

                        <div className="mb-4">
                          <TextField
                            className="form-control"
                            type="number"
                            placeholder="Enter Pin Code"
                            required
                            label="Pin Code"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                          />
                        </div>
                  
             
                      {!id && <div className="mb-4">
                        <FormControl required fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Free Delivery
                          </InputLabel>
                          <Select
                            id="demo-simple-select"
                            value={freeDelivery}
                            onChange={(e) => setFreeDelivery(e.target.value)}
                            label="Free Delivery"
                          >
                            {productVisibility.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>}
                 
                  </Col>
                  <Col lg={6} className="mt-4 mt-lg-0">
                    <div className="mb-4">
                      <FormControl required fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Shop Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={shopType}
                          onChange={(e) => setShopType(e.target.value)}
                          label="Shop Type"
                        >
                          {shopTypeOptions2.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    {shopType == "food" && (
                      <div className="mb-4">
                        <FormControl required fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Food Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)}
                            label="Food Type"
                          >
                            {foodTypeOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}

                    <div className="mb-4">
                      <div>
                        <div className="d-flex justify-content-end">
                          {foodType?.value == "restaurants" && (
                            <span style={{ color: "red" }}>
                              Must add one cuisine
                            </span>
                          )}
                        </div>
                        <TextField
                          value={tags.value}
                          placeholder="Type Tag Name and press `Enter`..."
                          onKeyDown={handleTagAdd}
                          onChange={handleTagChange}
                          className="form-control"
                          label="tag"
                        />
                      </div>
                      {tags.items.length > 0 && (
                        <Paper className="mt-4 p-3">
                          {tags.items.map((item, index) => (
                            <div className="tag__wrapper" key={index}>
                              {item}
                              <button
                                type="button"
                                className="button"
                                onClick={() => handleTagDelete(item)}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </Paper>
                      )}
                    </div>

                    <div className="mb-4">
                      <FormControl required fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Delivery Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                         
                          value={delivery}
                          onChange={(e) => setDelivery(e.target.value)}
                          label="Delivery  Type"
                        >
                          {shopDeliveryOptions.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="mb-4">
                      <FormControl required fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Live Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={liveStatus}
                          onChange={(e) => setLiveStatus(e.target.value)}
                          label="Live Status"
                        >
                          {liveStatusOptions.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    {(foodType == "restaurants" && !id) && (
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
                        <Autocomplete
                          className="cursor-pointer"
                          onChange={(event, newValue) => {
                            addNewCuisine(newValue);
                            // console.log("new", newValue);
                          }}
                          getOptionLabel={(option, index) =>
                            option.name ? option.name : ""
                          }
                          isOptionEqualToValue={
                            (option, value) => option._id == value._id
                            // console.log({value})
                          }
                          inputValue={searchCuisineKey}
                          onInputChange={(event, newInputValue) => {
                            setSearchCuisineKey(newInputValue);
                            // console.log("input value", newInputValue);
                          }}
                          id="controllable-states-demo"
                          options={cuisines.length > 0 ? cuisines : []}
                          sx={{ width: "100%" }}
                          renderInput={(params, index) => (
                            <TextField {...params} label="Select Cuisine" />
                          )}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...props}
                              key={option._id}
                            >
                              {option.name}
                            </Box>
                          )}
                        />

                        {selectedCuisines.length > 0 && (
                          <Paper className="mt-4 p-3">
                            {selectedCuisines.map((item, index) => (
                              <div className="tag__wrapper" key={index}>
                                {item.name}
                                <button
                                  type="button"
                                  className="button"
                                  onClick={() => handleCuisineDelete(index)}
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </Paper>
                        )}
                      </div>
                    )}
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col xl={6}>
                    <Label>Shop Logo</Label>
                    <div className="mb-5">
                
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
                                      src={
                                        shopLogo.preview
                                          ? shopLogo.preview
                                          : shopLogo
                                      }
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopLogo.name
                                        ? shopLogo.name
                                        : "Shop Logo"}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {shopLogo.formattedSize &&
                                          shopLogo.formattedSize}
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
                     
                    </div>
                  </Col>
                  <Col xl={6}>
                    <Label>Shop Banner</Label>
                    <div className="mb-5">
            
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
                                      src={
                                        shopBanner.preview
                                          ? shopBanner.preview
                                          : shopBanner
                                      }
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopBanner.name
                                        ? shopBanner.name
                                        : "Shop Banner"}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {shopBanner.formattedSize &&
                                          shopBanner.formattedSize}
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
                  
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <Label>Shop Photos</Label>
                    <div className="mb-5">
            
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
                                      src={
                                        shopPhotos.preview
                                          ? shopPhotos.preview
                                          : shopPhotos
                                      }
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {shopPhotos.name
                                        ? shopPhotos.name
                                        : "Shop Photos"}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {shopPhotos.formattedSize &&
                                          shopPhotos.formattedSize}
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
                   
                    </div>
                  </Col>
                </Row>

                <div className="my-5 d-flex justify-content-center">
                  <Button
                    disabled={loading || isLoading}
                    
                    type='submit'
                    color="primary"
                    className="px-5"
                  >
                    {loading || isLoading ? (
                      <Spinner
                        animation="border"
                        variant="info"
                        size="sm"
                      ></Spinner>
                    ) : id ? (
                      "Save"
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
                </Form>
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};



export default ShopAdd;
