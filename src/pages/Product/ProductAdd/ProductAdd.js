import { Autocomplete, Box, Paper, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Col, Container, Form, Label, Row, Spinner } from 'reactstrap';
import styled from 'styled-components';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { useGlobalContext } from '../../../context';

import { getAllCategory, getAllSubCategory, updateCategoryShopType } from '../../../store/Category/categoryAction';

import { foodTypeOptions2, shopTypeOptions2 } from '../../../assets/staticData';
import formatBytes from '../../../common/imageFormatBytes';
import AutocompletedInput from '../../../components/AutocompletedInput';
import ProductAutocompleted from '../../../components/ProductAutocompleted';
import SelectOption from '../../../components/SelectOption';
import { callApi } from '../../../components/SingleApiCall';
import { successMsg } from '../../../helpers/successMsg';
import { IMAGE_UPLOAD, SINGLE_PRODUCT } from '../../../network/Api';
import requestApi from '../../../network/httpRequest';
import { addProduct, editProduct, getAllProduct, updateProductSearchKey } from '../../../store/Product/productAction';
import { getAllShop, updateShopSearchKey, updateShopType } from '../../../store/Shop/shopAction';
import { getAllUnitType } from '../../../store/unitType/unitTypeAction';

function ProductAdd() {
  const dispatch = useDispatch();
  // const { id } = useParams();
  const params = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const context = useGlobalContext();
  console.log(context);

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { categories: allCategories, subCategories } = useSelector((state) => state.categoryReducer);
  const { shops, searchKey, typeKey } = useSelector((state) => state.shopReducer);

  const { unitTypes } = useSelector((state) => state.unitTypeReducer);

  const { loading, products, status, searchKey: productSearchKey } = useSelector((state) => state.productReducer);

  const [shop, setShop] = useState(null);
  const [categories, setCategories] = useState([]);
  // const [cuisines, setCuisines] = useState(null);
  const [cuisineSearchKey, setCuisineSearchKey] = useState('');
  const [category, setCategory] = useState(null);
  const [searchCategoryKey, setSearchCategoryKey] = useState('');
  const [subCategory, setSubCategory] = useState(null);
  const [searchSubCatKey, setSearchSubCatKey] = useState('');
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState('');
  const [foodType, setFoodType] = useState('');
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');

  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isNeedAddon, setIsNeedAddon] = useState(false);
  const [addons, setAddons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNeedAttribute, setIsNeedAttribute] = useState(false);
  const [attributeName, setAttributeName] = useState('');
  const [isRequiredAttribute, setIsRequiredAttribute] = useState(false);
  const [isMultipleAttribute, setIsMultipleAttribute] = useState(false);
  const [unit, setUnit] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [attributeItems, setAttributeItems] = useState([
    {
      name: '',
      extraPrice: 0,
    },
  ]);

  // const { userType, _id: accountId } = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { userType, seller, shop: adminShop } = currentUser;

  // SET PRODUCT VALUE
  const setProductValue = (product) => {
    const {
      category,
      name,
      images,
      price,
      seoDescription,
      shop,
      subCategory,
      type,
      foodType,
      addons,
      attributes,
      discount,
      unit,
      quantity,
    } = product;

    const findUnit = unitTypes?.find((item) => item.name === unit);

    setShop(shop);
    setCategory(category);
    setSubCategory(subCategory);
    setName(name);
    setDiscount(discount);
    setPrice(price);
    setType(type);
    dispatch(updateCategoryShopType(type));
    setDescription(seoDescription);
    setFoodType(foodType);
    setImage(images[0]);
    setAddons(addons);
    setAttributes(attributes);
    setUnit(findUnit);
    setQuantity(quantity);
    setSearchCategoryKey(category?.name || '');
  };

  useEffect(() => {
    if (params?.id) {
      const findProduct = products.find((item) => item._id === params?.id);

      if (findProduct) {
        setProductValue(findProduct);
        console.log(findProduct);
      } else {
        (async function getProduct() {
          const data = await callApi(params?.id, SINGLE_PRODUCT, 'product');
          if (data) {
            setProductValue(data);
            console.log(data);
          } else {
            history.push('/products/list', { replace: true });
          }
        })();
      }
    }
  }, [params?.id]);

  useEffect(() => {
    dispatch(getAllUnitType(true));
    dispatch(getAllCategory(true, userType));
  }, []);

  // FIND SHOP BY SHOP ID

  useEffect(() => {
    if (searchParams.get('shopId') || userType === 'shop') {
      const shopId = searchParams.get('shopId');
      let shop = null;
      // eslint-disable-next-line no-unused-expressions
      shopId ? (shop = shopId) : (shop = adminShop?._id);
      if (shop) {
        const findShop = shops?.find((item) => item._id === shop);
        if (findShop) {
          setType(findShop?.shopType);
          setShop(findShop);
          dispatch(updateCategoryShopType(findShop?.shopType));
        } else {
          (async function getProduct() {
            const data = await callApi(params?.id, SINGLE_PRODUCT, 'product');
            if (data) {
              setProductValue(data);
            } else {
              history.push('/products/list', { replace: true });
            }
          })();
        }
      }
    }
  }, [searchParams, userType]);

  // ALL CATEGORY LIST
  // useEffect(() => {
  //   if (type) {
  //     dispatch(getAllCategory(true));
  //   }
  // }, [type]);

  useEffect(() => {
    if (shop && allCategories?.length) {
      const shopCatagories = allCategories.filter((item) => item?.shop?._id === shop?._id);
      setCategories(shopCatagories);
    }
  }, [shop]);

  // ALL SHOP LIST
  useEffect(() => {
    if (userType === 'shop') {
      dispatch(getAllShop(true));
    } else if ((typeKey || searchKey) && type) {
      dispatch(getAllShop(true, userType === 'seller' ? seller?._id : null));
    }
  }, [type, typeKey, searchKey, userType]);

  // ALL SUB CATEGORY LIST

  useEffect(() => {
    if (category) {
      dispatch(getAllSubCategory(true, category._id));
    }
  }, [category]);

  // SUBMIT DATA TO SERVER
  const submitData = (url) => {
    const addonsData = addons.map((item) => item._id);
    const data = {
      name,
      discount,
      price,
      foodType,
      shop: shop._id,
      images: [url],
      category: category.category,
      subCategory: subCategory?._id,
      seoDescription: description,
      attributes,
      addons: addonsData,
      // cuisines,
      unit: unit?.name,
      quantity,
    };

    if (params?.id) {
      dispatch(
        editProduct({
          ...data,
          id: params?.id,
        })
      );
    } else {
      dispatch(addProduct(data));
    }
  };

  // eslint-disable-next-line consistent-return
  const uploadImage = async () => {
    if (typeof image === 'string') {
      submitData(image);
    } else {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', image);

        const { data } = await requestApi().request(IMAGE_UPLOAD, {
          method: 'POST',
          data: formData,
        });

        setIsLoading(false);
        if (data.status) {
          submitData(data.data.url);
        } else {
          return successMsg(data.error, 'error');
        }
      } catch (error) {
        setIsLoading(false);
        return successMsg(error.message, 'error');
      }
    }
  };

  // VALIDATION
  // eslint-disable-next-line consistent-return
  const submitProduct = (e) => {
    e.preventDefault();

    if (!image) {
      return successMsg('Please Upload Image', 'error');
    }

    uploadImage();
  };

  // ADD CHOICE ITEM SINGLE
  // eslint-disable-next-line consistent-return
  const addAttributeItem = () => {
    if (attributeItems[attributeItems.length - 1].name === '') {
      return successMsg('Please Fillup Previous Input Fields', 'error');
    }
    setAttributeItems([
      ...attributeItems,
      {
        name: '',
        extraPrice: 0,
      },
    ]);
  };

  // REMOVE CHOICE ITEM FROM

  const removeAttributeItem = (i) => {
    const list = [...attributeItems];
    list.splice(i, 1);
    setAttributeItems(list);
  };

  // HANDLE CHOICE ITEM INPUT CHANGE
  const attributeItemChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...attributeItems];
    list[index][name] = value;
    setAttributeItems(list);
  };

  // ADD CHOICE
  // eslint-disable-next-line consistent-return
  const addAttribute = () => {
    if (!attributeName) {
      return successMsg('Please add attribure name', 'error');
    }
    if (attributeItems[attributeItems.length - 1].name === '') {
      return successMsg('Please at least one item', 'error');
    }
    const data = {
      name: attributeName,
      required: isRequiredAttribute,
      select: isMultipleAttribute ? 'multiple' : 'single',
      items: attributeItems,
    };
    setAttributes([...attributes, data]);
    setAttributeName('');
    setIsRequiredAttribute(false);
    setAttributeItems([
      {
        name: '',
        extraPrice: 0,
      },
    ]);
  };

  // REMOVE ATTRIBUTE

  const removeAttribute = (i) => {
    const list = [...attributes];
    list.splice(i, 1);
    setAttributes(list);
  };

  // SUCCESS
  useEffect(() => {
    if (status) {
      if (params?.id) {
        history.push('/products/list');
      } else {
        setShop(null);
        setCategory(null);
        setSubCategory(null);
        setName('');
        setDiscount('');
        setPrice('');
        setDescription('');
        setType('');

        setAttributes([]);
        setAddons([]);
        setIsRequiredAttribute(false);
        setIsNeedAddon(false);
        setAttributeItems([
          {
            name: '',
            extraPrice: 0,
          },
        ]);
        setImage(null);
        setUnit(null);
        window.scroll(0, 0);
      }
    }
  }, [status]);

  // IMAGE

  const handleAcceptedFiles = (files) => {
    // console.log(files);
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );

    setImage(files[0]);
  };

  // ADD ADDON
  // eslint-disable-next-line consistent-return
  const addAddonProduct = (item) => {
    if (item) {
      const isExist = addons.filter((i) => i._id === item._id);

      if (isExist.length > 0) {
        return successMsg('Already added.Try another');
      }

      setAddons([...addons, item]);
    }
    // setSelectedAddon(item)
  };

  // REMOVE ADDON

  const removeAddon = (i) => {
    const list = [...addons];
    list.splice(i, 1);
    setAddons(list);
  };

  // GET ALL Product

  useEffect(() => {
    if (productSearchKey) {
      dispatch(getAllProduct(true));
    }
  }, [productSearchKey]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem={params?.id ? 'Edit' : 'Add'} title="Product" isRefresh={false} />

          <Card>
            <CardBody>
              <CardTitle>Product Informations</CardTitle>
              <hr />

              <Form onSubmit={submitProduct}>
                <Row>
                  <Col lg={6}>
                    <div className="mb-4">
                      <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        style={{ width: '100%' }}
                        autoComplete="off"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <SelectOption
                        label="Type"
                        value={type}
                        onChange={(event) => {
                          setType(event.target.value);
                          dispatch(updateShopType(event.target.value));
                          dispatch(updateCategoryShopType(event.target.value));
                          setShop(null);
                          setCategory(null);
                        }}
                        options={shopTypeOptions2}
                        disabled={!!(searchParams.get('shopId') || params?.id || userType === 'shop')}
                      />
                    </div>
                    <Tooltip title={`${!type ? 'Select Type First' : ''}`}>
                      <div className="mb-4">
                        <AutocompletedInput
                          value={shop || null}
                          onChange={(event, newValue) => setShop(newValue)}
                          searchKey={searchKey}
                          onInputChange={(event, newInputValue) => dispatch(updateShopSearchKey(newInputValue))}
                          list={shops}
                          disabled={!!(!type || params?.id || searchParams.get('shopId') || userType === 'shop')}
                          type="shop"
                          showImg
                        />
                      </div>
                    </Tooltip>
                    {/* remove cusinsen */}
                    {type !== 'food' && (
                      <div className="mb-4">
                        <Autocomplete
                          className="cursor-pointer"
                          value={unit || null}
                          onChange={(event, newValue) => {
                            setUnit(newValue);
                          }}
                          getOptionLabel={(option) => (option.name ? option.name : '')}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                          inputValue={cuisineSearchKey}
                          onInputChange={(event, newInputValue) => {
                            setCuisineSearchKey(newInputValue);
                          }}
                          id="controllable-states-demo"
                          options={unitTypes.length > 0 ? unitTypes : []}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField {...params} label="Select a Unit" required name="cuisine" />
                          )}
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
                    )}
                    {type === 'food' && shop?.shopType === 'food' && (
                      <div className="mb-4">
                        <SelectOption
                          label="Food Type"
                          value={foodType}
                          onChange={(event) => {
                            setFoodType(event.target.value);
                          }}
                          options={foodTypeOptions2}
                        />
                      </div>
                    )}

                    {type && type !== 'food' && (
                      <div className="mb-4">
                        <TextField
                          id="quantity"
                          label="Quantity"
                          variant="outlined"
                          style={{ width: '100%' }}
                          placeholder="Ender quantity"
                          autoComplete="off"
                          value={quantity}
                          onChange={(event) => setQuantity(event.target.value)}
                          required
                          type="number"
                        />
                      </div>
                    )}
                  </Col>
                  <Col lg={6}>
                    <Tooltip title={`${!type ? 'Select Type First' : ''}`}>
                      <div className="mb-4">
                        <Autocomplete
                          className="cursor-pointer"
                          required
                          value={category || null}
                          disabled={!type || !shop}
                          onChange={(event, newValue) => {
                            setCategory(newValue);
                          }}
                          getOptionLabel={(option) => (option?.category?.name ? option?.category?.name : '')}
                          isOptionEqualToValue={(option, value) => option?.category?._id === value?._id}
                          inputValue={searchCategoryKey}
                          onInputChange={(event, newInputValue) => {
                            console.log(event, newInputValue);
                            if (event) {
                              setSearchCategoryKey(newInputValue);
                            }
                          }}
                          id="controllable-states-demo"
                          options={categories.length > 0 ? categories : []}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={searchCategoryKey}
                              label="Select a category"
                              required
                              name="category"
                            />
                          )}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                              {...props}
                              key={option._id}
                            >
                              {option?.category?.name}
                            </Box>
                          )}
                        />
                      </div>
                    </Tooltip>

                    {category && type !== 'food' && (
                      <div className="mb-4">
                        <Autocomplete
                          className="cursor-pointer"
                          value={subCategory || null}
                          onChange={(event, newValue) => {
                            setSubCategory(newValue);
                          }}
                          getOptionLabel={(option) => (option.name ? option.name : '')}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                          inputValue={searchSubCatKey}
                          onInputChange={(event, newInputValue) => {
                            setSearchSubCatKey(newInputValue);
                          }}
                          id="controllable-states-demo"
                          options={subCategories.length > 0 ? subCategories : []}
                          sx={{ width: '100%' }}
                          renderInput={(params) => <TextField {...params} label="Select a Sub Category" />}
                          renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                              {option.name}
                            </Box>
                          )}
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <TextField
                        id="netPrice"
                        label="Net Price"
                        variant="outlined"
                        style={{ width: '100%' }}
                        autoComplete="off"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        required
                        type="number"
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        id="seo"
                        label="Description"
                        variant="outlined"
                        style={{ width: '100%' }}
                        autoComplete="off"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                        multiline
                        rows={2}
                      />
                    </div>
                  </Col>
                </Row>

                {type === 'food' && (
                  <>
                    {/* ATTRIBUTE */}
                    <Row className="mt-3">
                      <Col lg={6}>
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={isNeedAttribute}
                                id="flexCheckDefault"
                                onChange={(e) => setIsNeedAttribute(e.target.checked)}
                              />
                              <label
                                className="form-check-label ms-1"
                                style={{ fontSize: '16px' }}
                                htmlFor="flexCheckDefault"
                              >
                                Attribute(s)
                              </label>
                            </div>
                          </div>

                          {isNeedAttribute && (
                            <div>
                              <Row className="mt-2">
                                <Col sm={8}>
                                  <TextField
                                    id="Attribute name"
                                    label="Attribute Name"
                                    variant="outlined"
                                    style={{ width: '100%' }}
                                    autoComplete="off"
                                    value={attributeName}
                                    onChange={(e) => setAttributeName(e.target.value)}
                                    type="text"
                                  />
                                </Col>
                                <Col sm={4}>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={isRequiredAttribute}
                                      id="flexCheckDefault2"
                                      onChange={(e) => setIsRequiredAttribute(e.target.checked)}
                                    />
                                    <label
                                      className="form-check-label ms-1"
                                      style={{ fontSize: '16px' }}
                                      htmlFor="flexCheckDefault2"
                                    >
                                      Required
                                    </label>
                                  </div>

                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={isMultipleAttribute}
                                      id="flexCheckDefault3"
                                      onChange={(e) => setIsMultipleAttribute(e.target.checked)}
                                    />
                                    <label
                                      className="form-check-label ms-1"
                                      style={{ fontSize: '16px' }}
                                      htmlFor="flexCheckDefault3"
                                    >
                                      Multiple
                                    </label>
                                  </div>
                                </Col>
                              </Row>
                              {attributeItems.map((item, index) => (
                                <Row className="mt-3" key={index}>
                                  <Col sm={6}>
                                    <TextField
                                      id="variant name"
                                      label="Name"
                                      name="name"
                                      variant="outlined"
                                      style={{ width: '100%' }}
                                      autoComplete="off"
                                      value={item?.name}
                                      onChange={(event) => attributeItemChange(event, index)}
                                      type="text"
                                    />
                                  </Col>
                                  <Col sm={6} className="mt-3 mt-sm-0 d-flex">
                                    <TextField
                                      id="variant extra price"
                                      name="extraPrice"
                                      label="Extra Price"
                                      variant="outlined"
                                      style={{ width: '100%' }}
                                      autoComplete="off"
                                      value={item?.extraPrice}
                                      onChange={(event) => attributeItemChange(event, index)}
                                      type="number"
                                    />
                                    {attributeItems.length > 1 && (
                                      <i
                                        className="fas fa-trash cursor-pointer ms-1"
                                        style={{
                                          color: 'red',
                                          fontSize: '18px',
                                        }}
                                        onClick={() => removeAttributeItem(index)}
                                      ></i>
                                    )}
                                  </Col>
                                  {attributeItems.length - 1 === index && (
                                    <div>
                                      <Button outline color="primary" className="mt-2" onClick={addAttributeItem}>
                                        Add Item
                                      </Button>
                                    </div>
                                  )}
                                </Row>
                              ))}

                              <div className="mt-3 text-center">
                                <Button outline color="success" size="lg" className="px-5" onClick={addAttribute}>
                                  Add
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6}>
                        {attributes.length > 0 && (
                          <div className="mb-4">
                            <Paper className="py-2">
                              <h5 className="text-center">Attributes List</h5>
                              <hr />
                              {attributes.length > 0 &&
                                attributes.map((attribute, index) => (
                                  <ul key={index} style={{ listStyleType: 'square' }}>
                                    <li>
                                      <div className="d-flex justify-content-between">
                                        <span
                                          style={{
                                            fontSize: '15px',
                                            fontWeight: '500',
                                          }}
                                        >
                                          {`${attribute.name} ${attribute.required ? '(Required)' : ''} ${
                                            attribute.select === 'multiple' ? '(Multiple)' : '(Single)'
                                          }`}
                                        </span>
                                        <i
                                          className="fas fa-trash cursor-pointer me-3"
                                          style={{
                                            color: '#BD381C',
                                            fontSize: '15px',
                                          }}
                                          onClick={() => removeAttribute(index)}
                                        ></i>
                                      </div>
                                    </li>
                                    {attribute.items.map((item) => (
                                      <ul key={item.name}>
                                        <li>
                                          <span>{item.name}-</span>
                                          <span className="ms-1">{item.extraPrice}</span>
                                        </li>
                                      </ul>
                                    ))}
                                  </ul>
                                ))}
                            </Paper>
                          </div>
                        )}
                      </Col>
                    </Row>

                    {/* ADDON */}

                    <Row className="mt-4">
                      <Col lg={6}>
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={isNeedAddon}
                                id="flexCheckDefault3"
                                onChange={(e) => setIsNeedAddon(e.target.checked)}
                              />
                              <label
                                className="form-check-label ms-1"
                                style={{ fontSize: '16px' }}
                                htmlFor="flexCheckDefault3"
                              >
                                Addon(s)
                              </label>
                            </div>
                          </div>

                          {isNeedAddon && (
                            <ProductAutocompleted
                              onChange={(event, newValue) => {
                                addAddonProduct(newValue);
                              }}
                              searchKey={productSearchKey}
                              onInputChange={(event, newInputValue) => dispatch(updateProductSearchKey(newInputValue))}
                              list={products}
                              required={false}
                            />
                          )}
                        </div>
                      </Col>
                      <Col lg={6}>
                        {addons.length > 0 && (
                          <div className="mb-4">
                            <Paper className="py-2">
                              <h5 className="text-center">Addons List</h5>
                              <hr />
                              {addons.length > 0 &&
                                addons.map((item, index) => (
                                  <ul key={Math.random()} style={{ listStyleType: 'square' }}>
                                    <li>
                                      <div className="d-flex justify-content-between">
                                        <div>
                                          <img loading="lazy" width="60" src={item.images[0]} alt="" />
                                          <span
                                            style={{
                                              fontSize: '15px',
                                              fontWeight: '500',
                                              marginLeft: '10px',
                                            }}
                                          >
                                            {item.name}
                                          </span>
                                        </div>
                                        <i
                                          className="fas fa-trash cursor-pointer me-3"
                                          style={{
                                            color: '#BD381C',
                                            fontSize: '15px',
                                          }}
                                          onClick={() => removeAddon(index)}
                                        ></i>
                                      </div>
                                    </li>
                                  </ul>
                                ))}
                            </Paper>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </>
                )}

                <Row>
                  <Col>
                    <Label>Product Images</Label>
                    <div className="mb-5">
                      <Dropzone
                        onDrop={(acceptedFiles) => {
                          handleAcceptedFiles(acceptedFiles);
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
                              <Declaration>
                                <small>* Max Image size allowed 1 Mb.</small>
                              </Declaration>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                      <div className="dropzone-previews mt-3" id="file-previews">
                        {image && (
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
                                    src={image.preview ? image.preview : image}
                                    alt=""
                                  />
                                </Col>
                                <Col>
                                  <Link to="#" className="text-muted font-weight-bold">
                                    {image.name ? image.name : 'Product Image'}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{image.formattedSize && image.formattedSize}</strong>
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
                                    onClick={() => setImage(null)}
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
                  <Button type="submit" color="primary" className="px-5" disabled={loading || isLoading}>
                    {loading || isLoading ? (
                      <Spinner animation="border" variant="info" size="sm"></Spinner>
                    ) : params?.id ? (
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

const Declaration = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
`;

export default ProductAdd;
