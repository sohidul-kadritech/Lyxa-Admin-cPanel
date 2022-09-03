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
  liveStatusOptions,
  priceRangeOptions,
  shopTypeOptions2,
  statusOptions2,
} from "../../../assets/staticData";
import requestApi from "../../../network/httpRequest";
import { IMAGE_UPLOAD, SINGLE_SHOP } from "../../../network/Api";
import formatBytes from "../../../common/imageFormatBytes";
import { successMsg } from "../../../helpers/successMsg";

const ShopAdd = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const { search } = useLocation();

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
  const [shopStartTime, setShopStartTime] = useState("");
  const [shopEndTime, setShopEndTime] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopLogo, setShopLogo] = useState(null);
  const [shopBanner, setShopBanner] = useState(null);
  const [shopPhotos, setShopPhotos] = useState(null);
  const [shopStatus, setShopStatus] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [address, setAddress] = useState("");
  const [latLng, setLatLng] = useState({});
  const [fullAddress, setFullAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isCuisine, setIsCuisine] = useState(false);
  const [liveStatus, setLiveStatus] = useState("");
  const [expensive, setExpensive] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [searchCuisineKey, setSearchCuisineKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");

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
        updateData(findShop);
      } else {
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

    if (data.status) {
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
      seller,
      minOrderAmount,
      shopBanner,
      shopEndTimeText,
      shopLogo,
      shopName,
      shopPhotos,
      shopStartTimeText,
      shopStatus,
      tags,
      liveStatus,
      address,
      email,
      phone_number,
      cuisineType,
      expensive,
      deliveryFee,
      haveOwnDeliveryBoy,
    } = values;
    setEmail(email);
    setPhone(phone_number);
    setShopLogo(shopLogo);
    setShopBanner(shopBanner);
    setShopPhotos(shopPhotos[0]);
    setSeller(seller);
    setShopStartTime(shopStartTimeText);
    setShopEndTime(shopEndTimeText);
    setShopName(shopName);
    setShopStatus(shopStatus);
    setMinOrderAmount(minOrderAmount);
    setTags({
      items: tags,
      value: "",
    });
    setLiveStatus(liveStatus);
    setPinCode(address.pin);
    handleAddressSelect(address.address, address.placeId);
    setSelectedCuisines(cuisineType);
    setExpensive(expensive);
    setDeliveryFee(haveOwnDeliveryBoy ? deliveryFee : 0);
    setDeliveryType(haveOwnDeliveryBoy ? "self" : "drop");
  };

  // TAGS

  const handleTagAdd = (evt) => {
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
  };

  const handleTagDelete = (item) => {
    setTags({
      ...tags,
      items: tags.items.filter((i) => i != item),
    });
  };

  // SUBMIT SELLER

  const submitShop = (e) => {
    e.preventDefault();
    if (!seller) {
      return successMsg("Select a seller");
    }
    if (seller?.sellerType === "food" && tags.items.length < 1) {
      return successMsg("Please Add Shop Tag");
    }

    if (!id && !address) {
      return successMsg("Select Shop Address");
    }
    if (!shopLogo || !shopBanner || !shopPhotos) {
      return successMsg("Choose Image");
    }

    if (deliveryType === "self" && deliveryFee < 0) {
      return successMsg("Enter Delivery fee");
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

  // DISPACTH DATA

  const submitData = (logoUrl, bannerUrl, photosUrl) => {
    const cuisinesList = selectedCuisines?.map((item) => item?._id);
    if (id) {
      dispatch(
        editShop({
          id,
          shopStartTime,
          shopEndTime,
          shopName,
          isCuisine,
          minOrderAmount,
          email,
          phone_number: phone,
          shopType: seller.sellerType,
          shopLogo: logoUrl,
          shopBanner: bannerUrl,
          shopPhotos: photosUrl,
          shopStatus: shopStatus,
          shopDescription: "desrcriptions",

          tags: tags.items,
          liveStatus: liveStatus,
          cuisineType: cuisinesList,
          expensive,
          deliveryType,
          deliveryFee: deliveryType === "self" ? parseInt(deliveryFee) : 0,
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
        })
      );
    } else {
      dispatch(
        addShop({
          email,
          password,
          shopStartTime,
          shopName,
          shopEndTime,
          minOrderAmount,
          isCuisine: seller.sellerType === "food" ? true : false,
          phone_number: phone,
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
          shopType: seller.sellerType,
          shopStatus: shopStatus,
          tags: tags.items,
          shopLogo: logoUrl,
          shopBanner: bannerUrl,
          shopPhotos: photosUrl,
          shopDescription: "desrcriptions",
          cuisineType: cuisinesList,
          liveStatus,
          expensive,
          deliveryType,
          deliveryFee: deliveryType === "self" ? parseInt(deliveryFee) : 0,
        })
      );
    }
  };

  // ADDRESS CHANGE

  const handleAddressChange = (address) => {
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
        setShopStartTime("");
        setShopEndTime("");
        setShopName("");
        setShopStatus("");
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
        setSelectedCuisines([]);
        setSearchCuisineKey("");
        setLiveStatus("");
        setIsCuisine(false);
        setEmail("");
        setPassword("");
        setPhone("");
        window.scroll(0, 0);
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
    if (item) {
      const isExist = selectedCuisines.find(
        (cuisine) => cuisine._id === item._id
      );
      if (isExist) {
        return successMsg("Cuisine already added");
      }
      setSelectedCuisines([...selectedCuisines, item]);
    }
  };

  // CUISINE REMOVE

  const handleCuisineDelete = (index) => {
    let list = [...selectedCuisines];
    list.splice(index, 1);
    setSelectedCuisines(list);
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
              isRefresh={false}
            />

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
                        <Autocomplete
                          className="cursor-pointer"
                          disabled={
                            id || searchParams.get("sellerId") ? true : false
                          }
                          value={seller}
                          onChange={(event, newValue) => {
                            setSeller(newValue);
                          }}
                          getOptionLabel={(option, index) =>
                            option.name ? option.company_name : ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?._id === value?._id
                          }
                          inputValue={searchSellerKey}
                          onInputChange={(event, newInputValue) => {
                            setSearchSellerKey(newInputValue);
                          }}
                          id="controllable-states-demo"
                          options={sellers.length > 0 ? sellers : []}
                          sx={{ width: "100%" }}
                          renderInput={(params, index) => (
                            <TextField
                              {...params}
                              label="Select a Seller"
                              required
                            />
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
                              {option.company_name}
                            </Box>
                          )}
                        />
                      </div>
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
                          type="time"
                          className="form-control"
                          id="example-time-input"
                          label="Start At"
                          required
                          value={shopStartTime}
                          onChange={(e) => setShopStartTime(e.target.value)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          // inputProps={{
                          //   step: 300, // 5 min
                          // }}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          type="time"
                          className="form-control"
                          id="example-time-input"
                          label="Close At"
                          required
                          value={shopEndTime}
                          onChange={(e) => setShopEndTime(e.target.value)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          // inputProps={{
                          //   step: 300, // 5 min
                          // }}
                        />
                      </div>

                      <div className="mb-4">
                        <FormControl fullWidth required>
                          <InputLabel id="demo-simple-select-label">
                            Status
                          </InputLabel>
                          <Select
                            required
                            id="demo-simple-select"
                            value={shopStatus}
                            onChange={(e) => setShopStatus(e.target.value)}
                            label="Status"
                          >
                            {statusOptions2.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                          placeholder="Enter Zip Code"
                          required
                          label="Zip Code"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                        />
                      </div>

                      <div className="mb-4">
                        <FormControl required fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Delivery Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={deliveryType}
                            onChange={(e) => {
                              setDeliveryType(e.target.value);
                              setDeliveryFee(0);
                            }}
                            label="Delivery  Type"
                          >
                            <MenuItem value="self">Self</MenuItem>
                            <MenuItem value="drop">Drop</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      {deliveryType === "self" && (
                        <div className="mb-4">
                          <TextField
                            type="number"
                            name="deliveryFee"
                            className="form-control"
                            placeholder="Enter delivery fee"
                            required
                            label="Delivery Fee"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(e.target.value)}
                          />
                        </div>
                      )}
                    </Col>
                    <Col lg={6} className="mt-4 mt-lg-0">
                      <div className="mb-4">
                        <TextField
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter Shop Email"
                          required
                          label="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {!id && (
                        <div className="mb-4">
                          <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            style={{ width: "100%" }}
                            autoComplete="off"
                            value={password}
                            onChange={(event) =>
                              setPassword(event.target.value)
                            }
                            required
                          />
                        </div>
                      )}

                      <div className="mb-4">
                        <TextField
                          type="number"
                          name="phone"
                          className="form-control"
                          placeholder="Enter Shop phone"
                          required
                          label="Phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      {/* {shopType == "food" && (
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
                      )} */}

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
                        <div>
                          <TextField
                            value={tags.value}
                            placeholder="Type Tag Name and press `Enter`..."
                            onKeyDown={handleTagAdd}
                            onChange={handleTagChange}
                            className="form-control"
                            label="Tag"
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
                            Live Status
                          </InputLabel>
                          <Select
                            required
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

                      <div className="mb-4">
                        <FormControl required fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Price Range
                          </InputLabel>
                          <Select
                            required
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={expensive}
                            onChange={(e) => setExpensive(e.target.value)}
                            label="Price range"
                          >
                            {priceRangeOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* {shopType == "food" && !id && (
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
                      )} */}

                      {seller?.sellerType == "food" && (
                        <div className="mb-3">
                          <Autocomplete
                            className="cursor-pointer"
                            onChange={(event, newValue) => {
                              addNewCuisine(newValue);
                            }}
                            getOptionLabel={(option, index) =>
                              option.name ? option.name : ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option._id === value._id
                            }
                            inputValue={searchCuisineKey}
                            onInputChange={(event, newInputValue) => {
                              setSearchCuisineKey(newInputValue);
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
                                {option?.name}
                              </Box>
                            )}
                          />

                          {selectedCuisines.length > 0 && (
                            <Paper className="mt-4 p-3">
                              {selectedCuisines.map((item, index) => (
                                <div className="tag__wrapper" key={index}>
                                  {item?.name}
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

                  {/* IMAGES */}
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
                      type="submit"
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
