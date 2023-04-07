/* eslint-disable no-unused-vars */
/* eslint-disable radix */
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import React, { useEffect, useMemo, useState } from 'react';
import Dropzone from 'react-dropzone';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Form, Label, Row, Spinner } from 'reactstrap';
import { liveStatusOptions, priceRangeOptions, shopDietaryOptions, statusOptions2 } from '../../../assets/staticData';
import formatBytes from '../../../common/imageFormatBytes';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import { IMAGE_UPLOAD, SINGLE_SELLER, SINGLE_SHOP } from '../../../network/Api';
import AXIOS from '../../../network/axios';
import requestApi from '../../../network/httpRequest';
import { getAllSeller, updateSellerSearchKey } from '../../../store/Seller/sellerAction';
import { addShop, editShop, getAllCuisine, getAllTags, updateShopSearchKey } from '../../../store/Shop/shopAction';

import { callApi } from '../../../components/SingleApiCall';

function ShopAdd() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { sellers, searchKey: searchSellerKey } = useSelector((state) => state.sellerReducer);
  const { loading, status, shops, cuisines, tags: allTags, searchKey } = useSelector((state) => state.shopReducer);

  const [tags, setTags] = useState([]);
  const [shop, setShop] = useState({});

  console.log(tags);

  const [seller, setSeller] = useState(null);
  const [shopStartTime, setShopStartTime] = useState('');
  const [shopEndTime, setShopEndTime] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopLogo, setShopLogo] = useState(null);
  const [shopBanner, setShopBanner] = useState(null);
  const [shopStatus, setShopStatus] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({});
  const [fullAddress, setFullAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [liveStatus, setLiveStatus] = useState('');
  const [expensive, setExpensive] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [searchCuisineKey, setSearchCuisineKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [dietaryType, setdietaryType] = useState([]);

  const { account_type, _id: accountId } = useSelector((store) => store.Login.admin);

  // GET SELLER
  useEffect(() => {
    dispatch(getAllSeller(true));
  }, [searchSellerKey]);

  // GET CUISINES
  useEffect(() => {
    if (seller?.sellerType === 'food') {
      dispatch(getAllCuisine(true));
    }
  }, [seller?.sellerType === 'food']);

  const handleAddressSelect = (address, placeId) => {
    setSelectedAddress(address);
    geocodeByAddress(address);
    geocodeByPlaceId(placeId)
      .then((results) => setAddress(results[0]))
      .catch((error) => console.error('Error', error));
  };

  // UPDATE DATA
  const updateData = (values) => {
    const {
      seller,
      minOrderAmount,
      shopBanner,
      shopEndTimeText,
      shopLogo,
      shopName,
      shopStartTimeText,
      shopStatus,
      tags,
      tagsId,
      liveStatus,
      address,
      email,
      phone_number,
      cuisineType,
      dietaryType,
      expensive,
      deliveryFee,
      haveOwnDeliveryBoy,
      account_name,
      account_number,
      bank_name,
    } = values;
    setEmail(email);
    setPhone(phone_number);
    setShopLogo(shopLogo);
    setShopBanner(shopBanner);
    setSeller(seller);
    setShopStartTime(shopStartTimeText);
    setShopEndTime(shopEndTimeText);
    setShopName(shopName);
    setShopStatus(shopStatus);
    setMinOrderAmount(minOrderAmount);
    setLiveStatus(liveStatus);
    setPinCode(address.pin);
    handleAddressSelect(address.address, address.placeId);
    setSelectedCuisines(cuisineType);
    setExpensive(expensive);
    setDeliveryFee(haveOwnDeliveryBoy ? deliveryFee : 0);
    setDeliveryType(haveOwnDeliveryBoy ? 'self' : 'drop');
    setBankName(bank_name);
    setAccountName(account_name);
    setAccountNum(account_number);
    setdietaryType(dietaryType || []);
  };

  useEffect(async () => {
    if (id) {
      const findShop = shops.find((item) => item._id === id);

      if (findShop) {
        updateData(findShop);
        setShop(findShop);
      } else {
        // callApi(id, SINGLE_SHOP,);
        const data = await callApi(id, SINGLE_SHOP, 'shop');
        if (data) {
          updateData(data);
          setShop(data);
        } else {
          history.push('/shops/list', { replace: true });
        }
      }
    }
  }, [id]);

  // FIND SELLER
  useEffect(async () => {
    if (searchParams.get('sellerId') || account_type === 'seller') {
      const paramsId = searchParams.get('sellerId');
      let sellerId = null;
      // eslint-disable-next-line no-unused-expressions
      paramsId ? (sellerId = paramsId) : (sellerId = accountId);
      if (sellerId) {
        const findSeller = sellers.find((item) => item._id === sellerId);
        if (findSeller) {
          setSeller(findSeller);
        } else {
          const data = await callApi(id, SINGLE_SELLER, 'seller');
          if (data) {
            setSeller(data);
          } else {
            history.push('/shops/list', { replace: true });
          }
        }
      }
    }
  }, [searchParams, account_type]);

  // GET ALL TAGS
  useEffect(() => {
    if (seller || searchKey) {
      dispatch(getAllTags(true, seller?.sellerType));
    }
  }, [seller, searchKey]);

  // handle dietry change
  const handleDietryChange = (event) => {
    const {
      target: { value },
    } = event;
    setdietaryType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  // TAGS ADD
  const handleTagChange = (item) => {
    if (item) {
      setTags((prev) => [...prev, item]);
    }
  };

  const handleTagDelete = (tag) => {
    setTags((prev) => prev.filter((item) => item?._id !== tag?._id));
  };

  const getMinutes = (s) => s.split(':').reduce((acc, curr) => acc * 60 + +curr, 0);

  //  UPLAOD IMAGE TO SERVER
  // eslint-disable-next-line consistent-return
  const imageUploadToServer = async (image) => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await requestApi().request(IMAGE_UPLOAD, {
        method: 'POST',
        data: formData,
      });

      if (data.status) {
        return data.data.url;
      }
      successMsg(data.error);
    } catch (error) {
      console.log(error.message);
    }
  };

  // DISPACTH DATA
  const submitData = (logoUrl, bannerUrl) => {
    const cuisinesList = selectedCuisines?.map((item) => item?._id);

    const data = {
      shopStartTime,
      shopEndTime,
      shopName,
      password,
      isCuisine: seller.sellerType === 'food',
      minOrderAmount,
      email,
      phone_number: phone,
      shopType: seller.sellerType,
      shopLogo: logoUrl,
      shopBanner: bannerUrl,
      shopStatus,
      shopDescription: 'desrcriptions',
      tags: tags.map((item) => item?.name),
      tagsId: tags.map((item) => item?._id),
      liveStatus,
      cuisineType: cuisinesList,
      dietaryType,
      expensive,
      deliveryType,
      deliveryFee: deliveryType === 'self' ? parseInt(deliveryFee) : 0,
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
        note: '',
      },
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNum,
    };

    if (id) {
      dispatch(
        editShop({
          id,
          ...data,
        })
      );
    } else {
      dispatch(
        addShop({
          seller: seller._id,
          ...data,
        })
      );
    }
  };

  const uploadImages = async () => {
    let logoUrl = null;
    let bannerUrl = null;
    setIsLoading(true);
    if (shopLogo) {
      if (typeof shopLogo === 'string') {
        logoUrl = shopLogo;
      } else {
        logoUrl = await imageUploadToServer(shopLogo);
      }
    }
    if (shopBanner) {
      if (typeof shopBanner === 'string') {
        bannerUrl = shopBanner;
      } else {
        bannerUrl = await imageUploadToServer(shopBanner);
      }
    }

    if (logoUrl && bannerUrl) {
      setIsLoading(false);
      submitData(logoUrl, bannerUrl);
    }
  };

  // SUBMIT SELLER
  // eslint-disable-next-line consistent-return
  const submitShop = (e) => {
    e.preventDefault();
    if (!seller) {
      return successMsg('Select a seller');
    }
    if (seller?.sellerType === 'food' && tags.length < 1) {
      return successMsg('Please Add Shop Tag');
    }

    if (!id && !address) {
      return successMsg('Select Shop Address');
    }
    if (!shopLogo || !shopBanner) {
      return successMsg('Choose Image');
    }

    if (deliveryType === 'self' && deliveryFee < 0) {
      return successMsg('Enter Delivery fee');
    }

    const getStartSec = getMinutes(shopStartTime);
    const getEndSec = getMinutes(shopEndTime);
    let diff = (getEndSec - getStartSec) / 60;
    if (diff < 0) {
      diff = 24 + diff;
    }

    if (diff > 24) {
      return successMsg('Shop Start and End time are wrong');
    }

    uploadImages();

    // submitData();
  };

  // ADDRESS CHANGE
  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  // GET LAT LNG
  useEffect(() => {
    if (address) {
      const { address_components, formatted_address } = address;
      getLatLng(address).then((latlng) => setLatLng(latlng));
      setFullAddress(formatted_address);

      address_components?.forEach((address_component) => {
        if (address_component?.types?.includes('country')) {
          setCountry(address_component?.long_name);
        } else if (address_component.types.includes('locality')) {
          setCity(address_component.long_name);
        } else if (address_component.types.includes('sublocality')) {
          setState(address_component.long_name);
        }
      });
    }
  }, [address]);

  // SUCCESS
  useEffect(() => {
    if (status) {
      if (id) {
        history.push('/shops/list');
      } else {
        setSeller(null);
        setShopStartTime('');
        setShopEndTime('');
        setShopName('');
        setShopStatus('');
        setMinOrderAmount(0);
        setTags({
          items: [],
          value: '',
        });
        setSelectedAddress('');
        setPinCode('');
        setShopLogo(null);
        setShopBanner(null);
        setSelectedCuisines([]);
        setSearchCuisineKey('');
        setLiveStatus('');
        setEmail('');
        setPassword('');
        setPhone('');
        setBankName('');
        setAccountName('');
        setAccountNum('');
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

    if (type === 'logo') {
      setShopLogo(files[0]);
    } else {
      setShopBanner(files[0]);
    }
  };

  // eslint-disable-next-line consistent-return
  const addNewCuisine = (item) => {
    if (item) {
      const isExist = selectedCuisines.find((cuisine) => cuisine._id === item._id);
      if (isExist) {
        return successMsg('Cuisine already added');
      }
      setSelectedCuisines([...selectedCuisines, item]);
    }
  };

  // CUISINE REMOVE
  const handleCuisineDelete = (index) => {
    const list = [...selectedCuisines];
    list.splice(index, 1);
    setSelectedCuisines(list);
  };

  const tagsQuery = useQuery(
    [
      `tags-cusines-${seller?.sellerType}`,
      {
        shopType: seller?.sellerType,
        status: 'active',
      },
    ],
    () =>
      AXIOS.get(Api.GET_ALL_TAGS_AND_CUSINES, {
        params: {
          page: 1,
          pageSize: 500,
          sortBy: 'asc',
          shopType: seller?.sellerType,
          status: 'active',
        },
      }),
    {
      enabled: !!shop?._id,
      onSuccess: (data) => {
        if (id) {
          setTags(data?.data?.tags?.filter((item) => shop?.tagsId?.includes(item?._id)) || []);
        }
      },
    }
  );

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem={id ? 'Edit' : 'Add'}
            title={id ? shopName : 'Shop'}
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
                        disabled={!!(id || searchParams.get('sellerId') || account_type === 'seller')}
                        value={seller || null}
                        onChange={(event, newValue) => {
                          setSeller(newValue);
                        }}
                        getOptionLabel={(option) => option.company_name}
                        isOptionEqualToValue={(option, value) => option?.company_name === value?.company_name}
                        inputValue={searchSellerKey}
                        onInputChange={(event, newInputValue) => {
                          dispatch(updateSellerSearchKey(newInputValue));
                        }}
                        id="controllable-states-demo"
                        options={sellers.length > 0 ? sellers : []}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="Select a Seller" required />}
                        renderOption={(props, option) => (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option?._id}>
                            <img loading="lazy" width="60" src={option?.profile_photo} alt="" />
                            {option?.company_name}
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
                        inputProps={{
                          step: 300, // 5 min
                        }}
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
                      />
                    </div>

                    <div className="mb-4">
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
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
                        clearItemsOnError
                        shouldFetchSuggestions={selectedAddress.length > 3}
                        googleCallbackName="myCallbackFunc"
                      >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                          <div>
                            <TextField
                              {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
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
                                fontSize: '14px',
                                fontFamily: 'emoji',
                                color: 'black',
                              }}
                            >
                              {loading && <div>Loading...</div>}
                              {suggestions.map((suggestion) => {
                                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                                const style = suggestion.active
                                  ? {
                                      backgroundColor: '#fafafa',
                                      cursor: 'pointer',
                                    }
                                  : {
                                      backgroundColor: '#ffffff',
                                      cursor: 'pointer',
                                    };
                                return (
                                  <div
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style,
                                    })}
                                    key={Math.random()}
                                  >
                                    <i className="ti-location-pin me-1" style={{ color: 'black' }} />
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
                        <InputLabel id="demo-simple-select-label">Delivery Type</InputLabel>
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

                    {deliveryType === 'self' && (
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
                    <div className="mb-4">
                      <TextField
                        style={{ width: '100%' }}
                        id="outlined-basic"
                        label="Account Number"
                        variant="outlined"
                        placeholder="Enter Account Number"
                        value={accountNum}
                        onChange={(e) => setAccountNum(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <TextField
                        style={{ width: '100%' }}
                        id="outlined-basic"
                        label="Account Name"
                        variant="outlined"
                        placeholder="Enter Account Name"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        required
                      />
                    </div>
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

                    <div className="mb-4">
                      <TextField
                        id="password"
                        label={`${id ? 'New Password' : 'Password'}`}
                        variant="outlined"
                        style={{ width: '100%' }}
                        autoComplete="off"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required={!id}
                      />
                    </div>

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
                        <Autocomplete
                          className="cursor-pointer"
                          value={tags || null}
                          onChange={(event, newValue) => {
                            handleTagChange(newValue);
                          }}
                          disabled={!seller}
                          getOptionLabel={(option) => (option.name ? option.name : '')}
                          isOptionEqualToValue={(option, value) => option === value}
                          inputValue={searchKey}
                          onInputChange={(event, newInputValue) => {
                            dispatch(updateShopSearchKey(newInputValue));
                          }}
                          id="controllable-states-demo"
                          options={tagsQuery.data?.data?.tags?.filter((item) => item?.type === 'tag') || []}
                          sx={{ width: '100%' }}
                          renderInput={(params) => <TextField {...params} label="Select a Tag" name="tag" />}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                              {...props}
                              key={option?._id}
                            >
                              {option?.name}
                            </Box>
                          )}
                        />
                      </div>

                      {tags.length > 0 && (
                        <Paper className="mt-4 p-3">
                          {tags.map((item, index) => (
                            <div className="tag__wrapper" key={index}>
                              {item?.name}
                              <button type="button" className="button" onClick={() => handleTagDelete(item)}>
                                &times;
                              </button>
                            </div>
                          ))}
                        </Paper>
                      )}
                    </div>

                    <div className="mb-4">
                      <FormControl required fullWidth>
                        <InputLabel id="demo-simple-select-label">Live Status</InputLabel>
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
                        <InputLabel id="demo-simple-select-label">Price Range</InputLabel>
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
                    <div className="mb-4">
                      <TextField
                        style={{ width: '100%' }}
                        id="outlined-basic"
                        label="Bank Name"
                        variant="outlined"
                        placeholder="Enter Bank Name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                      />
                    </div>
                    {seller?.sellerType === 'food' && (
                      <div className="mb-3">
                        <Autocomplete
                          className="cursor-pointer"
                          onChange={(event, newValue) => {
                            addNewCuisine(newValue);
                          }}
                          getOptionLabel={(option) => (option.name ? option.name : '')}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          inputValue={searchCuisineKey}
                          onInputChange={(event, newInputValue) => {
                            setSearchCuisineKey(newInputValue);
                          }}
                          id="controllable-states-demo"
                          options={tagsQuery.data?.data?.tags?.filter((item) => item?.type === 'cuisine') || []}
                          sx={{ width: '100%' }}
                          renderInput={(params) => <TextField {...params} label="Select Cuisine" />}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
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
                                <button type="button" className="button" onClick={() => handleCuisineDelete(index)}>
                                  &times;
                                </button>
                              </div>
                            ))}
                          </Paper>
                        )}
                      </div>
                    )}

                    {seller?.sellerType === 'food' && (
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel>Select Dietary Type</InputLabel>
                        <Select
                          multiple
                          value={dietaryType}
                          onChange={handleDietryChange}
                          input={<OutlinedInput label="Select Dietary Type" />}
                          renderValue={(selected) => {
                            const showValue = [];
                            selected.forEach((seletedItem) => {
                              showValue.push(shopDietaryOptions.find((item) => item.value === seletedItem).label);
                            });
                            return showValue.join(', ');
                          }}
                        >
                          {shopDietaryOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Checkbox checked={dietaryType.indexOf(option.value) > -1} />
                              <ListItemText primary={option.label} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                          handleAcceptedFiles(acceptedFiles, 'logo');
                        }}
                        accept=".jpg, .jpeg, .png"
                        maxSize={1000 * 1000}
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
                              <small
                                style={{
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                }}
                              >
                                * Max Image size allowed Id 1 Mb.
                              </small>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                      <div className="dropzone-previews mt-3" id="file-previews">
                        {shopLogo && (
                          <Card
                            className="
                          mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete
                          "
                          >
                            <div className="p-2">
                              <Row className="align-items-center position-relative">
                                <Col className="col-auto">
                                  <img
                                    data-dz-thumbnail=""
                                    // height="80"
                                    style={{
                                      maxWidth: '80px',
                                    }}
                                    className=" bg-light"
                                    src={shopLogo.preview ? shopLogo.preview : shopLogo}
                                    alt=""
                                  />
                                </Col>
                                <Col>
                                  <Link to="#" className="text-muted font-weight-bold">
                                    {shopLogo.name ? shopLogo.name : 'Shop Logo'}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{shopLogo.formattedSize && shopLogo.formattedSize}</strong>
                                  </p>
                                </Col>

                                <div
                                  className="position-absolute"
                                  style={{
                                    left: '0px',
                                    top: '0px',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                  }}
                                >
                                  <i
                                    onClick={() => setShopLogo(null)}
                                    className="mdi mdi-delete text-danger "
                                    style={{
                                      fontSize: '25px',
                                      cursor: 'pointer',
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
                          handleAcceptedFiles(acceptedFiles, 'banner');
                        }}
                        accept=".jpg, .jpeg, .png"
                        maxSize={1000 * 1000}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div className="dropzone">
                            <div className="dz-message needsclick" {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className="mb-3">
                                <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                              </div>
                              <h4>Drop files here or click to upload.</h4>
                              <small
                                style={{
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                }}
                              >
                                * Max Image size allowed Id 1 Mb.
                              </small>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                      <div className="dropzone-previews mt-3" id="file-previews">
                        {shopBanner && (
                          <Card
                            className="
                          mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete
                          "
                          >
                            <div className="p-2">
                              <Row className="align-items-center position-relative">
                                <Col className="col-auto">
                                  <img
                                    data-dz-thumbnail=""
                                    style={{
                                      maxWidth: '80px',
                                    }}
                                    className=" bg-light"
                                    src={shopBanner.preview ? shopBanner.preview : shopBanner}
                                    alt=""
                                  />
                                </Col>
                                <Col>
                                  <Link to="#" className="text-muted font-weight-bold">
                                    {shopBanner.name ? shopBanner.name : 'Shop Banner'}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{shopBanner.formattedSize && shopBanner.formattedSize}</strong>
                                  </p>
                                </Col>

                                <div
                                  className="position-absolute"
                                  style={{
                                    left: '0px',
                                    top: '0px',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                  }}
                                >
                                  <i
                                    onClick={() => setShopBanner(null)}
                                    className="mdi mdi-delete text-danger "
                                    style={{
                                      fontSize: '25px',
                                      cursor: 'pointer',
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
                  <Button disabled={loading || isLoading} type="submit" color="primary" className="px-5">
                    {loading || isLoading ? (
                      <Spinner animation="border" variant="info" size="sm"></Spinner>
                    ) : id ? (
                      'Save'
                    ) : (
                      'Add'
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default ShopAdd;
